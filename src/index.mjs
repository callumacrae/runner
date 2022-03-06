import { readFile } from "fs/promises";
import path from "path";

import blessed from "blessed";

import CommandBar from "./lib/command-bar.mjs";
import RunnersInterface from "./lib/runners-interface.mjs";

if (!process.argv[2]) {
  console.error("JSON file must be specified as arg");
  process.exit(1);
}

const screen = blessed.screen({
  smartCSR: true,
  debug: true,
  fullUnicode: true,
});
screen.key("C-c", () => process.exit(0));

const jsonPath = path.resolve(process.argv[2]);
const config = JSON.parse(await readFile(jsonPath));

const runners = new RunnersInterface();
runners.addRunnersArray(config.runners, { cwd: path.dirname(jsonPath) });
screen.append(runners);
runners.focus();

const commandBar = new CommandBar();
screen.append(commandBar);
commandBar.on("command", (command, args) => {
  if (command === "q") {
    process.exit(0);
  }

  if (command === "echo") {
    commandBar.displayMessage(args || "debug message");
    return;
  }

  commandBar.displayError(`command ${command} not found`);
});

screen.render();
