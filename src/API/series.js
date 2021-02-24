import axios from "axios";
const url = "/api/series";

export const getSeries = (rowSelected) =>
  axios(`${url}?filter[study_id]=${rowSelected}`);

export const getSeriesTags = (pbStudy) => axios(`${url}/${pbStudy}/dicom-tags`);
