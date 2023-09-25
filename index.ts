import * as readline from "readline";
import { exec } from "child_process";

const initialOptions = [
  "2dub-v2",
  "2dub-v3",
  "class",
  "learning",
  "solution",
  "interview",
  "interview-speech",
] as const;

const notFounds = [];
const options: string[] = [];

for (const option of initialOptions) {
  if (process.env[option]) {
    options.push(option);
  } else {
    notFounds.push(option);
  }
}

if (options.length === 0) {
  throw new Error("No env found");
}

console.log(
  "=================================================================="
);
console.log(` Founds : ${options.map((o) => `"${o}"`).join(", ")}`);
console.log(` Not Founds : ${notFounds.map((o) => `"${o}"`).join(", ")}`);

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to display options and get user input
function getUserInput() {
  console.log(
    "=================================================================="
  );
  rl.question(
    "Select an option :\n" +
      options.map((o, i) => `${i + 1}. ${o}`).join("\n") +
      "\nQuit : q\nInput : ",
    (choice) => {
      let exeCmd = "code";
      const cmds = ["open"];
      const customCommand = cmds.find((c) => choice.startsWith(c));
      if (customCommand) {
        choice = choice.replace(customCommand, "").trim();
        exeCmd = customCommand;
      }
      console.log({choice});
      const splitter = choice.includes("/");
      const additionalArgument = choice.split(splitter ? "/":" ").slice(1).join(" ");
      console.log("additionalArgument", additionalArgument);

      const toNumber = parseInt(choice);
      if (!isNaN(toNumber)) {
        const idx = toNumber - 1;
        if (options[idx]) {
          choice = options[idx];
        }
      }
      if (choice === "q") {
        rl.close();
        return;
      }
      if (options.includes(choice)) {
        console.log(`Opening [${choice}]`);
        const cmd = `${exeCmd} ${process.env[choice]}${splitter&&"/"}${additionalArgument}`;
        executeShellCommand(cmd, getUserInput);
        return;
      }
      console.log("Invalid choice. Please try again.");
      getUserInput();
    }
  );
}

// Function to execute a shell command
function executeShellCommand(command: string, callback?: () => void) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
    } else {
      console.log(`Command output:\n${stdout}`);
    }
    callback?.(); // Continue to the next iteration
  });
}

// Start the application
getUserInput();

// Close the readline interface when the user exits
rl.on("close", () => {
  console.log("Goodbye!");
  process.exit(0);
});
