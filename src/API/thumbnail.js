const url = "/api/images/thumbnails";

export const getThumbnail = (series) =>
  fetch(`${url}/${series}`, {
    headers: {
      Authorization: `${localStorage.getItem("SavedToken")}`,
    },
  });
