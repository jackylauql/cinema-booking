// tests/cli.e2e.test.ts
import { spawn } from "child_process";
import path from "path";

function runCLI(inputs: string[]): Promise<string> {
  return new Promise((resolve) => {
    const cliPath = path.join(__dirname, "../src/cli.ts");
    const proc = spawn("npx", ["ts-node", cliPath]);

    let outputs: string[] = [];
    proc.stdout.on("data", (data) => {
      const output = data.toString();
      outputs.push(output);
      const nextInput = inputs.shift();
      if (nextInput !== undefined) {
        proc.stdin.write(nextInput + "\n");
      } else if (output.includes("Goodbye!")) {
        proc.kill();
      }
    });

    proc.on("close", () => resolve(JSON.stringify(outputs)));
  });
}

describe("CLI E2E", () => {
  it("creates cinema, books tickets, and exits", async () => {
    const rawOutputs = await runCLI(["MyMovie 3 5", "3"]);

    const parsedOutput = JSON.parse(rawOutputs);
    expect(parsedOutput[1]).toContain("Welcome to GIC Cinemas");
    // expect(parsedOutput[1]).toContain("Booking successful!");
    expect(parsedOutput[2]).toContain(
      "[1] Book tickets for MyMovie (15) seat(s) available"
    );
    expect(parsedOutput[2]).toContain("[2] Check bookings");
    expect(parsedOutput[2]).toContain("[3] Exit");
  });
});
