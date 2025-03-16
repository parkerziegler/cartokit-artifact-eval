performance.mark("fe-start");

// Begin program.
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import mapboxgl from "mapbox-gl";
import penumbraPaths from "./data/nyt-nasa-penumbra-paths.json";
mapboxgl.accessToken = "pk.eyJ1IjoicGFya2VyemllZ2xlciIsImEiOiJjbG5tYm01Mm0yNWQ2Mm9wZTMzbXVmMW5hIn0.BNtWKuymyJJh-eEWoGuhCg";
const map = new mapboxgl.Map({
  container: "map",
  style: "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json",
  center: [-98.34999999999718, 39.49999999999946],
  zoom: 3.2252913626847053,
});
map.on("load", () => {
  map.addSource("penumbra-paths__1", { type: "geojson", data: penumbraPaths });
  map.addLayer({
    id: "penumbra-paths__1",
    source: "penumbra-paths__1",
    type: "fill",
    paint: { "fill-color": "#4202d4", "fill-opacity": 0.75 },
  });
  map.addLayer({
    id: "penumbra-paths__1-stroke",
    source: "penumbra-paths__1",
    type: "line",
    paint: { "line-color": "#4202d4" },
  });
});

// End program.
performance.mark("fe-end");

map.once("idle", () => {
  performance.mark("fe-ttq-end");

  const { duration: feDuration } = performance.measure(
    "fe",
    "fe-start",
    "fe-end"
  );
  const { duration: feIdleDuration } = performance.measure(
    "fe-ttq",
    "fe-start",
    "fe-ttq-end"
  );

  console.log("fe", feDuration, "program-1");
  console.log("fe-ttq", feIdleDuration, "program-1");
});
