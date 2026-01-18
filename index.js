#!/usr/bin/env node
import { argv, env } from "process";

// const url = `https://api.github.com/users/${username}/events`;
// compare_url = `https://api.github.com/repos/${username}/${repo}/compare/${base}...${head}`;

// const token = env.TOKEN;

// Fetch github api from url
const fetchGithubUserEvents = async (username) => {
  try {
    const url = `https://api.github.com/users/${username}/events`;
    const header = {
      "User-Agent": "node",
      "Content-Type": "application/json",
      // authentication: token,
    };
    const response = await fetch(url, header);

    if (!response.ok) throw new Error("Could not fetch resource");
    return response.json();
  } catch (error) {
    return console.error(error);
  }
};

// function to fetch total commit_count from compare_url
const repoCompareData = async (repo, head, base) => {
  try {
    const compare_url = `https://api.github.com/repos/${repo}/compare/${base}...${head}`;
    const header = {
      "User-Agent": "node",
      "Content-Type": "application/json",
    };
    const response = await fetch(compare_url, header);
    if (!response.ok) throw new Error("could not fetch resource");
    return response.json();
  } catch (error) {
    return console.error(error);
  }
};

const displayUserActivity = (event) => {
  if (!event) throw new Error("Could not fetch events (undefined)");
  if (!event.length) return console.log("There is no activity yet");
  event.forEach((item) => {
    switch (item.type) {
      case "PushEvent":
        repoCompareData(
          item.repo.name,
          item.payload.head,
          item.payload.before
        ).then((res) =>
          console.log(
            `Pushed ${res.total_commits} commits to ${item.repo.name}`
          )
        );
        break;
      case "IssueEvent":
        console.log(
          `${
            item.payload.action[0].toUpperCase() + item.payload.action.slice(1)
          } an issue in ${item.repo.name}`
        );
        break;
      case "IssueCommentEvent":
        console.log(
          `${
            item.payload.action[0].toUpperCase() + item.payload.action.slice(1)
          } an issue comment in ${item.repo.name}`
        );
        break;
      case "CreateEvent":
        console.log(`Created ${item.repo.name}`);
        break;
      case "ForkEvent":
        console.log(`Forked ${item.repo.name}`);
        break;
      case "PullRequestEvent":
        console.log(
          `${
            item.payload.action[0].toUpperCase() + item.payload.action.slice(1)
          } a pull request in ${item.repo.name}`
        );
        break;
      case "WatchEvent":
        console.log(`Starred ${item.repo.name}`);
        break;
      default:
        break;
    }
  });
};

// Respond to terminal
if (!argv[2]) {
  console.error(
    `Please provide a valid GitHub Username \nUsage: 'github-activity <username>'`
  );
} else {
  fetchGithubUserEvents(argv[2])
    .then((event) => {
      displayUserActivity(event);
    })
    .catch((error) => console.error(error));
}
