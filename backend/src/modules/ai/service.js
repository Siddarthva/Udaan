const axios = require('axios');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');

class AIService {
    async callGroq(prompt, systemPrompt = 'You are an expert startup advisor and executive copywriter.') {
        const apiKey = env.groq.apiKey;
        if (!apiKey) {
            return null; // Triggers fallback
        }

        try {
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            return response.data?.choices?.[0]?.message?.content?.trim() || null;
        } catch (e) {
            console.warn('[GROQ API WARN]: Falling back to local template generator due to:', e.message);
            return null;
        }
    }

    async generateBio({ name, role, skills, experience }) {
        const prompt = `Write a concise 2-3 sentence professional biography for ${name || 'a founder'}, who is a ${role || 'Innovator'} skilled in ${skills || 'technology and product development'}. ${experience ? 'Background: ' + experience : ''}`;
        
        const aiResult = await this.callGroq(prompt);
        if (aiResult) return aiResult;

        // Structured Fallback
        return `${name || 'Innovator'} is a passionate ${role || 'Entrepreneur'} specializing in ${skills || 'cutting-edge technology and venture building'}. Focused on scaling high-impact solutions and building strong ecosystem partnerships.`;
    }

    async generateStartupDescription({ title, domain, targetAudience }) {
        const prompt = `Write a compelling 3-sentence description for a startup named "${title || 'Venture'}" operating in the "${domain || 'Technology'}" sector targeting ${targetAudience || 'innovators and enterprise customers'}.`;
        
        const aiResult = await this.callGroq(prompt);
        if (aiResult) return aiResult;

        // Structured Fallback
        return `${title || 'Our venture'} is an innovative platform in the ${domain || 'Technology'} space designed for ${targetAudience || 'modern teams'}. We streamline core operational workflows while delivering measurable value to stakeholders.`;
    }

    async generateStartupNames({ domain, keywords }) {
        const prompt = `Generate 5 creative, catchy startup names for a company in the ${domain || 'Tech'} industry focused on ${keywords || 'growth and automation'}. Return only a simple comma-separated list.`;

        const aiResult = await this.callGroq(prompt);
        if (aiResult) return aiResult.split(',').map(n => n.trim());

        // Structured Fallback
        const prefix = domain ? domain.substring(0, 4) : 'Nova';
        return [`${prefix}Pulse`, `${prefix}Sphere`, `Nexus${domain || 'Tech'}`, `VentureLabs`, `Omni${prefix}`];
    }

    async generateElevatorPitch({ title, problem, solution, fundingRequired }) {
        const prompt = `Write a powerful 30-second investor elevator pitch for ${title || 'our startup'}. Problem: ${problem || 'Inefficient manual workflows'}. Solution: ${solution || 'Automated cloud platform'}. Funding Goal: ₹${fundingRequired || '50'} Lakhs.`;

        const aiResult = await this.callGroq(prompt);
        if (aiResult) return aiResult;

        // Structured Fallback
        return `${title || 'Our startup'} solves ${problem || 'critical industry challenges'} through ${solution || 'our technology platform'}. We are seeking ₹${fundingRequired || '50'} Lakhs to scale product development, accelerate customer acquisition, and expand market share.`;
    }
}

module.exports = new AIService();
