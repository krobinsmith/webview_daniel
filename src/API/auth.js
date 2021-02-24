import axios from "axios";

const url = "http://lkmt.kometa-pacs.info/api/auth/";

let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const logout = () => axios(`/api/auth/logout`, headers);

export const login = ({ username, password }) =>
  axios({
    method: "post",
    url: "/api/auth/login",
    data: {
      username,
      password,
    },
  });
