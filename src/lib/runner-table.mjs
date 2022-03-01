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

    this.selected = 0;
    this._runners = [];

    this.key("j", () => {
      if (this.selected < this._runners.length - 1) {
        this.selected++;
        this._updateLog();
      }
    });
    this.key("k", () => {
      if (this.selected > 0) {
        this.selected--;
        this._updateLog();
      }
    });
  }

  addRunner(runner) {
    this._runners.push(runner);
    this._renderRunnerTable();
    this._updateLog();

    runner.on("status", () => this._renderRunnerTable());
  }

  _renderRunnerTable() {
    this.setData(
      [["#", "name", "status"]].concat(
        this._runners.map((runner, i) => [
          this.selected === i ? `{bold}${i}*{/bold}` : i.toString(),
          runner.name,
          statusToIcon(runner.status),
        ])
      )
    );
    this.screen.render();
  }

  _updateLog() {
    for (let i = 0; i < this._runners.length; i++) {
      const runner = this._runners[i];
      if (i === this.selected) {
        runner.log.show();
      } else {
        runner.log.hide();
      }
    }
  }
}
