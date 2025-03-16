import { test } from "@playwright/test";

import { copyProgramToMain } from "../utils/copy";
import { registerConsoleListener } from "../utils/console";

test.describe("workflow-5/program-14", async () => {
  test.beforeEach(async ({ page }) => {
    await copyProgramToMain("workflow-5/program-14.js");

    await page.goto("/");
  });

  test("workflow-5/program-14", async ({ page }) => {
    await page.goto("/");

    registerConsoleListener(page, "workflow-5");

    await page.waitForEvent("console", {
      predicate: async (msg) => (await msg.args()[0]?.jsonValue()) === "fe-ttq",
    });
  });
});
