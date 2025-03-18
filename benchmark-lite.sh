#!/usr/bin/env bash

source_fe="$(pwd)"/results/data/fe
source_recon="$(pwd)"/results/data/recon
source_figures="$(pwd)"/results/figures
source_stats="$(pwd)"/results/stats

mkdir -p $source_fe
mkdir -p $source_recon
mkdir -p $source_figures
mkdir -p $source_stats

target_fe=/app/packages/cartokit-ablation/tests/results
target_recon=/app/packages/cartokit/tests/results
target_figures=/app/packages/cartokit-figures/figures
target_stats=/app/packages/cartokit-figures/stats

docker run \
    -d \
    --shm-size=2g \
    --mount type=bind,source="$source_fe",target="$target_fe" \
    --mount type=bind,source="$source_recon",target="$target_recon" \
    --mount type=bind,source="$source_figures",target="$target_figures" \
    --mount type=bind,source="$source_stats",target="$target_stats" \
    pldi25ae-cartokit