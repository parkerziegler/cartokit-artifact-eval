import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * Copies content from a source file to a target file.
 *
 * @param programPath - The relative path to the program file
 * (e.g., 'workflow-1/program-1').
 * @param targetFile - The target file name (default: 'main.js').
 * @returns – A promise that resolves when the file is copied.
 */
export async function copyProgramToMain(
  programPath: string,
  targetFile = "main.js"
): Promise<void> {
  const rootDir = path.resolve(__dirname, "../../");
  const sourceFilePath = path.join(rootDir, "programs", programPath);
  const targetFilePath = path.join(rootDir, targetFile);

  console.log(`Copying from: ${sourceFilePath}`);
  console.log(`Copying to: ${targetFilePath}`);

  try {
    // Make sure the source file exists
    if (!fs.existsSync(sourceFilePath)) {
      throw new Error(`Source file not found: ${sourceFilePath}`);
    }

    // Read source file
    const sourceContent = fs.readFileSync(sourceFilePath, "utf8");

    // Write to target file
    fs.writeFileSync(targetFilePath, sourceContent);

    console.log("File successfully copied!");
  } catch (error) {
    console.error("Error during file copy:", error);
    throw error; // Rethrow to fail the setup
  }
}

/**
 * Restarts the development server
 * This is a placeholder - you'll need to implement this based on your specific setup
 */
export async function restartDevServer(): Promise<void> {
  // This is a placeholder - you'll need to implement this based on
  // how your development server can be restarted
  console.log("Restarting development server...");

  // Example approach:
  // 1. You might use a global object that controls your server
  // 2. You might send a signal to a process
  // 3. You might use an API endpoint to trigger a restart

  // For now, we'll just simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Development server restarted");
}
