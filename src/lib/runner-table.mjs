import blessed from "blessed";

import { statusToIcon } from "./status.mjs";

export default class RunnerTable extends blessed.listtable {
  constructor() {
    super({
      interactive: false, // this removes formatting unfortunately…
      tags: true,
      keys: true,
      vi: true,
      mouse: true,
      data: null,
      width: "30%",
      height: "shrink",
      style: {
        header: {
          fg: "blue",
          bold: true,
        },
        border: {
          fg: 246,
        },
        focus: {
          border: {
            fg: "white",
          },
        },
      },
      border: "line",
    });

    this._runners = [];
  }

  addRunner(runner) {
    this._runners.push(runner);
    this.renderRunnerTable();

    runner.on("status", () => this.renderRunnerTable());
  }

  renderRunnerTable() {
    this.setData(
      [["#", "name", "status"]].concat(
        this._runners.map((runner, i) => [
          i,
          runner.name,
          statusToIcon(runner.status),
        ])
      )
    );
    this.screen.render();
  }
}
