import { test } from "@playwright/test";

import { copyProgramToMain } from "../utils/copy";
import { registerConsoleListener } from "../utils/console";

test.describe("workflow-6/program-4", async () => {
  test.beforeEach(async ({ page }) => {
    await copyProgramToMain("workflow-6/program-4.js");

    await page.goto("/");
  });

  test("workflow-6/program-4", async ({ page }) => {
    await page.goto("/");

    registerConsoleListener(page, "workflow-6");

    await page.waitForEvent("console", {
      predicate: async (msg) => (await msg.args()[0]?.jsonValue()) === "fe-ttq",
    });
  });
});
