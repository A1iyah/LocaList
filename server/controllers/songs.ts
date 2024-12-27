import axios from "axios";
import express from "express";
// import { axiosServer } from "../utils/axiosServer";

const axiosServer = axios.create({
  baseURL: "https://shazam-core.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": "696200657cmsh29253769644c40fp10230djsna6a4b5b94706",
    "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
  },
});

// For Top Play & Discover & Top Artists
export const getSongs = async (req: express.Request, res: express.Response) => {
  try {
    const { country_code } = req.query;

    if (!country_code) {
      return res.status(400).json({ error: "Country code is required." });
    }

    const response = await axiosServer.get(`/v1/charts/world`, {
      params: { country_code },
    });

    const limitedSongs = response.data.slice(0, 30);

    res.json(limitedSongs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).send("server get songs error");
  }
};

// For Discover
export const getGenre = async (req: express.Request, res: express.Response) => {
  try {
    const { genreCode = "POP", countryCode = "US" } = req.query;

    const response = await axiosServer.get(
      `/v1/charts/genre-world?genre_code=${genreCode}&country_code=${countryCode}`
    );

    const limitedSongs = response.data.slice(0, 30);
    res.json(limitedSongs);
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// For Around You
export const getCountry = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { country_code } = req.query;

    if (!country_code) {
      return res.status(400).json({ error: "Country code is required." });
    }

    const response = await axiosServer.get("/v1/charts/country", {
      params: { country_code },
    });

    const limitedSongs = response.data.slice(0, 30);

    res.json(limitedSongs);
  } catch (error) {
    console.error("Error fetching country:", error);
    res.status(500).send("server get country error");
  }
};

// For Artist Details
export const getArtistDetails = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { artistId } = req.query;

    if (!artistId) {
      return res.status(400).json({ error: "Artist ID is required." });
    }

    const response = await axiosServer.get(
      `/v2/artists/details?artist_id=${artistId}`,
      {
        params: { artistId },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching artist details:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// For Search
export const getSearch = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let { searchTerm } = req.query;

    if (!searchTerm || searchTerm === "") {
      searchTerm = " Not Found ";
    }

    const response = await axiosServer.get(
      `/v1/search/multi?search_type=SONGS_ARTISTS&query=${searchTerm}`,
      {}
    );

    const limitedSongs = response.data.tracks.hits || [];
    res.json(limitedSongs.slice(0, 30));
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
