import tt from '@tomtom-international/web-sdk-maps';
import getWeather from "./openmeteo.js";
import renderTemplate from "./render.js";
import initAudio from "./WebAudioAPI.js";

const API_KEY = 'zbmXBwVPTwQYbsI3w29DcGKgwYYIbMir';

const dataContainer = document.getElementById('data');

const map = tt.map({
  key: API_KEY,
  container: 'map'
});

let marker;
export let coords = {
  latitude: 0,
  longitude: 0
}

function setCoords(lat, lon) {
  coords.latitude = lat;
  coords.longitude = lon;
  baseParams.latitude = lat;
  baseParams.longitude = lon;
}


map.on("click", async (event) => {
  const lngLat = event.lngLat;
  document.getElementById("coords").textContent =
    `${lngLat.lat}, ${lngLat.lng}`;

  if (marker) marker.remove();

  marker = new tt.Marker().setLngLat(lngLat).addTo(map);

  setCoords(lngLat.lat, lngLat.lng);

  await getStaticImg(baseParams);
  const weather = await getWeather();
  renderTemplate(dataContainer, weather.current);
  await initAudio(weather.current);
});

/**
 * Параметры запроса
 * @type {{baseURL: string, versionNumber: number, layer: string, style: string, zoom: number, latitude: number, longitude: number, format: string, key: string}}
 */
const baseParams = {
  baseURL: 'api.tomtom.com',
  versionNumber: 1,
  layer: 'sat',
  style: 'main',
  zoom: 17,
  latitude: coords.latitude,
  longitude: coords.longitude,
  format: 'jpg',
  key: API_KEY
}

/**
 * Convert latitude/longitude coordinates to tile
 * @param lat
 * @param lon
 * @param zoomLevel
 * @param params
 */
function latLonToTileZXY(lat, lon, zoomLevel, params) {
  const MIN_ZOOM_LEVEL = 0
  const MAX_ZOOM_LEVEL = 22
  const MIN_LAT = -85.051128779807
  const MAX_LAT = 85.051128779806
  const MIN_LON = -180.0
  const MAX_LON = 180.0

  if (
    zoomLevel == undefined ||
    isNaN(zoomLevel) ||
    zoomLevel < MIN_ZOOM_LEVEL ||
    zoomLevel > MAX_ZOOM_LEVEL
  ) {
    throw new Error(
      "Zoom level value is out of range [" +
      MIN_ZOOM_LEVEL.toString() +
      ", " +
      MAX_ZOOM_LEVEL.toString() +
      "]"
    )
  }

  if (lat == undefined || isNaN(lat) || lat < MIN_LAT || lat > MAX_LAT) {
    throw new Error(
      "Latitude value is out of range [" +
      MIN_LAT.toString() +
      ", " +
      MAX_LAT.toString() +
      "]"
    )
  }

  if (lon == undefined || isNaN(lon) || lon < MIN_LON || lon > MAX_LON) {
    throw new Error(
      "Longitude value is out of range [" +
      MIN_LON.toString() +
      ", " +
      MAX_LON.toString() +
      "]"
    )
  }

  let z = Math.trunc(zoomLevel)
  let xyTilesCount = Math.pow(2, z)
  let x = Math.trunc(Math.floor(((lon + 180.0) / 360.0) * xyTilesCount))
  let y = Math.trunc(
    Math.floor(
      ((1.0 -
          Math.log(
            Math.tan((lat * Math.PI) / 180.0) +
            1.0 / Math.cos((lat * Math.PI) / 180.0)
          ) /
          Math.PI) /
        2.0) *
      xyTilesCount
    )
  )

  params.Z = z.toString();
  params.X = x.toString();
  params.Y = y.toString();
}

const image = document.querySelector('#image');

async function getStaticImg(params) {
  latLonToTileZXY(params.latitude, params.longitude, params.zoom, params);
  try {
    const response = await fetch(`https://${params.baseURL}/map/${params.versionNumber}/tile/${params.layer}/${params.style}/${params.zoom}/${params.X}/${params.Y}.${params.format}?key=${params.key}`, {
      method: 'get'
    })
    console.log('mapbox' ,response);
    image.src = response.url;
  }
  catch (e) {
    console.log(e);
  }
  finally {

  }
}