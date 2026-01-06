import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('screenshot') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No screenshot provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Determine media type
    const mediaType = file.type as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

    console.log('📸 Analyzing screenshot with Claude Vision...');

    // Analyze with Claude Vision
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: `Analyze this screenshot and extract information in JSON format.

Identify:
1. Source app (YouTube, Twitter, Instagram, or other)
2. Content type (video, tweet, post, reel, article)
3. Main text/quote (extract verbatim if visible)
4. For YouTube: Extract timestamp if visible (format: MM:SS or HH:MM:SS)
5. For Twitter: Extract author handle if visible
6. For Instagram: Extract username if visible
7. Generate a 5-8 word title summarizing the content
8. Categorize: video, social, article, or other
9. Confidence score (0-100) - how confident are you about the extraction?

Return ONLY valid JSON (no markdown, no explanation):
{
  "source_app": "YouTube" | "Twitter" | "Instagram" | "Other",
  "content_type": "video" | "tweet" | "post" | "reel" | "article" | "other",
  "text": "extracted quote or main text here",
  "title": "5-8 word summary",
  "category": "video" | "social" | "article" | "other",
  "metadata": {
    "timestamp": "12:34" (for YouTube),
    "author": "@username" (for Twitter),
    "username": "@username" (for Instagram),
    "video_id": "abc123" (if you can extract from URL),
    "tweet_url": "full URL" (if visible),
    "post_url": "full URL" (if visible)
  },
  "confidence": 85
}`,
            },
          ],
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    console.log('🤖 Claude response:', responseText);

    // Extract JSON from response (Claude might wrap it in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from Claude response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Upload screenshot to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName);

    const screenshotUrl = urlData.publicUrl;

    // Build source URL for deep linking
    let sourceUrl = null;
    const metadata = analysis.metadata || {};

    if (analysis.source_app === 'YouTube' && metadata.video_id) {
      const timestamp = metadata.timestamp ? `&t=${convertTimestampToSeconds(metadata.timestamp)}` : '';
      sourceUrl = `https://www.youtube.com/watch?v=${metadata.video_id}${timestamp}`;
    } else if (analysis.source_app === 'Twitter' && metadata.tweet_url) {
      sourceUrl = metadata.tweet_url;
    } else if (analysis.source_app === 'Instagram' && metadata.post_url) {
      sourceUrl = metadata.post_url;
    }

    // Save to database
    const { data: entry, error: dbError } = await supabase
      .from('entries')
      .insert({
        source_type: analysis.source_app.toLowerCase(),
        source_app: analysis.source_app,
        source_url: sourceUrl,
        content_text: analysis.text,
        content_summary: null,
        screenshot_url: screenshotUrl,
        title: analysis.title,
        category: analysis.category,
        tags: [],
        metadata: metadata,
        ai_confidence: analysis.confidence,
        ai_analysis: {
          raw_response: responseText,
          model: 'claude-3-5-sonnet-20241022',
          analyzed_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to save entry: ${dbError.message}`);
    }

    console.log('✅ Entry created:', entry.id);

    return NextResponse.json(entry);

  } catch (error: any) {
    console.error('Error analyzing screenshot:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze screenshot' },
      { status: 500 }
    );
  }
}

// Helper function to convert timestamp to seconds
function convertTimestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(':').map(Number);
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}
