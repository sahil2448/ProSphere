const { default: axios } = require("axios");

// const BASE_URL = "http://localhost:9090";
const BASE_URL = "https://protweet.onrender.com";
const clientServer = axios.create({
  baseURL: "https://protweet.onrender.com",
  // baseURL: "http://localhost:9090",
});

export { clientServer, BASE_URL };
