
/*
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// TMDb API setup
const TMDB_API_KEY = '7f1173b293f68db2849094212b8f017b'; // Replace with your TMDb API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Your website link
const WEBSITE_LINK = 'https://coderx-films.onrender.com/';

// Create Movies folder if it doesn't exist
const OUTPUT_FOLDER = './Movies';
if (!fs.existsSync(OUTPUT_FOLDER)) {
  fs.mkdirSync(OUTPUT_FOLDER);
}

// Function to fetch movie poster
async function fetchMoviePoster(movieName) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: movieName,
      },
    });

    const movie = response.data.results[0]; // Get the first result
    if (!movie) {
      throw new Error(`Movie "${movieName}" not found.`);
    }

    const posterPath = movie.poster_path;
    return `https://image.tmdb.org/t/p/original${posterPath}`;
  } catch (error) {
    console.error(`Error fetching movie poster: ${error.message}`);
    return null;
  }
}

// Function to generate canvas with movie poster, "Watch Now" text, and website link
async function createMoviePoster(movieName) {
  try {
    const posterUrl = await fetchMoviePoster(movieName);
    if (!posterUrl) return;

    // Load the movie poster
    const posterImage = await loadImage(posterUrl);

    // Set canvas size based on the poster
    const canvasWidth = posterImage.width;
    const canvasHeight = posterImage.height;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Draw the movie poster
    ctx.drawImage(posterImage, 0, 0, canvasWidth, canvasHeight);

    // Style settings for the text
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white'; // White text
    ctx.strokeStyle = 'black'; // Text outline
    ctx.lineWidth = 3;

    // Add shadow for aesthetic appeal
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Add "Watch Now" text (centered)
    ctx.font = 'bold 190px Arial';
    ctx.strokeText('Watch Now', canvasWidth / 2, canvasHeight / 2 - 20);
    ctx.fillText('Watch Now', canvasWidth / 2, canvasHeight / 2 - 20);

    // Add website link below "Watch Now"
    ctx.font = 'bold 90px Arial';
    ctx.strokeText(WEBSITE_LINK, canvasWidth / 2, canvasHeight / 2 + 60);
    ctx.fillText(WEBSITE_LINK, canvasWidth / 2, canvasHeight / 2 + 60);

    // Save the canvas as a JPG file
    const outputPath = path.join(OUTPUT_FOLDER, `${movieName}.jpg`);
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    out.on('finish', () => console.log(`Saved poster: ${outputPath}`));
  } catch (error) {
    console.error(`Error creating movie poster: ${error.message}`);
  }
}

// Example usage
(async () => {
  const movies = ['Inception']; // Add your movie names here

  for (const movie of movies) {
    await createMoviePoster(movie);
  }
})();
*/

const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const axios = require("axios");
const app = express();
const PORT = 3000;

// TMDb API setup
const TMDB_API_KEY = '7f1173b293f68db2849094212b8f017b'; // Replace with your TMDb API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const WEBSITE_LINK = 'https://coderx-films.onrender.com/';

// Fetch movie poster URL
async function fetchMoviePoster(movieName) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query: movieName },
    });
    const movie = response.data.results[0];
    if (!movie) throw new Error("Movie not found.");
    return `https://image.tmdb.org/t/p/original${movie.poster_path}`;
  } catch (error) {
    console.error(`Error fetching poster: ${error.message}`);
    return null;
  }
}

// Generate movie poster canvas
async function generatePoster(movieName) {
  const posterUrl = await fetchMoviePoster(movieName);
  if (!posterUrl) throw new Error("Unable to fetch poster.");

  const posterImage = await loadImage(posterUrl);
  const canvas = createCanvas(posterImage.width, posterImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(posterImage, 0, 0, posterImage.width, posterImage.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;

  // Add "Watch Now" text
  ctx.font = "bold 190px Arial";
  ctx.strokeText("Watch Now", canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText("Watch Now", canvas.width / 2, canvas.height / 2 - 20);

  // Add website link
  ctx.font = "bold 90px Arial";
  ctx.strokeText(WEBSITE_LINK, canvas.width / 2, canvas.height / 2 + 60);
  ctx.fillText(WEBSITE_LINK, canvas.width / 2, canvas.height / 2 + 60);

  return canvas.toBuffer("image/jpeg");
}

// Serve static files (HTML & CSS)
app.use(express.static("public"));

// API endpoint to generate movie poster
app.get("/generate", async (req, res) => {
  const movieName = req.query.movieName;
  if (!movieName) return res.status(400).send("Movie name is required.");

  try {
    const posterBuffer = await generatePoster(movieName);
    res.set("Content-Type", "image/jpeg");
    res.send(posterBuffer);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
