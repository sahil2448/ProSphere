const { default: axios } = require("axios");

const BASE_URL = "http://localhost:9090";
const clientServer = axios.create({
  baseURL: "http://localhost:9090",
});

export { clientServer, BASE_URL };
