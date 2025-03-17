#!/bin/bash
set -e

echo "=== Running reconciliation benchmarks ==="
cd /app/packages/cartokit
for ((i = 1; i <= TRIALS; i++)); do
  echo "=== Trial $i of $TRIALS ==="
  pnpm exec playwright test
done

echo "=== Running forward evaluation benchmarks ==="
cd /app/packages/cartokit-ablation
for ((i = 1; i <= TRIALS; i++)) do
  echo "=== Trial $i of $TRIALS ==="
  pnpm exec playwright test
done

echo "=== Copying benchmark results ==="
cd /app/packages/cartokit-figures/
mkdir -p input
cp /app/packages/cartokit/tests/results/recon.json /app/packages/cartokit-figures/input/
cp /app/packages/cartokit/tests/results/recon-ttq.json /app/packages/cartokit-figures/input/
cp /app/packages/cartokit-ablation/tests/results/fe.json /app/packages/cartokit-figures/input/
cp /app/packages/cartokit-ablation/tests/results/fe-ttq.json /app/packages/cartokit-figures/input/

echo "=== Generating figures ==="
cd /app/packages/cartokit-figures
pnpm gen:figures

echo "=== Workflow completed ==="