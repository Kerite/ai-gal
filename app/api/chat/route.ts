import { NextRequest } from "next/server"

const encoder = new TextEncoder();

export const dynamic = 'force-static'
export const maxDuration = 60;

function truncate(q: string) {
    const len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

async function callOpenAiApi(content: string): Promise<string> {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

    const reply = await fetch(`${process.env.AI_API_ADDRESS}/v1/chat/completions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            model: process.env.MODEL_NAME,
            temperature: 0.5,
            top_p: 0.8,
            messages: [
                {
                    role: "system",
                    content: process.env.AI_CHAT_PROMPT,
                },
                {
                    role: "user",
                    content: content
                }
            ]
        })
    });
    const replyContent = await reply.json();

    console.log(`Reply(${reply.status}):`, JSON.stringify(replyContent.choices[0].message), null, 2);
    return replyContent.choices[0].message.content;
}

export async function POST(request: NextRequest) {
    const { message } = await request.json();

    console.log("User sent:", message);
    const reply = await callOpenAiApi(message);
    const response = reply.substring(reply.indexOf("</think>") + 8).trim()
        .replaceAll(/\(.*?\)/g, '')
        .replaceAll(/（.*?）/g, '')
        .replaceAll("\n", "<br>");

    console.log(`AI response: ${response}`);
    const salt = crypto.randomUUID();
    const curtime = Math.floor(Date.now() / 1000);
    const rawSign = `${process.env.TRANSLATE_APP_ID}${truncate(response)}${salt}${curtime}${process.env.TRANSLATE_API_KEY}`;
    const sign = await crypto.subtle.digest("SHA-256", encoder.encode(rawSign));
    const signStr = Array.from(new Uint8Array(sign)).map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append("q", response);
    formData.append("from", "auto");
    formData.append("to", "zh-CHS");
    formData.append("appKey", `${process.env.TRANSLATE_APP_ID}`);
    formData.append("salt", salt);
    formData.append("sign", signStr);
    formData.append("signType", "v3");
    formData.append("curtime", curtime.toString());

    const data = await fetch("https://openapi.youdao.com/api", {
        method: "POST",
        body: formData
    });

    const translationResponse = await data.json();

    let translatedText = "";
    if (translationResponse.translation) {
        translatedText = translationResponse.translation[0]
    } else {
        console.log("Tranlation API Error", translationResponse);
    }
    return Response.json({
        data: {
            reply: response.replaceAll("<br>", "\n"),
            translation: translatedText.replaceAll("<br>", "\n"),
        }
    })
}
