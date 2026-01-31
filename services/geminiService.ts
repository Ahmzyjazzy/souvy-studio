
import { GoogleGenAI, Type } from "@google/genai";
import { ToneTier } from '../types';

// Use the API key directly from the environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Identifies the safe customization zone of a product image.
   * Returns normalized coordinates [ymin, xmin, ymax, xmax] 0-1000.
   */
  async identifyCustomZone(imageUrl: string): Promise<{ ymin: number; xmin: number; ymax: number; xmax: number } | null> {
    const prompt = "Analyze this product image. Identify the PRIMARY flat surface area suitable for engraving or printing a logo. Return exactly one bounding box for this 'safe zone' in normalized coordinates [ymin, xmin, ymax, xmax] where 0-1000 represents the full image. Respond in JSON format.";
    
    try {
      // Use a CORS proxy to prevent "Failed to fetch" on third-party images
      const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
      const imgRes = await fetch(proxiedUrl);
      if (!imgRes.ok) throw new Error("Network response was not ok");
      
      const blob = await imgRes.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Use gemini-3-pro-preview for complex spatial reasoning tasks.
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64 } }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ymin: { type: Type.NUMBER, description: 'The minimum y coordinate.' },
              xmin: { type: Type.NUMBER, description: 'The minimum x coordinate.' },
              ymax: { type: Type.NUMBER, description: 'The maximum y coordinate.' },
              xmax: { type: Type.NUMBER, description: 'The maximum x coordinate.' }
            },
            required: ['ymin', 'xmin', 'ymax', 'xmax']
          }
        }
      });
      
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      console.error("Spatial analysis failed or fetch error:", e);
      // Fallback: return a generic center zone if fetch/AI fails so the UI doesn't break
      return { ymin: 300, xmin: 300, ymax: 700, xmax: 700 };
    }
  },

  /**
   * Generates creative gift notes and design advice based on user inputs.
   */
  async generateCreativeContent(params: {
    productName: string;
    recipientName: string;
    occasion: string;
    tone: ToneTier;
    logoDescription: string;
  }) {
    const { productName, recipientName, occasion, tone, logoDescription } = params;

    const prompt = `
      You are the "Souvy Creative Engine," a sophisticated AI for a premium gifting platform.
      
      TASK 1: Generate a 2-3 sentence heartfelt or professional note.
      - Gift: ${productName}
      - Occasion: ${occasion}
      - Recipient: ${recipientName}
      - Tone: ${tone}
      - Constraint: Reference the specific item or the "vibe" of gifting. Sophisticated, no clichés.

      TASK 2: Provide "vibe-consistent" design advice for branding.
      - User Intent: ${logoDescription}
      - Product: ${productName}
      - Output: Practical, aesthetic-driven advice for engraving or positioning.

      TASK 3: Logistic Logic.
      - Create a summary of the final design specs.

      Respond in JSON format.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              note: { type: Type.STRING, description: 'The generated gift note.' },
              designAdvice: { type: Type.STRING, description: 'The branding/design advice.' },
              finalSpecs: { type: Type.STRING, description: 'Summary of customization for the production team.' }
            },
            required: ['note', 'designAdvice', 'finalSpecs']
          }
        }
      });

      const text = response.text;
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to generate creative content", e);
      return null;
    }
  },

  /**
   * Verifies a payment receipt image against expected order data.
   */
  async verifyReceipt(receiptBase64: string, expected: { amount: number, reference: string, accountName: string }) {
    const prompt = `
      Analyze this bank transfer receipt. 
      Verify if the following details match the receipt:
      1. Amount: ${expected.amount} (Note: check if it matches the total amount on the receipt).
      2. Transaction Reference/Remark: "${expected.reference}" (Look for this exact string in the notes, remarks, or reference section).
      3. Recipient Account Name: "${expected.accountName}".

      Return a JSON response with:
      - verified (boolean): true if ALL three match reasonably well.
      - reason (string): Explain what matched or what didn't match. Be concise.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: receiptBase64 } }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verified: { type: Type.BOOLEAN },
              reason: { type: Type.STRING }
            },
            required: ['verified', 'reason']
          }
        }
      });
      return JSON.parse(response.text || '{"verified": false, "reason": "No response"}');
    } catch (e) {
      console.error("Receipt verification failed:", e);
      return { verified: false, reason: "Error processing the receipt analysis." };
    }
  }
};
