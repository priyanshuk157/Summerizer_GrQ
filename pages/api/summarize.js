import formidable from "formidable";
import fs from "fs";
import Groq from "groq-sdk";

export const config = {
  api: { bodyParser: false },
};

// helper to promisify formidable
function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { fields, files } = await parseForm(req);

    console.log("FIELDS:", fields);
    console.log("FILES:", files);

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file// ✅ object, not array
   if (!uploadedFile || !uploadedFile.filepath) {
  return res.status(400).json({ error: "No file uploaded" });
}

    const text = fs.readFileSync(uploadedFile.filepath, "utf-8");
    const prompt = fields.prompt || "Summarize the meeting notes.";
    


    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});
    console.log("API Key:", groq);
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a meeting notes summarizer." },
        { role: "user", content: `${prompt}\n\n${text}` },
      ],
      model: "llama-3.1-8b-instant",
    });

    console.log("Groq API raw response:", JSON.stringify(completion, null, 2));

    const summary =
      completion.choices?.[0]?.message?.content ||
      completion.choices?.[0]?.text ||
      "No summary generated.";
      
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in /api/summarize:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
