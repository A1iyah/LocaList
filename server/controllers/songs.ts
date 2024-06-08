import express from "express";
import { axiosServer } from "../utils/axiosServer";

// For Top Play & Discover & Top Artists
export const getSongs = async (req: express.Request, res: express.Response) => {
  try {
    const response = await axiosServer.get(`/v1/charts/world`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ error: "Error fetching songs" });
  }
};

// For Discover
export const getGenre = async (req: express.Request, res: express.Response) => {
  try {
    let { genreCode } = req.query;

    if (!genreCode || genreCode === "") {
      genreCode = "pop";
    }

    const response = await axiosServer.get(`/v1/charts/genre-world`, {
      params: { genre_code: genreCode },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching country:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    const response = await axiosServer.get(`/v2/artists/details`, {
      params: { artist_id: artistId },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching artist details:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
      searchTerm = "Not Found";
    }

    const response = await axiosServer.get(`/v1/search/multi`, {
      params: { search_type: "SONGS_ARTISTS", query: searchTerm },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
