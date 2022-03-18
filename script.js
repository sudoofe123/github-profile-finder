"use strict";

const APIURL = "https://api.github.com/users/";

// function getUser(username) {
//   axios(APIURL + username)
//     .then((response) => console.log(response.data))
//     .catch((error) => console.log(error));
// }

// getUser("sudoofe123");

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");
const overlay = document.querySelector(".overlay");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCard("No profile with this username");
      console.log(error);
    }
  }
}

// getUser("sudoofe123");

//////////////////////////////////////get repos
async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos");

    addReposToCard(data);
  } catch (error) {
    if (error.response.status == 404) {
      createErrorCard("Problem fetching repos");
      console.log(error);
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);
    search.value = " ";
  }
});

function createUserCard(user) {
  const cardHTML = ` <div class="card">
    <div>
      <img
        src="${user.avatar_url}"
        alt="${user.name}"
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${user.name}</h2>
      <p>
      ${user.bio}
      </p>

      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following}<strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos">
        
      </div>
    </div>
  </div>`;
  main.innerHTML = cardHTML;
}
// <a href="#" class="repo">Repo 1</a>
// <a href="#" class="repo">Repo 2</a>
// <a href="#" class="repo">Repo 3</a>

function createErrorCard(msg) {
  const cardHTML = `<div class="card">
    <h1> ${msg} </h1>
    </div>`;
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 4).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}
