import { test } from "@playwright/test";

import { copyProgramToMain } from "../utils/copy";
import { registerConsoleListener } from "../utils/console";

test.describe("workflow-1/program-10", async () => {
  test.beforeEach(async ({ page }) => {
    await copyProgramToMain("workflow-1/program-10.js");

    await page.goto("/");
  });

  test("workflow-1/program-10", async ({ page }) => {
    await page.goto("/");

    registerConsoleListener(page, "workflow-1");

    await page.waitForEvent("console", {
      predicate: async (msg) => (await msg.args()[0]?.jsonValue()) === "fe-ttq",
    });
  });
});
