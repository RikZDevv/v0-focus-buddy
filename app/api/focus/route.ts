import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Groq untuk text processing (cepat, anti-limit)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const mode = formData.get('mode') as string;
    const text = formData.get('text') as string;
    const imageFile = formData.get('image') as File | null;

    // MODE MEDISCAN - Pakai OpenRouter dengan Gemini 2.0 Flash
    if (mode === 'mediscan') {
      if (!imageFile) {
        throw new Error('No image provided for MediScan');
      }

      // Convert image to base64
      const bytes = await imageFile.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = imageFile.type;

      const prompt = `You are MediScan AI, a helpful medical information assistant. Analyze this image and provide educational health information.

⚠️ IMPORTANT DISCLAIMER: This is for educational purposes only and NOT a medical diagnosis. Always consult a healthcare professional for medical advice.

Please analyze the image and provide:

🔍 **What I See**
[Describe what's visible in the image - skin condition, symptom, medication, etc.]

📋 **General Information**
[Provide educational context about what's shown - common causes, general facts]

💡 **Helpful Tips**
[General wellness tips related to what's shown - NOT medical advice]

🏥 **When to See a Doctor**
[List signs that would warrant professional medical consultation]

${text ? `\nAdditional context from user: ${text}` : ''}

Remember: Be helpful and educational, but always emphasize this is not a diagnosis!`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64}`,
                  },
                },
                {
                  type: 'text',
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenRouter API error');
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content || '';

      return NextResponse.json({ result });
    }

    // MODE LAINNYA - Pakai Groq (wus-wus cepat)
    let prompt: string;

    switch (mode) {
      case 'eli5':
        prompt = `You are a friendly teacher explaining to a 5-year-old. Use simple analogies and everyday examples. Keep it fun and engaging!

Explain this in the simplest way possible:
${text}

Remember: Use short sentences, fun comparisons (like "it's like when you..."), and make it feel like a story!`;
        break;

      case 'emoji':
        prompt = `Transform this into EXACTLY 3 powerful bullet points. Each bullet MUST start with a relevant, high-impact emoji that captures the essence of that point.

Text to transform:
${text}

Format:
🎯 [First key insight - make it punchy and memorable]
💡 [Second key insight - actionable if possible]  
⚡ [Third key insight - the "aha!" moment]

Keep each bullet under 15 words. Make them scannable and impactful!`;
        break;

      case 'podcast':
        prompt = `Convert this into a conversational podcast script between two hosts: Alex (the curious one) and Sam (the expert). Make it natural, engaging, and educational!

Topic to discuss:
${text}

Format the script like this:
🎙️ Alex: [Opens with an intriguing question or hook]
🎧 Sam: [Explains in an accessible way]
🎙️ Alex: [Asks follow-up or shares relatable reaction]
🎧 Sam: [Deepens the explanation with an example]
🎙️ Alex: [Wraps up with key takeaway]

Keep it under 300 words. Make it sound like a real conversation!`;
        break;

      case 'action_steps':
        prompt = `You are an ADHD coach. Convert this wall of text into a clear, actionable checklist that's easy to follow for someone with ADHD.

Text to convert:
${text}

Rules:
- Use [ ] checkbox format
- Each step should be ONE specific action (verb first!)
- Break down complex tasks into micro-steps
- Add time estimates if helpful (e.g., "~5 min")
- Group related tasks together
- Add encouraging emojis sparingly
- Maximum 10 steps

Format:
📋 **Action Plan**

[ ] Step 1 (~X min)
[ ] Step 2 (~X min)
...

💪 You've got this!`;
        break;

      case 'context_translate':
        prompt = `You are a language expert and educator. Translate/simplify this text and create a helpful glossary.

Text to process:
${text}

Provide:

📝 **Simplified Version**
[Rewrite the text in clear, simple English that anyone can understand]

📚 **Glossary of Difficult Terms**
| Term | Simple Definition |
|------|------------------|
| [word] | [easy explanation] |

💡 **Context Tip**
[One sentence explaining when/why someone might encounter this type of text]`;
        break;

      case 'mindmap':
        prompt = `Create a hierarchical mind map showing the relationships between ideas in this text. Use indentation and visual markers to show the hierarchy.

Text to analyze:
${text}

Format as a text-based mind map:

🧠 **[Main Topic/Central Idea]**
│
├── 📌 **[Major Theme 1]**
│   ├── • [Sub-point]
│   ├── • [Sub-point]
│   └── • [Sub-point]
│
├── 📌 **[Major Theme 2]**
│   ├── • [Sub-point]
│   └── • [Sub-point]
│
└── 📌 **[Major Theme 3]**
    ├── • [Sub-point]
    └── • [Sub-point]

🔗 **Connections**: [Note any relationships between themes]

Keep it scannable and visually organized!`;
        break;

      default:
        throw new Error('Invalid mode');
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const result = chatCompletion.choices[0]?.message?.content || '';

    return NextResponse.json({ result });

  } catch (error) {
    console.error('Focus API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
