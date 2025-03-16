performance.mark("fe-start");

// Begin program.
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import mapboxgl from "mapbox-gl";
import transponderGaps from "./data/wapo-fishing-boat-transponder-gaps.json";
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
  const range = d3.schemeRdYlBu[steps];
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
  center: [-38.03890879151288, -22.746267141714],
  zoom: 3.006948499474222,
});
map.on("load", () => {
  performance.mark("fe-computation-start");
  const fillColor = deriveColorScale(transponderGaps.features, "count", 8);
  performance.mark("fe-computation-end");

  map.addSource("transponder-gaps__1", {
    type: "geojson",
    data: transponderGaps,
  });
  map.addLayer({
    id: "transponder-gaps__1",
    source: "transponder-gaps__1",
    type: "fill",
    paint: {
      "fill-color": fillColor,
      "fill-opacity": 0.75,
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
    map.getSource("transponder-gaps__1") &&
    map.isSourceLoaded("transponder-gaps__1")
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
