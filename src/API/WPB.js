import axios from "axios";

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
};
const url = `/api/wpb-settings`;

export const getWPBSettings = () =>
  axios({
    method: "get",
    headers,
    url,
  });

export const setWPBSettings = (data) =>
  axios({
    method: "put",
    headers,
    url,
    data,
  });
