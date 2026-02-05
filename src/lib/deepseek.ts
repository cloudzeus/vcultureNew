export const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

interface TranslationOptions {
    text?: string;
    context?: Record<string, any>;
    type?: string;
}

export async function translateContent({ text, context, type }: TranslationOptions) {
    const formattedKey = process.env.DEEPSEEK_API_KEY?.trim();
    if (!formattedKey) {
        throw new Error('Missing DeepSeek API Key');
    }

    if (!text && !context) {
        throw new Error('No text provided for translation');
    }

    // We handle two modes: simple text string or object/map of fields
    const isBulk = typeof context === 'object' && context !== null;

    const systemPrompt = isBulk
        ? `You are a professional translator for a creative agency. Translate the provided JSON object values from Greek to English.
           - Maintain the exact same keys.
           - Keep the tone professional, creative, and engaging (marketing/cinematic style).
           - Do not translate proper names if they are international, but transliterate if needed.
           - Return ONLY valid JSON with no markdown formatting.`
        : `You are a professional translator. Translate the following text from Greek to English. Maintain the tone. Return only the translated text.`;

    const userContent = isBulk ? JSON.stringify(context) : text;

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${formattedKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            temperature: 0.3,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let translatedContent = data.choices[0].message.content.trim();

    if (isBulk) {
        translatedContent = translatedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        try {
            return JSON.parse(translatedContent);
        } catch (e) {
            console.error('Failed to parse translation JSON:', translatedContent);
            throw new Error('Failed to parse translation response');
        }
    } else {
        return translatedContent;
    }
}
