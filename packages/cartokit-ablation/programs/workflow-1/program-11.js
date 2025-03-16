performance.mark("fe-start");

// Begin program.
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import mapboxgl from "mapbox-gl";
import penumbraPaths from "./data/nyt-nasa-penumbra-paths.json";
import pathOfTotality from "./data/nyt-nasa-path-of-totality.json";
mapboxgl.accessToken =
  "pk.eyJ1IjoicGFya2VyemllZ2xlciIsImEiOiJjbG5tYm01Mm0yNWQ2Mm9wZTMzbXVmMW5hIn0.BNtWKuymyJJh-eEWoGuhCg";
const map = new mapboxgl.Map({
  container: "map",
  style: "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json",
  center: [-98.34999999999718, 39.49999999999946],
  zoom: 3.2252913626847053,
});
map.on("load", () => {
  performance.mark("fe-computation-start");
  function transformGeojson(geojson) {
    geojson.features.reverse();
    return geojson;
  }
  const penumbraPaths__1 = transformGeojson(penumbraPaths);
  performance.mark("fe-computation-end");

  map.addSource("penumbra-paths__1", {
    type: "geojson",
    data: penumbraPaths__1,
  });
  map.addSource("path-of-totality__2", {
    type: "geojson",
    data: pathOfTotality,
  });
  map.addLayer({
    id: "penumbra-paths__1",
    source: "penumbra-paths__1",
    type: "fill",
    paint: { "fill-color": "#1f2b2e", "fill-opacity": 0.075 },
  });
  map.addLayer({
    id: "penumbra-paths__1-stroke",
    source: "penumbra-paths__1",
    type: "line",
    paint: {
      "line-color": "#1f2b2e",
      "line-width": 0.25,
      "line-opacity": 0.075,
    },
  });
  map.addLayer({
    id: "path-of-totality__2",
    source: "path-of-totality__2",
    type: "fill",
    paint: { "fill-opacity": 0.75 },
  });
  map.addLayer({
    id: "path-of-totality__2-stroke",
    source: "path-of-totality__2",
    type: "line",
    paint: { "line-color": "#f1be30" },
  });

  // End computation.
  const { duration } = performance.measure("fe", "fe-start", "fe-end");
  const { duration: computationDuration } = performance.measure(
    "fe-computation",
    "fe-computation-start",
    "fe-computation-end"
  );

  console.log("fe", duration + computationDuration, "program-11");
});

// End program.
performance.mark("fe-end");

map.on("idle", () => {
  // Ensure the source data is loaded.
  if (
    map.getSource("penumbra-paths__1") &&
    map.isSourceLoaded("penumbra-paths__1")
  ) {
    performance.mark("fe-ttq-end");
    const { duration } = performance.measure(
      "fe-ttq",
      "fe-start",
      "fe-ttq-end"
    );
    console.log("fe-ttq", duration, "program-11");
  }
});
