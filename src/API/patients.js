import axios from "axios";
const url = `/api/patients`;
let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const addPatient = (data) =>
  axios({
    method: "post",
    headers,
    url: `${url}`,
    data,
  });
