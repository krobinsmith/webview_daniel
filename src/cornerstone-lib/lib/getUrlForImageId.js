const scheme = 'wadouri';
const base = '/cornerstone/studies';
const seriesNumber = 0;

export default function (imageId) {
  return `${scheme}:${base}/${seriesNumber}/${imageId}`;
}
