import { Command } from "commander";
import { exec } from "child_process";

const program = new Command();

/** TODO: Get Git repositories diff */

const get_repositories_diff = () => {
    exec("git diff", (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error(`exec error: ${error}`);
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

program
    .name("AI Code Reviewer")
    .description("CLI for AI Code Reviewer")
    .version("0.0.1");

program.command("review")
    .description("Review repositories diff and displays suggestions for a better code")
    .action((str, options) => {
        get_repositories_diff();
    });

program.parse();