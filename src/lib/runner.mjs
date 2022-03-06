import { spawn } from "child_process";
import EventEmitter from "events";

import blessed from "blessed";

import { getStatusFromOutput } from "./status.mjs";

export default class Runner extends EventEmitter {
  constructor(options) {
    super();

    this.name = options.name;
    this.status = "starting";

    this.log = blessed.log({
      hidden: true,
      border: "line",
      label: ` ${options.name} log `,
      scrollback: 1000,
      keys: true,
      vi: true,
      mouse: true,
      style: {
        border: {
          fg: 246,
        },
        focus: {
          border: {
            fg: "white",
          },
        },
      },
    });

    const child = spawn(options.command, options.args, { cwd: options.cwd });
    this._child = child;

    const handleOutput = (data) => {
      const status = getStatusFromOutput(data.toString(), options.statusObject);

      this.log.add(data.toString().trim());

      if (status !== "unknown") {
        this.status = status;
        this.emit("status", status);
      }
    };

    child.stdout.on("data", handleOutput);
    child.stderr.on("data", handleOutput);

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}
