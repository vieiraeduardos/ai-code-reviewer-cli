import { Command } from "commander";
import { exec } from "child_process";

import { run } from "./genai"; 

const program = new Command();

const get_repositories_diff = (callback: (error: Error | null, stdout: string | null) => void) => {
    exec("git diff", (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error(`exec error: ${error}`);
            console.error(`stderr: ${stderr}`);
            callback(error, null);
            return;
        }
        callback(null, stdout);
    });
}

program
    .name("AI Code Reviewer")
    .description("CLI for AI Code Reviewer")
    .version("0.0.1");

program.command("review")
    .description("Review repositories diff and displays suggestions for a better code")
    .action((str, options) => {
        get_repositories_diff((error, stdout) => {
            if (error) {
                console.error("Failed to get repository diff:", error);
                return;
            }
            if (stdout) {
                run(stdout);
            }
        });
    });

program.parse();