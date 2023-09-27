const fs = require("fs");
const os = require("os");
const path = require("path");

console.log("Adding to ~/.zshrc");
// Define the subdirectory you want to add to the PATH.
const subdirectoryToAdd = "dist";

// Get the absolute path of the current working directory.
const currentDirectory = process.cwd();

// Define the full path you want to add to the PATH.
const newPath = path.join(currentDirectory, subdirectoryToAdd);

try {
  // Read the .zshrc file synchronously
  const zshrcPath = path.join(os.homedir(), ".zshrc");
  let data = fs.readFileSync(zshrcPath, "utf8");

  // Check if the PATH already contains the new path
  if (!data.includes(newPath)) {
    // Append the new path to the PATH variable
    data += `\nexport PATH="${newPath}:$PATH"\n`;

    // Write the updated data back to the .zshrc file synchronously
    fs.writeFileSync(zshrcPath, data, "utf8");
    console.log(`Added ${newPath} to PATH in .zshrc`);
  } else {
    console.log(`${newPath} is already in the PATH in .zshrc`);
  }
} catch (err) {
  console.log("Failed to add path to ~/.zshrc");
  console.error(`Error: ${err.message}`);
}
