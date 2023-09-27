import * as readline from "readline";
import { exec } from "child_process";
import * as fs from "fs";
import myoptions from "./options.json";
// let myoptions : null | {[key:string]:string} = null;
try {
  // myoptions = JSON.parse(fs.readFileSync("./options.json", "utf8"))
  if (!myoptions) {
    throw new Error("myoptions.json파일이 필요합니다.");
  }
} catch (e) {
  console.error(`options.json파일이 필요합니다.
  예시 : 
  {
    "2dub-v2": "/Users/2meu36/work/web/2dub_web_v2",
    "class": "/Users/2meu36/work/web/class_web_v2",
    "learning": "/Users/2meu36/work/web/learning_web_v2",
  }  
  `);
  process.exit(1);
}

const initialOptions = Object.keys(myoptions);
const { founds, notFounds } = initialOptions.reduce(
  (obj, key: string) => {
    const path: string | undefined | null = myoptions[key];
    if (!path || path?.length === 0) {
      return {
        founds: obj.founds,
        notFounds: obj.notFounds.concat(key),
      };
    }
    if (!fs.existsSync(path)) {
      obj.notFounds.concat(key);
      return {
        founds: obj.founds,
        notFounds: obj.notFounds.concat(key),
      };
    }
    obj.founds.concat(key);
    return {
      founds: obj.founds.concat(key),
      notFounds: obj.notFounds,
    };
  },
  { founds: [] as string[], notFounds: [] as string[] }
);
const options: string[] = founds;

if (options.length === 0) {
  throw new Error("No options found");
}

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to display options and get user input
function getUserInput() {
  console.clear();
  console.log(
    "=================================================================="
  );

  options.length > 0 &&
    console.log(` Founds : ${options.map((o) => `"${o}"`).join(", ")}`);
  notFounds.length > 0 &&
    console.log(` Not Founds : ${notFounds.map((o) => `"${o}"`).join(", ")}`);

  rl.question(
    "Select an option :\n" +
      options.map((o, i) => `${i + 1}. ${o}`).join("\n") +
      "\nQuit : q\n==================================================================\nInput : ",
    (choice) => {
      let exeCmd = "code";
      const cmds = ["open"];
      const customCommand = cmds.find((c) => choice.startsWith(c));
      if (customCommand) {
        choice = choice.replace(customCommand, "").trim();
        exeCmd = customCommand;
      }
      const splitter = choice.includes("/");
      const additionalArgument = choice
        .split(splitter ? "/" : " ")
        .slice(1)
        .join(" ");
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
        const path = myoptions![choice];
        const cmd = `${exeCmd} ${path}${
          splitter ? "/" : ""
        }${additionalArgument}`;
        console.log(`Opening [${choice}] shell cmd [${cmd}]`);
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
