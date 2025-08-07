"use server";

import { summarizeDiscussion } from "@/ai/flows/summarize-discussion";
import { z } from "zod";

const discussionSchema = z.string().min(1, "Discussion content cannot be empty.");

export async function getSummary(discussion: string) {
  try {
    const validatedDiscussion = discussionSchema.parse(discussion);
    const result = await summarizeDiscussion({ discussion: validatedDiscussion });
    return { success: true, summary: result.summary };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input for summary." };
    }
    console.error("Error summarizing discussion:", error);
    return { success: false, error: "Failed to generate summary. Please try again." };
  }
}
