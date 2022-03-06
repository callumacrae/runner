import blessed from "blessed";

import Runner from "./runner.mjs";
import { statusToBlessedIcon } from "./status.mjs";

export default class RunnersInterface extends blessed.box {
  constructor() {
    super({
      width: "100%",
      height: "100%-1",
    });

    this.table = blessed.listtable({
      parent: this,
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
    this.focusedRunner = undefined;

    this.table.key("j", () => {
      if (this.selected < this._runners.length - 1) {
        this.selected++;
        this._updateFocusedLog();
      }
    });
    this.table.key("k", () => {
      if (this.selected > 0) {
        this.selected--;
        this._updateFocusedLog();
      }
    });

    this.logContainer = blessed.box({
      parent: this,
      width: "70%",
      height: "100%",
      left: "30%",
      top: 0,
    });

    this.on("attach", () => {
      this._setWidths();
      this.screen.on("resize", () => this._setWidths());
    });

    this.on("focus", () => this.table.focus());
    this.table.key("l", () => this.focusedRunner.log.focus());
  }

  addRunner(runner) {
    this._runners.push(runner);
    this._renderRunnersInterface();
    this._updateFocusedLog();

    this.logContainer.append(runner.log);
    runner.log.key("h", () => this.table.focus());

    runner.on("status", () => {
      this._renderRunnersInterface();
      this.emit('status', this.status());
    });
  }

  status() {
    return this._runners.map(runner => runner.status);
  }

  addRunnersArray(runners, options) {
    runners.forEach((runnerConfig) => {
      const runner = new Runner({ ...options, ...runnerConfig });
      this.addRunner(runner);
    });
  }

  _setWidths() {
    if (this.screen.width > 100) {
      this.table.width = "30%";
      this.logContainer.show();
    } else {
      this.table.width = "100%";
      this.logContainer.hide();
    }
  }

  _renderRunnersInterface() {
    this.table.setData(
      [["#", "name", "status"]].concat(
        this._runners.map((runner, i) => [
          this.selected === i ? `{bold}${i}*{/bold}` : i.toString(),
          runner.name,
          statusToBlessedIcon(runner.status),
        ])
      )
    );
    this.screen.render();
  }

  _updateFocusedLog() {
    for (let i = 0; i < this._runners.length; i++) {
      const runner = this._runners[i];
      if (i === this.selected) {
        runner.log.show();
        this.focusedRunner = runner;
      } else {
        runner.log.hide();
      }
    }
  }
}
