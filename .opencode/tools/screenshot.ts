import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Take a screenshot of a local dev URL for visual self-review",
  args: {
    url: tool.schema.string().describe("Local URL to screenshot, e.g. http://localhost:3000"),
  },
  async execute(args) {
    const { execSync } = await import("child_process")
    execSync(`npx playwright screenshot ${args.url} /tmp/preview.png`, { stdio: "inherit" })
    return "Screenshot saved to /tmp/preview.png — view it to critique the design."
  },
})
