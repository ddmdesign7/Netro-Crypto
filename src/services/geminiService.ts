import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
// Note: process.env.GEMINI_API_KEY is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type NetroAIPrompt = {
  system: string;
  user: string;
};

export async function callNetroAI(prompt: NetroAIPrompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt.user,
      config: {
        systemInstruction: prompt.system,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("NetroAI Error:", error);
    return "Error connecting to NetroAI. Please check your connection and try again.";
  }
}

export const NetroAIService = {
  getPortfolioSummary: async (portfolioData: any) => {
    const system = "You are NetroAI, the intelligence layer of NetroBank Web3 Evolution. You generate clean, human-readable summaries of crypto portfolios.";
    const user = `Summarize this portfolio data:\n${JSON.stringify(portfolioData, null, 2)}\nInclude:
- Total value
- Top performers
- Biggest risk exposure
- One suggested next action
Return the response in Markdown format.`;

    return await callNetroAI({ system, user });
  },

  explainTransaction: async (transactionData: any) => {
    const system = "You are NetroAI. You break down complex blockchain transactions in simple, safe language for beginners.";
    const user = `Explain this transaction in simple terms:\n${JSON.stringify(transactionData, null, 2)}\nReturn a friendly explanation in Markdown.`;

    return await callNetroAI({ system, user });
  },

  getStakingProjection: async (params: {
    token: string;
    apy: number;
    amount: number;
    duration: string;
  }) => {
    const { token, apy, amount, duration } = params;

    const system = "You are NetroAI. You calculate staking projections and explain risks in beginner-friendly language.";
    const user = `User wants to stake ${token} with APY ${apy}%.
Amount: ${amount} ${token}.
Duration: ${duration}.
Return:
- Expected yield
- Compounding effect (if relevant)
- Risks
- Recommendation (non-financial advice).
Return the response in Markdown format.`;

    return await callNetroAI({ system, user });
  },

  getWalletRiskScan: async (walletData: any) => {
    const system = "You are NetroAI. You scan wallets for potential security risks, high-risk approvals, and suspicious activity.";
    const user = `Perform a risk scan on this wallet data:\n${JSON.stringify(walletData, null, 2)}\nIdentify any red flags and provide safety recommendations. Return in Markdown.`;

    return await callNetroAI({ system, user });
  }
};
