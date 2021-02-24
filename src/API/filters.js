import axios from "axios";
const url = `/api/wpb-filters`;

let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const getFilters = () =>
  axios({
    method: "get",
    headers,
    url: `${url}`,
  });

export const deleteFilter = (filter) =>
  axios({
    method: "delete",
    headers,
    url: `${url}/${filter}`,
  });

export const createFilter = (data) =>
  axios({
    method: "post",
    headers,
    url: `${url}`,
    data,
  });

export const updateFilter = (filterID, data) =>
  axios({
    method: "patch",
    headers,
    url: `${url}/${filterID}`,
    data,
  });

export const getFilter = (filter) =>
  axios({
    method: "get",
    headers,
    url: `${url}/${filter}`,
  });
