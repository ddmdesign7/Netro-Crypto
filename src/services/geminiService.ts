import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Initialize the Gemini AI client
// process.env.GEMINI_API_KEY is injected by the environment
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

export type NetroAIPrompt = {
  system: string;
  user: string;
  model?: string;
};

export async function callNetroAI(prompt: NetroAIPrompt) {
  if (!GEMINI_KEY) {
    console.error("NetroAI: Missing GEMINI_API_KEY");
    return "API Key is missing. Please check your environment variables.";
  }

  try {
    const modelName = prompt.model || "gemini-3-flash-preview";
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt.user }] }],
      config: {
        systemInstruction: prompt.system,
        temperature: 0.7,
        // ThinkingLevel.LOW minimizes latency for dashboard summaries
        thinkingConfig: modelName.includes("pro") ? undefined : { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    if (!response.text) {
      console.warn("NetroAI: Received empty response text");
      return "I'm sorry, I couldn't synthesize a response. Your data might be too complex for a summary right now.";
    }

    return response.text;
  } catch (error) {
    console.error("NetroAI Error:", error);
    if (error instanceof Error && error.message.includes("quota")) {
      return "NetroAI is currently at capacity. Please try again in 60 seconds.";
    }
    return "Error connecting to NetroAI. The analysis engine is temporarily unavailable.";
  }
}

export const NetroAIService = {
  getPortfolioSummary: async (portfolioData: any) => {
    const system = "You are NetroAI, the advanced intelligence layer of NetroBank. You provide institutional-grade portfolio analysis with a friendly, professional tone. Focus on clarity and actionable insights.";
    
    // Simplify portfolio data for the AI to ensure fast processing
    const simplified = {
      totalValue: portfolioData.totalValue,
      change24h: portfolioData.change24h,
      topAssets: portfolioData.tokens.map((t: any) => ({
        symbol: t.symbol,
        balance: t.balance,
        value: t.value,
        change24h: t.change24h
      }))
    };

    const user = `Analyze this Web3 portfolio state and provide a strategic executive summary:\n${JSON.stringify(simplified, null, 2)}\n
    Structure your response with these sections:
    1. **Portfolio Health**: A high-level overview.
    2. **Performance Insights**: Key trends.
    3. **Risk Exposure**: Concentration risks.
    4. **NetroAI Strategy**: One actionable recommendation.
    
    Return in Markdown.`;

    return await callNetroAI({ system, user, model: "gemini-3.1-pro-preview" });
  },

  explainTransaction: async (transactionData: any) => {
    const system = "You are NetroAI, a blockchain forensics expert who simplifies complex data for everyday users.";
    const user = `Deconstruct this transaction into a human-readable story:\n${JSON.stringify(transactionData, null, 2)}\n
    Explain:
    - **What happened**: The core action.
    - **Asset Movement**: Assets involved.
    - **Security Check**: Safety assessment.
    
    Keep it concise. Return in Markdown.`;

    return await callNetroAI({ system, user, model: "gemini-3-flash-preview" });
  },

  getStakingProjection: async (params: {
    token: string;
    apy: number;
    amount: number;
    duration: string;
  }) => {
    const { token, apy, amount, duration } = params;

    const system = "You are NetroAI, a DeFi yield strategist.";
    const user = `Calculate a detailed staking projection for ${amount} ${token} at ${apy}% APY for ${duration}.
    
    Provide:
    1. **Yield Forecast**: Total rewards.
    2. **Growth Trajectory**: Balance evolution.
    3. **Market Context**: ${token} staking dynamics.
    4. **Safety Protocol**: Key risks.
    
    Return in Markdown.`;

    return await callNetroAI({ system, user, model: "gemini-3-flash-preview" });
  },

  getWalletRiskScan: async (tokens: any[]) => {
    const system = "You are NetroAI Security Sentinel. You specialize in identifying smart contract vulnerabilities and assets concentration.";
    const user = `Perform a security audit on these assets:\n${JSON.stringify(tokens, null, 2)}\n
    Check for:
    - **Asset Concentration**: Over-exposure risks.
    - **Market Volatility**: Short-term risks.
    
    Provide a **Security Rating (0-100)** and actionable safety steps. Return in Markdown.`;

    return await callNetroAI({ system, user, model: "gemini-3.1-pro-preview" });
  }
};
