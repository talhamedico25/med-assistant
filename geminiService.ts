
import { GoogleGenAI, Type } from "@google/genai";
import { SymptomAnalysis } from "./types";
import { APP_CONFIG } from "./constants";

const SYSTEM_INSTRUCTION = `
You are a Medical Symptom Analysis & Health Education Assistant, developed as a clinical reasoning tool by medical students Talha & Vareesha.

STRICT PROTOCOLS:
1. NEVER provide a medical diagnosis. Frame everything as educational possibilities based on symptoms and reported medical history.
2. NEVER prescribe, recommend, or imply specific medications or dosages.
3. NEVER use definitive language like "You have" or "You should take".
4. EMERGENCY OVERRIDE: If the user describes life-threatening symptoms (chest pain, severe shortness of breath, sudden weakness, unconsciousness), immediately set 'isEmergencyOverride' to true and 'redFlagStatus' to 'Emergency'.
5. Always use neutral, academic, and non-actionable language.
6. Provide general medical education about broad treatment categories (e.g., "physiotherapy", "antibiotics for bacterial infections" without specific drug names).
7. If the user provides a medical history, analyze how that history might interact with the current symptoms in an educational context.

RESPONSE FORMAT:
You must return a JSON object with the following fields:
- summary: A clear restatement of user symptoms AND reported medical history.
- considerations: A ranked list of possible medical conditions commonly associated (Educational only).
- redFlagStatus: 'Normal' | 'Urgent' | 'Emergency'.
- redFlagDetails: Explanation of why it is urgent or emergency if applicable.
- nextSteps: Triage-level guidance (e.g., "Contact primary care within 24 hours", "Go to ER immediately").
- medicalEducation: Broad academic context about the symptoms and relevant anatomical/physiological pathways.
- disclaimer: The mandatory verbatim disclaimer provided in the user instruction.
- isEmergencyOverride: boolean.
`;

export async function analyzeSymptoms(userInput: string): Promise<SymptomAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            considerations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            redFlagStatus: { type: Type.STRING },
            redFlagDetails: { type: Type.STRING },
            nextSteps: { type: Type.STRING },
            medicalEducation: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
            isEmergencyOverride: { type: Type.BOOLEAN }
          },
          required: ["summary", "considerations", "redFlagStatus", "redFlagDetails", "nextSteps", "medicalEducation", "disclaimer", "isEmergencyOverride"]
        }
      }
    });

    const resultStr = response.text.trim();
    const result = JSON.parse(resultStr) as SymptomAnalysis;
    
    // Ensure the mandatory disclaimer is always correct regardless of model output
    result.disclaimer = APP_CONFIG.MANDATORY_DISCLAIMER;
    
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to analyze symptoms. Please try again.");
  }
}
