import { test } from "@playwright/test";

import { copyProgramToMain } from "../utils/copy";
import { registerConsoleListener } from "../utils/console";

test.describe("workflow-4/program-6", async () => {
  test.beforeEach(async ({ page }) => {
    await copyProgramToMain("workflow-4/program-6.js");

    await page.goto("/");
  });

  test("workflow-4/program-6", async ({ page }) => {
    await page.goto("/");

    registerConsoleListener(page, "workflow-4");

    await page.waitForEvent("console", {
      predicate: async (msg) => (await msg.args()[0]?.jsonValue()) === "fe-ttq",
    });
  });
});
