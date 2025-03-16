performance.mark("fe-start");

// Begin program.
import "mapbox-gl/dist/mapbox-gl.css";
import "./style.css";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoicGFya2VyemllZ2xlciIsImEiOiJjbG5tYm01Mm0yNWQ2Mm9wZTMzbXVmMW5hIn0.BNtWKuymyJJh-eEWoGuhCg";
const map = new mapboxgl.Map({
  container: "map",
  style: "https://tiles.stadiamaps.com/styles/stamen_toner_lite.json",
  center: [-121.86074218749843, 37.853372401175406],
  zoom: 7.972206002103116,
});
map.on("load", () => {
  map.addSource("spring-leaf-appearance__1", {
    type: "geojson",
    data: "https://pub-7182966c1afe48d3949439f93d0d4223.r2.dev/wapo-spring-leaf-appearance.json",
  });
  map.addLayer({
    id: "spring-leaf-appearance__1",
    source: "spring-leaf-appearance__1",
    type: "fill",
    paint: {
      "fill-color": [
        "step",
        ["get", "trend"],
        "#1b7837",
        -21,
        "#7fbf7b",
        -14,
        "#d9f0d3",
        -7,
        "#e7d4e8",
        0,
        "#af8dc3",
        7,
        "#762a83",
      ],
    },
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

  console.log("fe", feDuration, "program-13");
  console.log("fe-ttq", feIdleDuration, "program-13");
});
