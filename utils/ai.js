const GEMINI_MODEL_CANDIDATES = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
].filter(Boolean);

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function extractJson(text) {
    const trimmed = text.trim();
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return JSON.parse((match?.[1] || trimmed).trim());
}

async function generateWithGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY in backend environment.');
    }

    let lastError;

    for (const model of GEMINI_MODEL_CANDIDATES) {
        try {
            const response = await fetch(
                `${GEMINI_API_BASE}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topP: 0.9,
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const message = data?.error?.message || `Gemini request failed with ${response.status}`;
                if (response.status === 404 || message.toLowerCase().includes('not found')) {
                    lastError = new Error(message);
                    continue;
                }
                throw new Error(message);
            }

            const text = data?.candidates?.[0]?.content?.parts
                ?.map((part) => part.text || '')
                .join('')
                .trim();

            if (!text) {
                throw new Error('Gemini returned an empty response.');
            }

            return { text, model };
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('No supported Gemini model is available.');
}

async function generateStructuredJson(prompt) {
    const result = await generateWithGemini(prompt);
    return {
        ...result,
        data: extractJson(result.text),
    };
}

export { extractJson, generateWithGemini, generateStructuredJson };
