import { test } from "@playwright/test";

import { copyProgramToMain } from "../utils/copy";
import { registerConsoleListener } from "../utils/console";

test.describe("workflow-3/program-2", async () => {
  test.beforeEach(async ({ page }) => {
    await copyProgramToMain("workflow-3/program-2.js");

    await page.goto("/");
  });

  test("workflow-3/program-2", async ({ page }) => {
    await page.goto("/");

    registerConsoleListener(page, "workflow-3");

    await page.waitForEvent("console", {
      predicate: async (msg) => (await msg.args()[0]?.jsonValue()) === "fe-ttq",
    });
  });
});
