import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinances = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "Belum ada data transaksi untuk dianalisis. Silakan tambahkan pemasukan dan pengeluaran Anda terlebih dahulu.";
  }

  // Prepare data for the prompt to save tokens, we minimize the JSON structure
  const simplifiedData = transactions.map(t => ({
    d: t.date.split('T')[0], // Date
    t: t.type === TransactionType.INCOME ? 'IN' : 'OUT', // Type
    a: t.amount, // Amount
    c: t.category, // Category
    desc: t.description // Description
  }));

  const prompt = `
    Anda adalah asisten keuangan pribadi yang cerdas. Berikut adalah data transaksi keuangan saya dalam format JSON (d=date, t=type (IN/OUT), a=amount, c=category, desc=description):
    
    ${JSON.stringify(simplifiedData)}
    
    Tolong berikan analisis singkat dan bermanfaat dalam Bahasa Indonesia mengenai:
    1. Pola pengeluaran saya.
    2. Kategori mana yang paling boros.
    3. Saran praktis untuk berhemat atau memperbaiki kesehatan keuangan saya.
    4. Nada bicara harus suportif, profesional, tapi santai.
    
    Gunakan format Markdown untuk outputnya. Buat poin-poin agar mudah dibaca.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful financial advisor utilizing Indonesian language.",
      }
    });

    return response.text || "Maaf, saya tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Error generating analysis:", error);
    return "Terjadi kesalahan saat menghubungi layanan AI. Pastikan kunci API Anda valid atau coba lagi nanti.";
  }
};