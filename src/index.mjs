import path from "path";
import { fileURLToPath } from "url";

import blessed from "blessed";

import CommandBar from "./lib/command-bar.mjs";
import Runner from "./lib/runner.mjs";
import RunnerTable from "./lib/runner-table.mjs";

const screen = blessed.screen({
  smartCSR: true,
  debug: true,
  fullUnicode: true,
});
screen.key("C-c", () => process.exit(0));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const child = new Runner({
  name: "test",
  cmd: path.join(__dirname, "test.sh"),
  statusObject: {
    "all good": "success",
    warning: "warning",
    error: "error",
  },
});

const child2 = new Runner({
  name: "test 2",
  cmd: path.join(__dirname, "test.sh"),
  statusObject: {
    "all good": "success",
    warning: "warning",
    error: "error",
  },
});

const table = new RunnerTable();
// todo refactor RunnerTable to be a Box
screen.append(table);
screen.append(table.logContainer);
table.addRunner(child);
table.addRunner(child2);

table.focus()

screen.key('h', () => table.focus());
screen.key('l', () => table.focusedRunner.log.focus());

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
screen.on('resize', setWidths);

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
