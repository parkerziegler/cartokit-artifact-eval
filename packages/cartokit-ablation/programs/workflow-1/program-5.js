performance.mark("fe-start");

// Begin program.
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import mapboxgl from "mapbox-gl";
import penumbraPaths from "./data/nyt-nasa-penumbra-paths.json";
mapboxgl.accessToken =
  "pk.eyJ1IjoicGFya2VyemllZ2xlciIsImEiOiJjbG5tYm01Mm0yNWQ2Mm9wZTMzbXVmMW5hIn0.BNtWKuymyJJh-eEWoGuhCg";
import * as d3 from "d3";

function deriveQuantiles(domain, range) {
  const quantiles = d3.scaleQuantile().domain(domain).range(range).quantiles();

  return quantiles;
}

function computeDomain(features, attribute) {
  return features.map((feature) => feature.properties[attribute]);
}

function deriveColorScale(features, attribute, steps) {
  const domain = computeDomain(features, attribute);
  const range = d3.schemeOranges[steps];
  const quantiles = deriveQuantiles(domain, range);

  const prelude = ["step", ["get", attribute], range[0]];
  const stops = range.reduce(
    (acc, color, i) => (i === 0 ? acc : acc.concat([quantiles[i - 1], color])),
    []
  );

  return [...prelude, ...stops];
}

const map = new mapboxgl.Map({
  container: "map",
  style: "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json",
  center: [-98.34999999999718, 39.49999999999946],
  zoom: 3.2252913626847053,
});
map.on("load", () => {
  performance.mark("fe-computation-start");
  const fillColor = deriveColorScale(penumbraPaths.features, "Obscuratio", 5);
  performance.mark("fe-computation-end");

  map.addSource("penumbra-paths__1", { type: "geojson", data: penumbraPaths });
  map.addLayer({
    id: "penumbra-paths__1",
    source: "penumbra-paths__1",
    type: "fill",
    paint: {
      "fill-color": fillColor,
      "fill-opacity": 0.75,
    },
  });
  map.addLayer({
    id: "penumbra-paths__1-stroke",
    source: "penumbra-paths__1",
    type: "line",
    paint: {
      "line-color": "#1f2b2e",
      "line-opacity": 0.075,
      "line-width": 0.25,
    },
  });

  // End computation.
  const { duration } = performance.measure("fe", "fe-start", "fe-end");
  const { duration: computationDuration } = performance.measure(
    "fe-computation",
    "fe-computation-start",
    "fe-computation-end"
  );

  console.log("fe", duration + computationDuration, "program-5");
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
    console.log("fe-ttq", duration, "program-5");
  }
});
