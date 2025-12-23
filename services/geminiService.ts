
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI strictly following the guideline to use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiCommentary = async (score: number, status: 'win' | 'fail' | 'milestone'): Promise<string> => {
  try {
    const prompt = status === 'fail' 
      ? `O jogador perdeu com uma pontuação de ${score} no jogo Gemini Jump 3D. Dê um comentário curto e sarcástico ou encorajador (máximo 15 palavras).`
      : status === 'milestone'
      ? `O jogador atingiu ${score} pontos! Dê um elogio épico e curto (máximo 15 palavras).`
      : `Dê as boas vindas ao jogador para o Gemini Jump 3D.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 50,
      }
    });

    // Fix: Access .text property directly as per latest SDK guidelines
    return response.text || "Continue pulando!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return score > 0 ? `Incrível! ${score} pontos!` : "Bem-vindo ao desafio!";
  }
};