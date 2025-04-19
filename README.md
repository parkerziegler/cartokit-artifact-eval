# Getting Started Guide

To evaluate this artifact, please use the appropriate Docker image for your machine's architecture from the Zenodo archive (`pldi25ae-cartokit-amd64.tar.gz` for x86-64 or `pldi25ae-cartokit-arm64v8.tar.gz` for ARM64). As a prerequisite, you'll need to [install Docker](https://docs.docker.com/desktop/?_gl=1*1mbp9px*_gcl_au*NTkzMDM5NjgzLjE3NDIyMjg1MjY.*_ga*MTkxMDY4NTk0Ni4xNzQyMjI4NTI2*_ga_XJWPQMJYHQ*MTc0MjIyODUyNi4xLjEuMTc0MjIyODUyNy41OS4wLjA.) on your host machine.

**Step 1: Load the Docker image.**

To load the Docker image, execute the following command in your shell (choosing the correct file name suffix based on your machine's architecture):

```sh
docker load -i pldi25ae-cartokit-<amd64|arm64v8>.tar.gz
```

**Step 2: Verify the image is loaded.**

Next, verify the image is loaded by executing the following command in your shell:

```sh
docker images
```

You should see output like the following:

```
REPOSITORY                 TAG       IMAGE ID       CREATED        SIZE
pldi25ae-cartokit-amd64    latest    b1d2ecf2d4c3   18 hours ago   2.71GB
```

**Step 3: Allocate additional memory for Docker.**

Finally, we recommend allocating additional memory for Docker to make use of—our benchmark suite can be quite memory intensive! To allocate additional memory for Docker, Go to **Settings > Resources > Advanced** in Docker Desktop and increase the **Memory limit** slider to either 16GB or the maximum value your machine supports (if less than 16GB).

That's it! You should be all set to move on to the step-by-step instructions below.

# Step-by-Step Instructions

The steps below assume you've successfully loaded the `pldi25ae-cartokit-<amd64|arm64v8>` image from above.

## Step 1: Run benchmark suite and generate figures

This is the primary step for artifact evaluation. The goal of this step is to run the benchmark suite from Section 6 (Evaluation) of the paper and generate Figures 5, 6, 7, and 9. Note that Figure 9 is located in Section 7 (Discussion and Limitations). Each benchmark is modeled as a set of [Playwright](https://playwright.dev/) tests. Playwright is an end-to-end testing framework capable of simulating user interactions in a web browser.

At a high-level, our Playwright tests correspond to the "workflows" described in Section 6 of the paper. The tests evaluating the reconciliation condition can be found in `packages/cartokit/tests`, while the tests evaluating the forward evaluation condition can be found in `packages/cartokit-ablation/tests`.

### A note on performance

As we are measuring both code execution and web browser rendering run times, we expect there to be some machine-to-machine variation in the results. In particular, our system makes heavy usy of WebGL, hardware acceleration, and the host machine's GPU when available. In addition, several tests request very large geospatial datasets (125-250MB) over the network. Depending on your host machine's hardware and current network download speed, you may see different absolute numbers for the benchmarks. However, we expect the general trends to be the same as those reported in the paper.

### Running the benchmark suite and generating the figures

We provide two scripts (per target architecture) to run the benchmark suite and generate the figures. **These scripts should be run on the host machine**; they handle configuring directories for generated output, binding mounts, and invoking `docker run`:

1. **`benchmark-lite-<amd64|arm64v8>.sh` (recommended)** runs the full set of benchmarks with three trials per benchmark, generating figures and high-level statistics from the collected data. This is fewer than the 10 trials in the paper, but provides a similar view of general performance. On our machine, running `bash benchmark-lite-amd64.sh` takes about 40 minutes to run to completion.
2. **`benchmark-full-<amd64|arm64v8>.sh`** runs the full set of benchmarks with 10 trials per benchmark, as in the paper, and generates figures and high-level statistics from the collected data. On our machine, running `bash benchmark-full-amd64.sh` takes about 2.25 hours to run to completion.

To run either script, execute the following command in your shell:

```sh
bash benchmark-<lite|full>-<amd64|arm64v8>.sh
```

Both of these scripts produce output in the `results` directory on the **host machine**. The `results/data/recon` directory contains raw timing data for reconciliation code execution run times (`recon.json`) and reconciliation time-to-quiescent run times (`recon-ttq.json`). The `results/data/fe` directory contains raw timing data for forward evaluation code execution run times (`fe.json`) and forward evaluation time-to-quiescent run times (`recon-ttq.json`). The `results/figures` directory contains the generated figures as PNGs. Finally, the `results/stats` directory contains relevant statistics for the claims in the paper (see below).

Note that we run Docker in [detached mode](https://docs.docker.com/guides/golang/run-containers/#run-in-detached-mode). Logs are available in Docker Desktop by locating the container running the image in the **Containers** tab. If you'd prefer to see logs in your shell rather than Docker Desktop, you can run:

```sh
docker logs --follow <container_id>
```

### Expected Warnings

You may see a few warnings or errors while running the benchmark suite. In particular, don't be alarmed if you see any of the following:

**Warnings about `tsconfig.json` resolution.**

```
[WebServer] ▲ [WARNING] Cannot find base config file "./.svelte-kit/tsconfig.json" [tsconfig.json]
[WebServer]
[WebServer] tsconfig.json:2:13:
[WebServer] 2 │ "extends": "./.svelte-kit/tsconfig.json",
[WebServer] ╵ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
[WebServer]
[WebServer] (!) Some chunks are larger than 500 kB after minification. Consider:
[WebServer] - Using dynamic import() to code-split the application
[WebServer] - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
```

On the very first build of `cartokit`, the `.svelte-kit` directory may not yet have been generated by the build process. This has no effect on the ability of the system to run correctly.

**Runtime errors about "step" expressions.**

```
Console message:  Error: layers.transponder-gaps__1.paint.fill-color[13]: Input/output pairs for "step" expressions must be arranged with input values in strictly ascending order.
  at Zu (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:13:10214)
  at LA._validate (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:13:31609)
  at LA.setPaintProperty (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:13:29891)
  at Pc.setPaintProperty (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:13:380780)
  at a.Map.setPaintProperty (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:588:209596)
  at I1 (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:618:58915)
  at xq (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:618:58189)
  at Ka (http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:618:58021)
  at http://localhost:4173/_app/immutable/nodes/2.BGfBE4il.js:649:14487
  at Object.l [as update] (http://localhost:4173/_app/immutable/chunks/bxKe3zuz.js:1:332)
```

This is an issue only in certain workflows, where the ordering of user interactions to change a map layer's mapping of data values to fill color can introduce temporary errors. Again, these errors do not affect the ability of the system or the test to run correctly.

**Flaky tests or test timeouts.**

```
1) [chromium] › workflows/workflow-4.spec.ts:21:1 › workflow-4 ───────────────────────────────────

Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('#properties')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('#properties')

  127 |
  128 |   // Ensure that the Properties Panel is visible.
> 129 |   await expect(page.locator('#properties')).toBeVisible();
      |                                             ^
  130 |
  131 |   // Remove the layer's stroke.
  132 |   await page.evaluate(() => {

     at /app/packages/cartokit/tests/workflows/workflow-4.spec.ts:129:45

 attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
test-results/workflows-workflow-4-workflow-4-chromium/video.webm
────────────────────────────────────────────────────────────────────────────────────────────────
```

Occasionally, you may get a flaky Playwright test or a test that times out trying to complete the workflow. We've configured our Playwright setup to retry every test twice, so the chances of none of the three trials succeeding is quite low. However, to ensure smooth results, run Docker with 16GB of RAM (or the maximum available RAM on your system) and check that you have at least a moderately fast WiFi connection.

### Steps to Take

1. Run either `benchmark-lite.sh` or `benchmark-full.sh`. Go for a walk, get some coffee, pet your dog—it'll take a little bit!

## Step 2: Verify the claims in the paper

We make three main claims in the paper:

- **Section 6.1 (RQ1)**: Reconciliation outperforms forward evaluation by a sizeable margin, yielding close to a 3x median speedup in time-to-quiescent (TTQ) and a 28x median speedup in code execution time.
- **Section 6.1 (RQ1a)**: Reconciliation TTQ speedups increase as forward evaluation TTQ increases; that is, longer-running programs tend to see greater latency reduction from reconciliation.
- **Section 6.2 (RQ2)**: Reconciliation is often quite fast when updating real-world outputs with real-world datasets.

The graphs produced in the previous step verify the first two claims. Here is how we interpret the graphs in terms of the research questions:

- **To verify RQ1:** The graph `figure-5.png` should show that 78 of the 80 actions have faster median reconciliation (TTQ) run times than forward evaluation (TTQ) run times. That is, the vast majority of the dots should fall _beneath_ the dotted line. The graph `figure-6.png` should show a very similar trend; the only difference is that this graph plots _code execution_ run times—not _TTQ_ run times—for each condition.
  - In addition, `results/stats/stats.json` reports the **Median Speedup from Reconciliation (Code Execution)** and **Median Speedup from Reconciliation (TTQ)**. Ideally, these numbers will be close to 28 and 3, respectively, though some noise due to machine and hardware differences is expected.
- **To verify RQ1a:** The graph `figure-7.png` should show a modest positive trend where **Speedup** generally increases with forward evaluation TTQ. That is, you should see points moving towards the upper right.
  - In addition, `results/stats/stats.json` reports the **Spearman's Rank Correlation between Forward Evaluation (TTQ) and Speedup from Reconciliation**. Ideally, this number will be close to 0.712, the correlation reported in the paper.
- **RQ2 (in situ study) cannot be verified here:** Section 6.2 discusses the results of an in situ study. Since this study involved collecting performance traces over a 30-day period from organic use of the production deployment of our system, it cannot be replicated here. We include the raw data we collected in `rq2.json`.

Beyond these three claims, we have a brief section in our discussion that looks at the relationship between reconciliation's code execution run time and TTQ run time. We argue that code execution run times are likely not a good predictor of TTQ run times, and thus may be a poor measure for analyzing the performance of direct manipulation programming systems. To explore this assertion, you can take a look at `figure-9.png`. This figure should show no discernible relationship between reconciliation's code execution run times and TTQ run times.

- In addition, `results/stats/stats.json` reports the **Spearman's Rank Correlation between Reconciliation (Code Execution) and Reconciliation (TTQ)**. Ideally, this number will be close to 0.087, the correlation reported in the paper.

### Steps to Take

1. Verify the research questions using the graphs and statistics produced in the previous step.

And that's all folks! Thanks a lot for taking the time to evaluate our paper! Hope you enjoyed that coffee / walk / dog petting time 😊

## Optional: Looking at the `cartokit` codebase

If you would like to take a look at the `cartokit` codebase, you can find it at [https://github.com/parkerziegler/cartokit](https://github.com/parkerziegler/cartokit).

## Optional: Using `cartokit`

If you would like to use `cartokit` manually, you can access the production deployment at [https://alpha.cartokit.dev](https://alpha.cartokit.dev). Additional documentation is available at [https://docs.cartokit.dev](https://alpha.cartokit.dev).

```

```
