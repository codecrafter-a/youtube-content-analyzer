import OpenAI from 'openai';
import { DESCRIPTION_MAX_LENGTH, MAX_TOPICS, MAX_VIDEOS } from './config';

let openaiClientCache: OpenAI | null = null;
let cachedApiKey: string | null = null;

function getOpenAIClient(apiKey: string): OpenAI {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  
  if (openaiClientCache && cachedApiKey === apiKey) {
    return openaiClientCache;
  }
  
  openaiClientCache = new OpenAI({ apiKey });
  cachedApiKey = apiKey;
  return openaiClientCache;
}

export interface TopicAnalysis {
  mainTopics: string[];
  commonThemes: string[];
  contentStyle: string;
  targetAudience: string;
}


export async function analyzeVideoTopics(
  videos: Array<{ title: string; description: string }>,
  apiKey: string
): Promise<TopicAnalysis> {
  if (!videos || videos.length === 0) {
    throw new Error('No videos provided for analysis');
  }

  const videoSummaries = videos
    .slice(0, MAX_VIDEOS)
    .map((v, i) => {
      const truncatedDesc = v.description.substring(0, DESCRIPTION_MAX_LENGTH);
      return `Video ${i + 1}: ${v.title}\nDescription: ${truncatedDesc}`;
    })
    .join('\n\n');

  const systemPrompt = 'You are an expert content analyst. Analyze YouTube videos and extract key insights. Always respond with valid JSON only.';
  
  const userPrompt = `Analyze the following YouTube videos and extract:
1. Main topics covered (${MAX_TOPICS} key topics maximum)
2. Common themes across videos
3. Content style and format
4. Target audience

Videos:
${videoSummaries}

Respond in JSON format:
{
  "mainTopics": ["topic1", "topic2", ...],
  "commonThemes": ["theme1", "theme2", ...],
  "contentStyle": "description of style",
  "targetAudience": "description of audience"
}`;

  try {
    const openai = getOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content) as TopicAnalysis;
    
    if (!parsed.mainTopics || !Array.isArray(parsed.mainTopics)) {
      throw new Error('Invalid response format: mainTopics missing');
    }
    
    parsed.mainTopics = parsed.mainTopics.slice(0, MAX_TOPICS);
    
    return parsed;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response from OpenAI');
    }
    if (error.message?.includes('rate limit') || error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please try again later');
    }
    throw new Error(`Failed to analyze topics: ${error.message}`);
  }
}

export interface VideoIdea {
  title: string;
  thumbnailDesign: string;
  videoIdea: string;
}

export async function generateVideoIdeas(
  channelInfo: {
    channelName: string;
    topics: TopicAnalysis;
    recentVideos: Array<{ title: string }>;
  },
  news: Array<{ title: string; description: string }>,
  redditPosts: Array<{ title: string; content: string }>,
  apiKey: string
): Promise<VideoIdea[]> {
  const newsSummary = news
    .slice(0, 5)
    .map((n) => `- ${n.title}: ${n.description.substring(0, 150)}`)
    .join('\n') || 'No recent news found';

  const redditSummary = redditPosts
    .slice(0, 5)
    .map((r) => `- ${r.title}: ${r.content.substring(0, 150)}`)
    .join('\n') || 'No Reddit discussions found';

  const recentTitles = channelInfo.recentVideos
    .slice(0, 5)
    .map((v) => `- ${v.title}`)
    .join('\n');

  const systemPrompt = 'You are an expert YouTube content strategist. Generate engaging, relevant video ideas that match the channel style. Always respond with valid JSON only.';
  
  const userPrompt = `Generate 5 video ideas for the channel "${channelInfo.channelName}".

Channel Analysis:
- Main Topics: ${channelInfo.topics.mainTopics.join(', ')}
- Common Themes: ${channelInfo.topics.commonThemes.join(', ')}
- Content Style: ${channelInfo.topics.contentStyle}
- Target Audience: ${channelInfo.topics.targetAudience}

Recent Video Titles (for style reference):
${recentTitles}

Relevant News Today:
${newsSummary}

Reddit Discussions:
${redditSummary}

Generate 5 video ideas that:
1. Match the channel's style and topics
2. Are relevant to current news and discussions
3. Have engaging titles in the same style as recent videos
4. Include thumbnail design suggestions
5. Include detailed video concept

Respond in JSON format:
{
  "ideas": [
    {
      "title": "Video title matching channel style",
      "thumbnailDesign": "Description of thumbnail design elements, colors, text placement",
      "videoIdea": "Detailed concept for the video including key points, structure, and hook"
    }
  ]
}`;

  try {
    const openai = getOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content) as { ideas: VideoIdea[] };
    
    if (!result.ideas || !Array.isArray(result.ideas)) {
      throw new Error('Invalid response format: ideas array missing');
    }
    
    return result.ideas.slice(0, 5).filter(idea => 
      idea.title && idea.thumbnailDesign && idea.videoIdea
    );
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response from OpenAI');
    }
    if (error.message?.includes('rate limit') || error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please try again later');
    }
    throw new Error(`Failed to generate video ideas: ${error.message}`);
  }
}

