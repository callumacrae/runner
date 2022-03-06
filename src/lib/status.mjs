export function statusToBlessedIcon(status) {
  return (
    {
      starting: "羽",
      process: "{blue-fg}羽{/blue-fg}",
      success: "{green-fg}{/green-fg}",
      warning: "{yellow-fg}{/yellow-fg}",
      error: "{red-fg}{/red-fg}",
    }[status] || "?"
  );
}

export function statusToTmuxIcon(status) {
  return (
    {
      starting: "羽",
      progress: "#[fg=blue]羽#[fg=default]",
      success: "#[fg=green]#[fg=default]",
      warning: "#[fg=yellow]#[fg=default]",
      error: "#[fg=red]#[fg=default]",
    }[status] || "?"
  );
}

export function getStatusFromOutput(output, statusObject) {
  for (const [search, status] of Object.entries(statusObject)) {
    if (output.includes(search)) {
      return status;
    }
  }

  return "unknown";
}
