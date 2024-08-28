import { Command } from "commander";
const program = new Command();

program
    .name("AI Code Reviewer")
    .description("CLI for AI Code Reviewer")
    .version("0.0.1");

program.command("review")
    .description("Review repositories diff and displays suggestions for a better code")
    .action((str, options) => {
        console.log("Good code!");
    });

program.parse();