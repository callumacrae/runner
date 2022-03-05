import { readFile } from "fs/promises";
import path from "path";

import blessed from "blessed";

import CommandBar from "./lib/command-bar.mjs";
import RunnerTable from "./lib/runner-table.mjs";

if (!process.argv[2]) {
  console.error("JSON file must be specified as arg");
  process.exit(1);
}

const jsonPath = path.resolve(process.argv[2]);
const cwd = path.dirname(jsonPath);
const config = JSON.parse(await readFile(jsonPath));

const screen = blessed.screen({
  smartCSR: true,
  debug: true,
  fullUnicode: true,
});
screen.key("C-c", () => process.exit(0));

const table = new RunnerTable();
// todo refactor RunnerTable to be a Box
screen.append(table);
screen.append(table.logContainer);

table.focus();

table.addRunnersArray(config.runners, { cwd });

screen.key("h", () => table.focus());
screen.key("l", () => table.focusedRunner.log.focus());

const setWidths = () => {
  if (screen.width > 100) {
    table.width = "30%";
    table.logContainer.show();
  } else {
    table.width = "100%";
    table.logContainer.hide();
  }
};
setWidths();
screen.on("resize", setWidths);

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

  screen.debug(JSON.stringify([command, args]));

  commandBar.displayError(`command ${command} not found`);
});

screen.render();
