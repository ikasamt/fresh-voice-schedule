// Gemini API client
const GEMINI_API_KEY = "AIzaSyAO1CfzhpRHe1-SrNo70XBlqJiFfnnNAWA";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface ParsedSchedule {
  title: string;
  scheduledDate: Date | null;
  estimatedDuration: number | null;
  location: string | null;
  originalText: string;
  subtasks?: ParsedSchedule[]; // サブタスクの配列
}

export async function parseScheduleText(text: string): Promise<ParsedSchedule> {
  const prompt = `
あなたはスケジュール管理アシスタントです。
ユーザーの入力テキストから以下の情報を抽出してください：

1. タスク/イベントの内容
2. 日時（あれば）
3. 所要時間（あれば）
4. 場所（あれば）- 駅名、施設名、店名、住所など場所に関する情報
5. サブタスク（複数のステップや項目が含まれている場合は分解してください）

入力テキスト: "${text}"
現在時刻: ${new Date().toISOString()}

以下のJSON形式で返してください（コードブロックなし、JSONのみ）：
{
  "title": "タスクのタイトル",
  "scheduledDate": "ISO8601形式の日時（例：2024-01-20T15:00:00）またはnull",
  "estimatedDurationMinutes": 所要時間（分）またはnull,
  "location": "場所名またはnull",
  "subtasks": [
    {
      "title": "サブタスク1",
      "scheduledDate": "ISO8601形式の日時またはnull",
      "estimatedDurationMinutes": 所要時間（分）またはnull,
      "location": "場所名またはnull"
    }
  ]
}

注意：
- 箇条書き、番号付きリスト、「〜して〜する」のような複数ステップがある場合は、subtasksに分解してください
- サブタスクがない場合はsubtasksは空配列[]にしてください
- 親タスクは全体を表す抽象的なタイトルにしてください
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 256,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Parse JSON response
    const parsed = parseJsonResponse(responseText);
    
    return {
      title: parsed.title || text,
      scheduledDate: parsed.scheduledDate ? new Date(parsed.scheduledDate) : null,
      estimatedDuration: parsed.estimatedDurationMinutes || null,
      location: parsed.location || null,
      originalText: text,
      subtasks: parsed.subtasks ? parsed.subtasks.map((sub: any) => ({
        title: sub.title,
        scheduledDate: sub.scheduledDate ? new Date(sub.scheduledDate) : null,
        estimatedDuration: sub.estimatedDurationMinutes || null,
        location: sub.location || null,
        originalText: sub.title,
      })) : [],
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      title: text,
      scheduledDate: null,
      estimatedDuration: null,
      location: null,
      originalText: text,
    };
  }
}

export async function parseScheduleFromImage(imageBase64: string): Promise<ParsedSchedule> {
  const prompt = `
この画像からイベントや予定に関する情報を読み取ってください。
特に以下の情報を抽出してください：
- イベント名やタイトル
- 日付や時間
- 場所
- その他の重要な情報

抽出した情報を自然な日本語の予定説明文として出力してください。
例：「12月10日 14:00から 東京ホールでコンサート」
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 512,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini Vision API error: ${response.statusText}`);
    }

    const data = await response.json();
    const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse the extracted text as schedule
    return await parseScheduleText(extractedText);
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    throw error;
  }
}

function parseJsonResponse(text: string): any {
  try {
    // Remove markdown code blocks if present
    let jsonText = text;
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?\s*(.*?)\s*```/s);
      if (match) {
        jsonText = match[1];
      }
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("JSON parse error:", error);
    // Manual parsing as fallback
    const result: any = {};
    
    // Extract title
    const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/);
    if (titleMatch) result.title = titleMatch[1];
    
    // Extract date
    const dateMatch = text.match(/"scheduledDate"\s*:\s*"([^"]+)"/);
    if (dateMatch && dateMatch[1] !== "null") {
      result.scheduledDate = dateMatch[1];
    }
    
    // Extract duration
    const durationMatch = text.match(/"estimatedDurationMinutes"\s*:\s*(\d+)/);
    if (durationMatch) {
      result.estimatedDurationMinutes = parseInt(durationMatch[1]);
    }
    
    // Extract location
    const locationMatch = text.match(/"location"\s*:\s*"([^"]+)"/);
    if (locationMatch && locationMatch[1] !== "null") {
      result.location = locationMatch[1];
    }
    
    return result;
  }
}