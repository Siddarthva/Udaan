const axios = require('axios');
const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');

const clip = (value, max = 500) => String(value ?? '').slice(0, max);

class AIService {
    async callGroq(prompt, systemPrompt = 'You are an expert startup advisor and executive copywriter.') {
        const apiKey = env.groq.apiKey;
        if (!apiKey) {
            throw new ApiError(503, 'AI assistant is not configured on this server');
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
                    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                    timeout: 10000
                }
            );
            const text = response.data?.choices?.[0]?.message?.content?.trim();
            if (!text) throw new ApiError(502, 'AI assistant returned an empty response');
            return text;
        } catch (e) {
            if (e instanceof ApiError) throw e;
            console.error(`[GROQ] request failed: ${e.response?.status || ''} ${e.message}`);
            throw new ApiError(502, 'AI assistant is temporarily unavailable');
        }
    }

    generateBio({ name, role, skills, experience }) {
        return this.callGroq(
            `Write a concise 2-3 sentence professional biography for ${clip(name, 80) || 'a founder'}, who is a ${clip(role, 40) || 'startup community member'} skilled in ${clip(skills, 200) || 'technology and product development'}. ${experience ? 'Background: ' + clip(experience, 300) : ''}`
        );
    }

    generateStartupDescription({ title, domain, targetAudience }) {
        return this.callGroq(
            `Write a compelling 3-sentence description for a startup named "${clip(title, 100) || 'Venture'}" operating in the "${clip(domain, 60) || 'Technology'}" sector targeting ${clip(targetAudience, 120) || 'innovators and enterprise customers'}.`
        );
    }

    async generateStartupNames({ domain, keywords }) {
        const text = await this.callGroq(
            `Generate 5 creative, catchy startup names for a company in the ${clip(domain, 60) || 'Tech'} industry focused on ${clip(keywords, 120) || 'growth and automation'}. Return only a simple comma-separated list.`
        );
        return text.split(',').map((n) => n.trim()).filter(Boolean);
    }

    generateElevatorPitch({ title, problem, solution, fundingRequired }) {
        return this.callGroq(
            `Write a powerful 30-second investor elevator pitch for ${clip(title, 100) || 'our startup'}. Problem: ${clip(problem, 300) || 'not specified'}. Solution: ${clip(solution, 300) || 'not specified'}. Funding goal: ${clip(fundingRequired, 30) || 'not specified'}.`
        );
    }
}

module.exports = new AIService();
