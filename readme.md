<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">GitHub Repository Search Engine</h3>

  <p align="center">
   This is a simple web application built using Express.js and Axios that allows users to search for a GitHub user's repositories and view details about each repository, including its languages.
    <br />
    <a href="[https://github.com/othneildrew/Best-README-Template](https://github-profile-nw3k.onrender.com/)"><strong>View Demo »</strong></a>
    <br />
  </p>
</div>



## Features

- Search for a GitHub user's repositories
- View repository details, including name, description, and URL
- View repository languages
- Pagination for repository results

## Technology Stack

- Express.js
- Axios
- EJS templating engine
- GitHub API

## Getting Started

To get started with the application, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Start the server by running `npm start`.
4. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

## Usage

To search for a GitHub user's repositories, enter the username in the search bar and click the "go" button. The application will then display the user's repositories, along with their details and languages. You can also navigate through the pages of repository results.

## API Documentation

The application uses the GitHub API to fetch the user's repositories and their details. The API endpoints used are:

- [https://api.github.com/users/{username}/repos](https://api.github.com/users/{username}/repos)
- [https://api.github.com/users/{username}](https://api.github.com/users/{username})
- [https://api.github.com/repos/{username}/{repo_name}/languages](https://api.github.com/repos/{username}/{repo_name}/languages)



