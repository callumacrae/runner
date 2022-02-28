export function statusToIcon(status) {
  return (
    {
      starting: "羽",
      success: "{green-fg}{/green-fg}",
      warning: "{yellow-fg}{/yellow-fg}",
      error: "{red-fg}{/red-fg}",
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
