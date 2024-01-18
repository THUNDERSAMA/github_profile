const express = require("express");
const axios = require("axios");
 var path = require('path')

const app = express();
const PORT = 3030;
var path = require('path')

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
// Home route with a form to submit GitHub username
app.get("/", (req, res) => {
  res.render("index");
});
// var uinfo={};
// var repositoriesResponse;
// Route to handle form submission
app.post("/repositories", async (req, res) => {
  try {
    const { username } = req.body;
    const page = 1;
    const perPage = 9;
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
   const uinfo={
     url:repositoriesusername.data.url,
     img:repositoriesusername.data.avatar_url,
     name:repositoriesusername.data.name,
     followers:repositoriesusername.data.followers,
     following:repositoriesusername.data.following,
     public_repos:repositoriesusername.data.public_repos
    } ;
    const repositories = repositoriesResponse.data
      .map(repo =>({name:repo.name,description:repo.description,url:repo.html_url}))
      .slice(startIndex, endIndex);
    const languagesPromises = repositories.map(async (repo) => {
      const languagesResponse = await axios.get(
        `https://api.github.com/repos/${username}/${repo.name}/languages`,
      );
      return { repo, languages: Object.keys(languagesResponse.data) };
    });

    // Wait for all promises to resolve
    const languagesData = await Promise.all(languagesPromises);
    const cpage=1;
    const tpage=(Math.ceil(repositoriesResponse.data.length/9));  
    res.render("repositories", {
      repositories: languagesData,
      username,
      uinfo,
      cpage,
      tpage

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

    //Get user's repositories from GitHub API
    const repositoriesResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
    );
    const repositoriesusername = await axios.get(
      `https://api.github.com/users/${username}`,
    );
    //console.log(repositoriesusername);
   const uinfo={
     url:repositoriesusername.data.url,
     img:repositoriesusername.data.avatar_url,
     name:repositoriesusername.data.name,
     followers:repositoriesusername.data.followers,
     following:repositoriesusername.data.following,
     public_repos:repositoriesusername.data.public_repos
    } ;
console.log(username);
    // Extract repository names
    const repositories = repositoriesResponse.data
      .map(repo =>({name:repo.name,description:repo.description,url:repo.html_url}))
      .slice(startIndex, endIndex);

      const languagesPromises = repositories.map(async (repo) => {
        const languagesResponse = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/languages`,
        );
        return { repo, languages: Object.keys(languagesResponse.data) };
      });
    const languagesData = await Promise.all(languagesPromises);
    const cpage=1;
    const tpage=(Math.ceil(repositoriesResponse.data.length/9));  
    res.render("repositories", {
      repositories: languagesData,
      username,
      uinfo,
      cpage,
      tpage

    });
  } catch (error) {
    console.log(error);
    res.render("error", {
      error:
        "Error fetching repositories. Make sure the username and page are correct."+error,
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

