const express = require("express");
const axios = require("axios");
 var path = require('path')

const app = express();
const PORT = 3000;
var path = require('path')

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
// Home route with a form to submit GitHub username
app.get("/", (req, res) => {
  res.render("index");
});
var uinfo={};
// Route to handle form submission
app.post("/repositories", async (req, res) => {
  try {
    const { username } = req.body;
    const page = 1;
    const perPage = 8;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    // Get user's repositories from GitHub API
    const repositoriesResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
    );
    const repositoriesusername = await axios.get(
      `https://api.github.com/users/${username}`,
    );
    //console.log(repositoriesusername);
   uinfo={
     url:repositoriesusername.data.url,
     img:repositoriesusername.data.avatar_url,
     name:repositoriesusername.data.name,
     followers:repositoriesusername.data.followers,
     following:repositoriesusername.data.following,
     public_repos:repositoriesusername.data.public_repos
    } ;
    console.log(uinfo);
    // Extract repository names
    const repositories = repositoriesResponse.data
      .map(repo =>({name:repo.name,description:repo.description,url:repo.html_url}))
      .slice(startIndex, endIndex);
      console.log(repositories)
    // Fetch languages for each repository
    const languagesPromises = repositories.map(async (repo) => {
      const languagesResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/languages`,
      );
      return { repo, languages: Object.keys(languagesResponse.data) };
    });

    // Wait for all promises to resolve
    const languagesData = await Promise.all(languagesPromises);

    // Render the repositories page with languages
    res.render("repositories", {
      repositories: languagesData,
      username,
      uinfo,
    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      error:
        "Error fetching repositories. Make sure the username and page are correct.",
    });
  }
});

// Route to display repositories with languages
app.get("/repositories/:username/:page", async (req, res) => {
  try {
    const { username, page } = req.params;
    const perPage = 8;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    // Get user's repositories from GitHub API
    const repositoriesResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
    );

    // Extract repository names
    const repositories = repositoriesResponse.data
      .map((repo) => repo.name)
      .slice(startIndex, endIndex);

    // Fetch languages for each repository
    const languagesPromises = repositories.map(async (repo) => {
      const languagesResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo}/languages`,
      );
      return { repo, languages: Object.keys(languagesResponse.data) };
    });

    // Wait for all promises to resolve
    const languagesData = await Promise.all(languagesPromises);

    // Render the repositories page with languages
    res.render("repositories", {
      repositories: languagesData,
      username,
      uinfo,
    });
  } catch (error) {
    res.render("error", {
      error:
        "Error fetching repositories. Make sure the username and page are correct.",
    });
  }
});

// Error page
app.get("/error", (req, res) => {
  res.render("error", { error: "An error occurred." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on PORT 3000`);
});

