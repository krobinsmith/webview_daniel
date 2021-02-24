import axios from "axios";

const url = "/api/aes";

let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const getAEs = () => axios(url, headers);
