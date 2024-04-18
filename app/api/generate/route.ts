import type { NextApiRequest, NextApiResponse } from 'next';

import { getStreamResponse } from '@/service/getstreamres';

// 命名导出 POST 方法
export async function POST(req: Request) {
    const {plots,background,genre,sex,language,} = await req.json();
    // completion
    const message = `Create a 300 word creative novel outline in ${language},based on the following  points ：1.the main character is ${sex}. 2.it's background is ${background}. 3. genre is ${genre} 4. plots is:${plots}  `;
    console.log('message:', message)
    const res = await getStreamResponse(message);


    return res
}