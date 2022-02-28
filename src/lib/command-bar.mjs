import blessed from "blessed";

export default class CommandBar extends blessed.box {
  constructor() {
    super({
      border: false,
      width: "100%",
      height: "shrink",
      bottom: 0,
      left: 0,
    });

    this._mode = "normal";

    this.on("attach", () => {
      const promptInput = blessed.textbox({
        parent: this,
        border: false,
        left: 1,
        height: 1,
        tags: true,
        hidden: true,
        style: {
          bg: "yellow",
          fg: "black",
        },
      });

      promptInput.key("escape", () => {
        promptInput.cancel();
      });

      this.screen.key(":", () => {
        this._mode = "prompt";

        this.style.bg = "yellow";
        this.style.fg = "black";

        this.setContent(":");
        promptInput.show();
        promptInput.setValue("");
        promptInput.readInput((err, val) => {
          this.style.bg = undefined;
          this.style.fg = undefined;
          this.style.bold = false;

          this.setContent("");
          promptInput.hide();
          this._mode = "normal";

          if (val) {
            const trimmedVal = val.trim();
            this.screen.debug(`prompt input: ${trimmedVal}`);
            const firstSpace = trimmedVal.indexOf(" ");
            if (firstSpace === -1) {
              this.emit("command", trimmedVal);
            } else {
              this.emit(
                "command",
                trimmedVal.slice(0, firstSpace),
                trimmedVal.slice(firstSpace + 1)
              );
            }
          }
        });
      });
    });
  }

  displayMessage(message) {
    this.setContent(message);
  }

  displayError(error) {
    this.style.bg = "red";
    this.style.fg = "white";
    this.style.bold = true;

    this.setContent(`ERR: ${error}`);
  }
}
