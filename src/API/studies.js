import axios from "axios";

const headers = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
};
const url = `/api`;

// export const getStudies = (current_page, direction, filterString) =>
//   axios({
//     method: "get",
//     headers,
//     url:
//       `${url}/studies/?page[number]=${current_page}&page[size]=46` +
//       direction
//       // filterString,
//   });

export const getStudies = (current_page, direction, queryString) =>
  axios({
    method: "get",
    headers,
    url:
      `${url}/studies/?page[number]=${current_page}&page[size]=46` +
      direction +
      queryString,
  });

export const generateURL = (studyID, term) =>
  axios({
    method: "get",
    headers,
    url: `${url}/studies/${studyID}/access-url`,
    params: {
      term,
    },
  });

export const deleteStudy = (studyID) =>
  axios({
    method: "DELETE",
    headers,
    url: `${url}/studies/${studyID}`,
  });

export const getStudyDiagnosis = (pbStudy) =>
  axios({
    method: "get",
    headers,
    url: `${url}/studies-diagnosis/${pbStudy}`,
  });

export const setStudyDiagnosis = (pbStudy, report) =>
  axios({
    method: "put",
    headers,
    url: `${url}/studies-diagnosis/${pbStudy}`,
    data: { report },
  });

export const getStudy = (pbStudy) =>
  axios({
    method: "get",
    headers,
    url: `${url}/studies/${pbStudy}`,
  });

export const updateStudy = (pbStudy, data) =>
  axios({
    method: "patch",
    headers,
    url: `${url}/studies/${pbStudy}`,
    data,
  });

export const updatePatient = (pbStudy, data) =>
  axios({
    method: "patch",
    headers,
    url: `${url}/studies/${pbStudy}/patient`,
    data,
  });
