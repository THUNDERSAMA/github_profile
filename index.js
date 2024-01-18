const express = require("express");
const axios = require("axios");
 var path = require('path')

const app = express();
const PORT = 3030;
var path = require('path')

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
const accessToken = process.env.scraptoken;

const headers = {
  Authorization: `Bearer ${accessToken}`,
};
app.get("/", (req, res) => {
  res.render("index");
});

// var uinfo={};
// var repositoriesResponse;
app.post("/repositories", async (req, res) => {
  try {
    const { username } = req.body;
    const page = 1;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;


    const repositoriesResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,{ headers } 
    );
    const repositoriesusername = await axios.get(
      `https://api.github.com/users/${username}`,{ headers }
    );

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
        `https://api.github.com/repos/${username}/${repo.name}/languages`,{ headers }
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
        "Error fetching repositories. Make sure the username and page are correct.",
    });
  }
});

app.get("/repositories/:username/:page", async (req, res) => {
  try {
    const { username, page } = req.params;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const repositoriesResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,{ headers }
    );
    const repositoriesusername = await axios.get(
      `https://api.github.com/users/${username}`,{ headers }
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
//console.log(username);
    const repositories = repositoriesResponse.data
      .map(repo =>({name:repo.name,description:repo.description,url:repo.html_url}))
      .slice(startIndex, endIndex);

      const languagesPromises = repositories.map(async (repo) => {
        const languagesResponse = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/languages`,{ headers }
        );
        return { repo, languages: Object.keys(languagesResponse.data) };
      });
    const languagesData = await Promise.all(languagesPromises);
    const cpage=page;
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

app.get("/error", (req, res) => {
  res.render("error", { error: "An error occurred." });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT 3000`);
});

