"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class LLMService {
    // Use a cheaper model for testing.
    constructor(apiKey, model = 'gemini-2.0-flash-lite') {
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = model;
    }
    sanitizeJsonResponse(text) {
        // First, try to extract JSON from markdown code blocks
        const codeBlockMatch = text.match(/```(?:json)?\n([\s\S]*?)```/);
        if (codeBlockMatch) {
            text = codeBlockMatch[1];
        }
        // Find the first '{' and last '}'
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex === -1 || endIndex === -1) {
            throw new Error('No JSON object found in response');
        }
        // Extract just the JSON part
        let jsonStr = text.slice(startIndex, endIndex + 1);
        // Remove any remaining markdown code block indicators
        jsonStr = jsonStr.replace(/```json\n?|\n?```/g, '');
        // Remove any trailing commas before closing braces
        jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');
        // Remove any newlines within string values
        jsonStr = jsonStr.replace(/"([^"]*)\n([^"]*)"/g, '"$1 $2"');
        // Handle escaped newlines in strings
        jsonStr = jsonStr.replace(/\\n/g, ' ');
        return jsonStr;
    }
    async explainLogs(logs) {
        const model = this.genAI.getGenerativeModel({ model: this.model });
        const prompt = `You are a debugging expert. Analyze the following error logs and provide:
1. A clear explanation of what's causing the problem
2. A specific solution to fix the issue
3. The severity of the issue (high/medium/low)
4. Your confidence level in the analysis (high/medium/low)

Error logs:
${logs}

Format your response as JSON with these fields:
{
    "problem": "clear explanation of the issue",
    "solution": "specific steps to fix it",
    "severity": "high|medium|low",
    "confidence": "high|medium|low|unknown"
}

Important: Respond with ONLY the JSON object, no additional text or markdown formatting.`;
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Sanitize the response
            const sanitizedJson = this.sanitizeJsonResponse(text);
            // Parse the JSON response
            const analysis = JSON.parse(sanitizedJson);
            // Validate the response format
            if (!analysis.problem || !analysis.solution || !analysis.confidence || !analysis.severity) {
                throw new Error('Invalid response format from LLM');
            }
            // Validate confidence value
            if (!['high', 'medium', 'low'].includes(analysis.confidence)) {
                analysis.confidence = 'unknown';
            }
            // Validate severity value
            if (!['high', 'medium', 'low'].includes(analysis.severity)) {
                analysis.severity = 'medium';
            }
            return analysis;
        }
        catch (error) {
            console.error('Error analyzing logs with LLM:', error);
            throw new Error('Failed to analyze logs');
        }
    }
}
exports.LLMService = LLMService;
