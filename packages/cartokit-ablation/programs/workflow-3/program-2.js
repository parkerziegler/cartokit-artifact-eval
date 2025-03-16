async function send(duration, file) {
  const existingMetrics = await fetchExistingMetrics(file);
  const newMetric = {
    duration,
    playwrightWorkflowId: "workflow-3",
    programId: "program-2",
  };

  const command = new PutObjectCommand({
    Bucket: "cartokit",
    Key: file,
    Body: JSON.stringify(existingMetrics.concat(newMetric), null, 2),
    ContentType: "application/json",
  });

  await client.send(command);
}

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
  center: [-121.86074218749962, 37.85337240117401],
  zoom: 7.972206002103116,
});
map.on("load", () => {
  map.addSource("winter-temperature-change__1", {
    type: "geojson",
    data: "https://pub-7182966c1afe48d3949439f93d0d4223.r2.dev/wapo-winter-temperature-change.json",
  });
  map.addLayer({
    id: "winter-temperature-change__1",
    source: "winter-temperature-change__1",
    type: "fill",
    paint: { "fill-color": "#80235a", "fill-opacity": 0.75 },
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
