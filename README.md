# Getting Started Guide

To evaluate this artifact, please use the Docker image from the Zenodo archive, `pldi25ae-cartokit.tar.gz`. As a prerequisite, you'll need to [install Docker](https://docs.docker.com/desktop/?_gl=1*1mbp9px*_gcl_au*NTkzMDM5NjgzLjE3NDIyMjg1MjY.*_ga*MTkxMDY4NTk0Ni4xNzQyMjI4NTI2*_ga_XJWPQMJYHQ*MTc0MjIyODUyNi4xLjEuMTc0MjIyODUyNy41OS4wLjA.) on your host machine.

**Step 1: Load the Docker image.**

To load the Docker image, execute the following command in your shell:

```sh
docker load -i pldi25ae-cartokit.tar.gz
```

**Step 2: Verify the image is loaded.**

Next, verify the image is loaded by executing the following command in your shell:

```sh
docker images
```

You should see output like the following:

```
REPOSITORY               TAG       IMAGE ID       CREATED        SIZE
pldi25ae-cartokit        latest    b1d2ecf2d4c3   18 hours ago   2.71GB
```

**Step 3: Allocate additional memory for Docker.**

Finally, we recommend allocating additional memory for Docker to make use of—our benchmark suite can be quite memory intensive! To allocate additional memory for Docker, Go to **Settings > Resources > Advanced** in Docker Desktop and increase the **Memory limit** slider to either 16GB or the maximum value your machine supports (if less than 16GB).

That's it! You should be all set to move on to the step-by-step instructions below.

# Step-by-Step Instructions

The steps below assume you've successfully loaded the `pldi25ae-cartokit` image from above.

## Step 1: Run benchmark suite and generate figures

This is the primary step for artifact evaluation. The goal of this step is to run the benchmark suite from Section 6 (Evaluation) of the paper and generate Figures 5, 6, 7, and 9. Note that Figure 9 is located in Section 7 (Discussion and Limitations). Each benchmark is modeled as a set of [Playwright](https://playwright.dev/) tests. Playwright is an end-to-end testing framework capable of simulating user interactions in a web browser.

At a high-level, our Playwright tests correspond to the "workflows" described in Section 6 of the paper. The tests evaluating the reconciliation condition can be found in `packages/cartokit/tests`, while the tests evaluating the forward evaluation condition can be found in `packages/cartokit-ablation/tests`.

### A note on performance

As we are measuring both code execution and web browser rendering run times, we expect there to be some machine-to-machine variation in the results. In particular, our system makes heavy usy of WebGL, hardware acceleration, and the host machine's GPU when available. In addition, several tests request very large geospatial datasets (125-250MB) over the network. Depending on your host machine's hardware and current network download speed, you may see different absolute numbers for the benchmarks. However, we expect the general trends to be the same as those reported in the paper.

### Running the benchmark suite and generating the figures

We provide two scripts to run the benchmark suite and generate the figures:

1. **`benchmark-lite.sh` (recommended)** runs the full set of benchmarks with three trials per benchmark, generating figures and high-level statistics from the collected data. This is fewer than the 10 trials in the paper, but provides a similar view of general performance. On our machine, running `./benchmark-lite.sh` takes about 40 minutes in Docker.
2. **`benchmark-full.sh`** runs the full set of benchmarks with 10 trials per benchmark, as in the paper, and generates figures and high-level statistics from the collected data. On our machine, running `./benchmark-full.sh` takes about 2.25 hours in Docker.

To run either script, execute the following commands in your shell:

```sh
# Update permissions
chmod +x benchmark-<lite|full>.sh

# Run the benchmarks
./benchmark-<lite|full>.sh
```

Both of these scripts produce output in the `results` directory on the **host machine**. The `results/data/recon` directory contains raw timing data for reconciliation code execution run times (`recon.json`) and reconciliation time-to-quiescent run times (`recon-ttq.json`). The `results/data/fe` directory contains raw timing data for forward evaluation code execution run times (`fe.json`) and forward evaluation time-to-quiescent run times (`recon-ttq.json`). The `results/figures` directory contains the generated figures as PNGs. Finally, the `results/stats` directory contains relevant statistics for the claims in the paper (see below).

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
