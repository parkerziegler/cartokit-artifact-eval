# Architecture

This file documents the high-level architecture of the repository. We focus in particular on the core sections of the codebase that connect to our PLDI '25 paper, "Fast Direct Manipulation Programming with Patch-Reconciliation Correspondence."

## Directory Structure

The table below documents the directory structure and the contents of each directory.

| Directory             | Purpose                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `.github`             | Build, test, and deployment pipelines for `cartokit`'s CI setup, run via GitHub Actions.                                      |
| `assets`              | Static assets referenced in the repository README.                                                                            |
| `src/lib/assets`      | Static assets (images) used by [Svelte](https://svelte.dev/) components in `cartokit`.                                        |
| `src/lib/codegen`     | `cartokit`'s code generation algorithm, which compiles $ \mathcal{L}\_{ck} $ programs into JavaScript or TypeScript programs. |
| `src/lib/components`  | [Svelte](https://svelte.dev/) components that make up the `cartokit` user interface.                                          |
| `src/lib/interaction` | TypeScript modules containing functionality for handling user interface interactions in `cartokit`.                           |
| `src/lib/stores`      | [Svelte stores](https://svelte.dev/docs/svelte/svelte-store) that model application state in `cartokit`.                      |
| `src/lib/types`       | Static type definitions for use throughout the `cartokit` codebase.                                                           |
| `src/lib/utils`       | Utility functions for colors, constants, library-specific helpers, regular expressions, etc. in `cartokit`.                   |
| `src/routes`          | The root level page, layout, and server-side logic for `cartokit`.                                                            |
| `static`              | Assets like favicons and OpenGraph images for the `cartokit` deployment.                                                      |
| `tests`               | [Playwright](https://playwright.dev/) end-to-end tests exercising core functionality in `cartokit`.                           |

## `patch`-`recon` Implementation

The primary contribution of the PLDI '25 paper is the idea of _patch_-_reconciliation_ _correspondence_ and our `patch`-`recon` architecture. To introduce `patch`-`recon`, Section 4.1 of the paper instantiates the technique in a language, $ \mathcal{L}\_{ck} $ composed of:

- A set of programs, $ Prog\_{\mathcal{L}\_{ck}} $
- A set of values, $ Val\_{\mathcal{L}\_{ck}} $
- A semantics **eval**: $ Prog\_{\mathcal{L}\_{ck}} \rightarrow Val\_{\mathcal{L}\_{ck}} $
- A set of diffs, $ Diff\_{\mathcal{L}\_{ck}} $
- A syntactic diffing operation, **patch**: $ Diff\_{\mathcal{L}\_{ck}} \times Prog\_{\mathcal{L}\_{ck}} \rightarrow Prog\_{\mathcal{L}\_{ck}} $

Section 4.2 subsequently introduces:

- A reconciliation function, **recon**: $ Diff\_{\mathcal{L}\_{ck}} \times Val\_{\mathcal{L}\_{ck}} \rightarrow Val\_{\mathcal{L}\_{ck}} $

Below, we point to the relevant sections of the codebase to locate each of these components.

### Programs ($ Prog\_{\mathcal{L}\_{ck}} $)

Programs are defined by `interface CartoKitIR` in `src/lib/types/index.ts`, L358. This `interface` corresponds to the grammar defined in Figure 3 of the paper. `cartokit`'s active program, which is modified by the **patch** operation on every GUI interaction, is modeled as a Svelte store in `src/lib/stores/ir.ts`. The initial program definition in that file corresponds to the empty program with no layers.

In our implementation, map metadata like the `zoom`, `center`, and `basemap` are also stored in the program; we elided these details in the paper, since they are not pertinent to the language definition.

**Note: The IR (intermediate representation) terminology in the codebase is a holdover from the early days of `cartokit`'s development, where we initially thought of our language as an intermediate representation of the JavaScript program presented to the user in the interface.**

### Values ($ Val\_{\mathcal{L}\_{ck}} $)

Values in `cartokit` are maps as defined by `interface Map` from our map rendering library, MapLibre GL JS. Their full definition can be found in [the MapLibre GL JS repository](https://github.com/maplibre/maplibre-gl-js/blob/3a1f71f00913bf85d614d9693f5abcdd8f8bae8e/src/ui/map.ts#L475).

### **eval** ($ Prog\_{\mathcal{L}\_{ck}} \rightarrow Val\_{\mathcal{L}\_{ck}} $)

**eval** is defined by unioning the results of executing **evalLayer** on all layers in the program. **evalLayer** corresponds to the `addLayer` function defined in `src/lib/interaction/layer.ts`, L33.

### Diffs ($ Diff\_{\mathcal{L}\_{ck}} $)

The core definition of all diffs is captured by `type DispatchLayerUpdateParams` in `src/lib/interaction/update.ts`, L184. This type is a tagged union, with all members composed of a unique `type` (corresponding roughly to a channel, $ C $, in $ \mathcal{L}\_{ck} $) and a `payload` (corresponding roughly to a function, $ fn $, in $ \mathcal{L}\_{ck} $). The diffs `RemoveFillUpdate` and `RemoveStrokeUpdate` are specializations of the **removeChannel** diff in the paper. The diffs `LayerTypeUpdate` and `TransformationUpdate` are specializations of the **transformLayer** diff in the paper. The remainder of diffs in the union are specializations of the **setChannel** diff in the paper. Finally, the **addLayer** diff is implemented directly as part of the `addSource` function in `src/lib/interaction/source.ts`, L84.

### `patch` and `recon`

`patch` and `recon` for **setChannel** and **removeChannel** are implemented together inside of the `dispatchLayerUpdate` function in `src/lib/interaction/update.ts`, L214. In general, `patch` corresponds to code that executes in the callback function passed to `ir.update`. `recon` corresponds to the remainder of the code in each `case` block. For the **transformLayer** diff, `patch` and `recon` are implemented inside of `transitionLayerType` in `src/lib/interaction/layer-type.ts`, L60. For the **addLayer** diff, `patch` and `recon` are implemented directly as part of the `addSource` function in `src/lib/interaction/source.ts`, L84.

## Evaluation

The evaluation in our PLDI '25 paper involves instrumenting the `cartokit` source code with calls to the browser's [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance) to capture reconciliation's code execution run time and time-to-quiescent (TTQ) run time. In particular, we use [`performance.mark`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) to define start and end "marks" for measurement and [`performance.measure`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure) to capture timings.

The following table includes the file and line numbers for start and end points for performance measurements.

| Performance Mark                                    | File                                        | Line |
| --------------------------------------------------- | ------------------------------------------- | ---- |
| Reconciliation Start (**addLayer**)                 | `src/lib/components/layers/FromAPI.svelte`  | 36   |
| Reconciliation Code Execution End (**addLayer**)    | `src/lib/components/layers/FromAPI.svelte`  | 46   |
| Reconciliation Start (**addLayer**)                 | `src/lib/components/layers/FromFile.svelte` | 35   |
| Reconciliation Code Execution End (**addLayer**)    | `src/lib/components/layers/FromFile.svelte` | 62   |
| Reconciliation Start (remaining diffs)              | `src/lib/interaction/update.ts`             | 226  |
| Reconciliation Code Execution End (remaining diffs) | `src/lib/interaction/update.ts`             | 787  |
| Reconciliation TTQ End (all diffs)                  | `src/routes/+page.svelte`                   | 88   |

### Playwright Tests

The workflows referenced in Section 6 of the paper are implemented as Playwright end-to-end tests and located in `tests/workflows`. Individual workflow files (e.g., `workflow-1.spec.ts`, `workflow-2.spec.ts`) correspond directly to the benchmarks referenced in Table 1.
