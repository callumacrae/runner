import { spawn } from "child_process";
import EventEmitter from "events";

import blessed from "blessed";

import { getStatusFromOutput } from "./status.mjs";

export default class Runner extends EventEmitter {
  constructor(options) {
    super();

    this.cmd = options.cmd;
    this.name = options.name;
    this.status = "starting";

    this.log = blessed.log({
      width: "70%",
      height: "100%-1",
      left: "30%",
      top: 0,
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

    const child = spawn(this.cmd);
    this._child = child;

    child.stdout.on("data", (data) => {
      const status = getStatusFromOutput(data.toString(), options.statusObject);

      this.log.add(data.toString().trim());

      if (status !== "unknown") {
        this.status = status;
        this.emit("status", status);
      }
    });

    child.stderr.on("data", (data) => {
      console.error("stderr", data);
    });

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}
