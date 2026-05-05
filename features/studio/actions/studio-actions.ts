"use server";

import {
  generateContentSchema,
  type GenerateContentInput,
} from "../schema/studio.schema";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export async function generateContentAction(input: GenerateContentInput) {
  try {
    // 1. Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validate input
    const validated = generateContentSchema.parse(input);

    // 3. Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 4. Construct System Prompt
    let systemPrompt = `You are an expert AI content creator. Generate engaging content for a ${validated.platform} post. `;
    systemPrompt += `The tone should be ${validated.tone}. `;

    if (validated.length === "short") {
      systemPrompt +=
        "Keep it very concise, around 1-2 short paragraphs or sentences.";
    } else if (validated.length === "medium") {
      systemPrompt += "Aim for a standard length, around 2-3 paragraphs.";
    } else if (validated.length === "long") {
      systemPrompt +=
        "Make it detailed and comprehensive, minimum 4 paragraphs.";
    }

    // 5. Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: validated.prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedText = response.choices[0]?.message?.content || "";

    return { success: true, data: generatedText };
  } catch (error: unknown) {
    console.error("OpenAI Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}
