import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

import * as dotenv from "dotenv";
dotenv.config();

export class GenerativeAI {
    genAI: GoogleGenerativeAI;
    model: any;
    generationConfig: { temperature: number; topP: number; topK: number; maxOutputTokens: number; responseMimeType: string; };

    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        this.generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };
    }

    async run(input: string) {
        try {
            const chatSession = this.model.startChat({
                generationConfig: this.generationConfig,
                history: [
                    {
                        role: "user",
                        parts: [
                            { text: "Você é um revisor de código sênior. Seu objetivo é a cada diff fornecido você retorne uma revisão da mudança. Responda em português." },
                        ],
                    }
                ],
            });
    
            const result = await chatSession.sendMessage(input);
            
            return result.response.text();
        } catch (err: any) {
            console.error(err);
            throw new Error(err.message);
        }
    }

}