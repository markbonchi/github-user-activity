#!/usr/bin/env node
import { error } from "console";
import { argv } from "process";

// const url = `https://api.github.com/users/${username}/events`;
// compare_url = `https://api.github.com/repos/${username}/${repo}/compare/${base}...${head}`;

// (() => {
//   if (!argv[2]) return console.log("Usage: github-activity <username>");
//   fetch(`https://api.github.com/users/${argv[2]}/events`, {
//     headers: {
//       "User-Agent": "node.js",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       for (let i = 0; i < data.length; i++) {
//         console.log(data[i].repo.name, data[i].type);
//       }
//     })
//     .catch((error) => console.error(error));
//   // console.log(argv[2]);
// })();

// Fetch github api from url
const fetchGithubUserEvents = async (username) => {
  try {
    const url = `https://api.github.com/users/${username}/events`;
    const header = {
      "User-Agent": "node",
      "Content-Type": "application/json",
    };
    const response = await fetch(url, header);
    // console.log(response);

    if (!response.ok) throw new Error("could not fetch resource");
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
    console.error(error);
  }
};

// function to respond to terminal
fetchGithubUserEvents(argv[2]).then((event) => {
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
      default:
        break;
    }
  });
});
