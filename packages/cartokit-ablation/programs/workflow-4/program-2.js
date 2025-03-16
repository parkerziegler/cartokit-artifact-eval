performance.mark("fe-start");

// Begin program.
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import mapboxgl from "mapbox-gl";
import transponderGaps from "./data/wapo-fishing-boat-transponder-gaps.json";
mapboxgl.accessToken =
  "pk.eyJ1IjoicGFya2VyemllZ2xlciIsImEiOiJjbG5tYm01Mm0yNWQ2Mm9wZTMzbXVmMW5hIn0.BNtWKuymyJJh-eEWoGuhCg";
const map = new mapboxgl.Map({
  container: "map",
  style: "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json",
  center: [-38.03890879151288, -22.746267141714],
  zoom: 3.006948499474222,
});
map.on("load", () => {
  map.addSource("transponder-gaps__1", {
    type: "geojson",
    data: transponderGaps,
  });
  map.addLayer({
    id: "transponder-gaps__1",
    source: "transponder-gaps__1",
    type: "fill",
    paint: { "fill-color": "#6ddaec", "fill-opacity": 0.75 },
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

  console.log("fe", feDuration, "program-2");
  console.log("fe-ttq", feIdleDuration, "program-2");
});
