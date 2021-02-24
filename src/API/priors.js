import axios from "axios";
const url = `/api/studies`;
let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const getPriors = (pbStudy) =>
  axios({
    method: "get",
    headers,
    url: `${url}/${pbStudy}/priors`,
  });
