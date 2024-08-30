import { Command } from "commander";
import { exec } from "child_process";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { GenerativeAI } from "./generative-ai";

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
};

const save_api_key = (api_key: string) => {
    const env_file_path = ".env";
    const env_content = `GEMINI_API_KEY=${api_key}\n`;
    fs.writeFileSync(env_file_path, env_content);
};

const is_api_key_set = (): boolean => {
    dotenv.config();
    return !!process.env.GEMINI_API_KEY;
};

const program = new Command();

program
    .name("AI Code Reviewer")
    .description("CLI for AI Code Reviewer")
    .version("0.0.1");

program.command("review")
    .description("Review repositories diff and displays suggestions for a better code")
    .action(async () => {
        if (!is_api_key_set()) {
            console.error("API key is not set. Please use the 'add-key' command to set the API key.");
            return;
        }

        get_repositories_diff(async (error, stdout) => {
            if (error) {
                console.error("Failed to get repository diff:", error);
                return;
            }
            if (stdout) {
                const result = await new GenerativeAI().run(stdout);
                console.log(result);
            }
        });
    });

program.command("add-key")
    .description("Add API key for Generative AI")
    .argument("<string>", "API key")
    .action((api_key: string) => {
        save_api_key(api_key);
        console.log("API key saved successfully.");
    });

program.parse();