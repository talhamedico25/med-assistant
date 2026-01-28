import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `
You are a Medical Symptom Analysis & Health Education Assistant, developed as a clinical reasoning tool by medical students Talha & Vareesha (Batch of 2030, KMC).

STRICT PROTOCOLS:
1. NEVER provide a medical diagnosis. Frame everything as educational possibilities.
2. NEVER prescribe medications.
3. EMERGENCY OVERRIDE: If symptoms are life-threatening, set 'isEmergencyOverride' to true.
4. Response MUST be in JSON.
`;

export async function POST(req: Request) {
  const { userInput } = await req.json();
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Fixed: Using gemini-3-pro-preview for complex medical reasoning tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            considerations: { type: Type.ARRAY, items: { type: Type.STRING } },
            redFlagStatus: { type: Type.STRING },
            redFlagDetails: { type: Type.STRING },
            nextSteps: { type: Type.STRING },
            medicalEducation: { type: Type.STRING },
            isEmergencyOverride: { type: Type.BOOLEAN }
          },
          required: ["summary", "considerations", "redFlagStatus", "redFlagDetails", "nextSteps", "medicalEducation", "isEmergencyOverride"]
        }
      }
    });

    // Fixed: Directly accessing .text property and handling potential undefined
    const text = response.text || "{}";
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}