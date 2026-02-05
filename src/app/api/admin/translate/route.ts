import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { translateContent } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { text, context, type } = body;

        try {
            const result = await translateContent({ text, context, type });

            if (typeof context === 'object' && context !== null) {
                return NextResponse.json({ translations: result });
            } else {
                return NextResponse.json({ translation: result });
            }
        } catch (err: any) {
            console.error('Translation error:', err);
            // Return 502 for external API errors, 500 for parsing errors
            const status = err.message.includes('DeepSeek API failed') ? 502 : 500;
            return NextResponse.json({ error: err.message }, { status });
        }
    } catch (error) {
        console.error('Route error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
