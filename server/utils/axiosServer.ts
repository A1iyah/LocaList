import axios from "axios";

export const axiosServer = axios.create({
  baseURL: "https://shazam-core.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "696200657cmsh29253769644c40fp10230djsna6a4b5b94706",
    "x-rapidapi-host": "shazam-core.p.rapidapi.com",
  },
});
