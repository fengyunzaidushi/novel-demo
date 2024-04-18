import OpenAI from 'openai';
import { NextResponse } from 'next/server';



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });


export const runtime = 'nodejs';

export async function getStreamResponse(message: string) {
    try {

        console.log('messages:',message)

        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [{role: 'user', content: message}],
        });

        const stream = response.toReadableStream();
        return new Response(stream);
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            throw error;
        }
    }
}