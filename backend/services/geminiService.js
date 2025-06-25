
const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  }

  async summarizeJudgment(judgmentText, caseMetadata = {}) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = `
As a legal AI assistant, analyze this Indian court judgment and provide a comprehensive summary:

**Case Metadata:**
${caseMetadata.title ? `Title: ${caseMetadata.title}` : ''}
${caseMetadata.court ? `Court: ${caseMetadata.court}` : ''}
${caseMetadata.date ? `Date: ${caseMetadata.date}` : ''}
${caseMetadata.citation ? `Citation: ${caseMetadata.citation}` : ''}
${caseMetadata.bench ? `Bench: ${caseMetadata.bench}` : ''}

**Judgment Text:**
${judgmentText.substring(0, 15000)} ${judgmentText.length > 15000 ? '...[truncated]' : ''}

Please provide a structured summary with the following sections:

## 📌 Case Details
- Case Name & Number
- Court & Jurisdiction
- Date of Judgment
- Judge(s)/Bench

## ⚖️ Legal Issues
- Key legal questions raised
- Constitutional/statutory provisions involved

## 🔍 Ratio Decidendi
- The core legal principle/ratio
- Key reasoning of the court

## 📚 Legal Significance
- Precedent value
- Impact on existing law
- Future implications

## 📝 Case Summary
- Brief factual background
- Court's decision and reasoning
- Final outcome/relief granted

## 📖 Citations & References
- Important cases cited
- Statutory provisions referenced

Keep the summary comprehensive yet accessible for legal research purposes.
`;

      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error(`Failed to summarize judgment: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
