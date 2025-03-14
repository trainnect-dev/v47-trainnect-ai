import { customProvider } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { mistral } from "@ai-sdk/mistral";
import { openrouter } from '@openrouter/ai-sdk-provider';
import { perplexity } from '@ai-sdk/perplexity';

export const myProvider = customProvider({
  languageModels: {
    "claude-3.7-sonnet": anthropic("claude-3-7-sonnet-20250219"),
    "claude-3.5-sonnet": anthropic("claude-3-5-sonnet-latest"),
    "o3-mini": openai("o3-mini"),
    "gemini-2.0-flash": google("gemini-2.0-flash"),
    "qwen-qwq-32b": groq("qwen-qwq-32b"),
    "codestral-latest": mistral("codestral-latest"),
    "perplexity sonar": perplexity("sonar"),
    "google/gemini-2.0-flash-thinking-exp:free": openrouter("google/gemini-2.0-flash-thinking-exp:free"),
  },
});

// Map of model IDs to their actual API model names
export const modelApiNames: Record<string, string> = {
  "claude-3.7-sonnet": "claude-3-7-sonnet-20250219",
  "claude-3.5-sonnet": "claude-3-5-sonnet-latest",
  "o3-mini": "o3-mini",
  "gemini-2.0-flash": "gemini-2.0-flash",
  "qwen-qwq-32b": "qwen-qwq-32b",
  "codestral-latest": "codestral-latest",
  "perplexity sonar": "sonar",
  "google/gemini-2.0-flash-thinking-exp:free": "google/gemini-2.0-flash-thinking-exp:free",
};

interface Model {
  id: string;
  name: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    description:
      "Claude 3.7 Sonnet is Anthropic's most intelligent model to date and the first Claude model to offer extended thinking – the ability to solve complex problems with careful, step-by-step reasoning.",
  },
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description:
      "Claude 3.5 Sonnet strikes the ideal balance between intelligence and speed—particularly for enterprise workloads.",
  },
  {
    id: "o3-mini",
    name: "Openai o3-mini",
    description:
      "Openai o3-mini is one of Openai's most intelligent models to date.",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description:
      "Gemini 2.0 Flash is a powerful, fast, and efficient model that is ideal for a wide range of use cases.",
  },
  {
    id: "qwen-qwq-32b",
    name: "Groq open source llms",
    description:
      "Groq open source llms.",
  },
  {
    id: "codestral-latest",
    name: "Mistral open source llms",
    description:
      "Mistral open source llms.",
  },
  {
    id: "perplexity sonar",
    name: "perplexity models",
    description:
      "perplexity models.",
  },
  {
    id: "google/gemini-2.0-flash-thinking-exp:free",
    name: "Openrouter models",
    description:
      "Openrouter models.",
  },
];