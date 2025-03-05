import { hashIds, loadChatForChatId } from "@/lib/db";
import { NextRequest } from "next/server"

const encoder = new TextEncoder();

export const dynamic = 'force-static'
export const maxDuration = 60;

function truncate(q: string) {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

async function callOpenAiApi(chatId: string, message: string): Promise<string> {
  if (!hashIds.isValidId(chatId)) {
    throw new Error(`Invalid chat ID: ${chatId}`);
  }
  const realChatId = hashIds.decode(chatId)[0];
  console.log(`Real Chat ID: ${realChatId}`);
  const chatInfo = await loadChatForChatId(Number(realChatId.valueOf()));

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${chatInfo.modelApiToken}`);
  const apiBody = JSON.stringify({
    ...chatInfo.chatConfig,
    model: chatInfo.modelName,
    messages: [
      {
        role: "system",
        content: chatInfo.modelPrompt,
      },
      {
        role: "user",
        content: message
      }
    ]
  });
  console.log("Apibody", apiBody);

  const reply = await fetch(`${chatInfo.modelApi}/v1/chat/completions`, {
    method: 'POST',
    headers: headers,
    body: apiBody,
  });
  if (!reply.ok) {
    throw new Error(`Failed to call chat API: ${reply.status} ${reply.statusText}`);
  }
  const replyContent = await reply.json();

  console.log(`Reply(${reply.status}):`, JSON.stringify(replyContent.choices[0].message), null, 2);
  return replyContent.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  const { chatId, message } = await request.json();

  console.log("User sent:", message);

  const reply = await callOpenAiApi(chatId, message);
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
    message: "success",
    data: {
      reply: response.replaceAll("<br>", "\n"),
      translation: translatedText.replaceAll("<br>", "\n"),
    }
  })
}
