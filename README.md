# YouTube Content Idea Generator

An AI-powered web application that analyzes YouTube channels and generates creative video ideas based on channel content, current news trends, and Reddit discussions.

## Features

- **Channel Analysis**: Analyzes YouTube channel content, extracting main topics, themes, content style, and target audience
- **AI-Powered Topic Analysis**: Uses OpenAI GPT-4 to analyze video titles and descriptions
- **Video Idea Generation**: Generates 5 personalized video ideas with:
  - Engaging titles matching channel style
  - Thumbnail design suggestions
  - Detailed video concepts
- **Trend Integration**: Incorporates relevant news articles and Reddit discussions to suggest timely content
- **Modern UI**: Beautiful, responsive interface with dark mode support

## Prerequisites

- Node.js 18+ and npm
- YouTube Data API v3 key
- OpenAI API key
- NewsAPI key (optional, for news integration)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-content-analyzer
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

### Option 1: Using PowerShell Script (Windows)

Run the setup script:
```powershell
.\setup-env.ps1
```

The script will prompt you to enter your API keys and create a `.env.local` file automatically.

### Option 2: Manual Setup

Create a `.env.local` file in the root directory:

```env
# YouTube Data API v3 Key (Required)
YOUTUBE_API_KEY=your_youtube_api_key_here

# OpenAI API Key (Required)
OPENAI_API_KEY=your_openai_api_key_here

# NewsAPI Key (Optional)
NEWS_API_KEY=your_news_api_key_here
```

### Getting API Keys

1. **YouTube Data API v3**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable YouTube Data API v3
   - Create credentials (API Key)
   - Copy the API key

2. **OpenAI API Key**:
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Navigate to API Keys section
   - Create a new secret key
   - Copy the key (you won't be able to see it again)

3. **NewsAPI Key** (Optional):
   - Sign up at [NewsAPI](https://newsapi.org/)
   - Get your free API key from the dashboard

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Enter a YouTube channel URL in one of these formats:
   - `https://www.youtube.com/@channelname`
   - `https://www.youtube.com/channel/CHANNEL_ID`
   - `https://www.youtube.com/c/channelname`

4. Click "Analyze Channel" and wait for the analysis to complete

5. View the results:
   - Channel information and statistics
   - Topic analysis (main topics, themes, content style, target audience)
   - 5 AI-generated video ideas with thumbnail suggestions
   - Relevant news articles and Reddit discussions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI GPT-4 and GPT-4o-mini
- **HTTP Client**: Axios
- **Fonts**: Geist Sans & Geist Mono

## Project Structure

```
youtube-content-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for channel analysis
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── ChannelInfoSection.tsx
│   ├── ChannelInputForm.tsx
│   ├── NewsRedditSection.tsx
│   ├── PageHeader.tsx
│   ├── TopicsAnalysisSection.tsx
│   └── VideoIdeasSection.tsx
├── hooks/
│   └── useChannelAnalysis.ts      # Custom React hook
├── lib/
│   ├── ai.ts                      # OpenAI integration
│   ├── config.ts                  # Configuration and constants
│   ├── http-client.ts             # HTTP client utilities
│   ├── news.ts                    # NewsAPI integration
│   ├── reddit.ts                  # Reddit API integration
│   ├── types.ts                   # TypeScript type definitions
│   └── youtube.ts                 # YouTube API integration
└── public/                        # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project is configured for Vercel deployment. The `vercel.json` file contains the deployment configuration.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `YOUTUBE_API_KEY`
   - `OPENAI_API_KEY`
   - `NEWS_API_KEY` (optional)
4. Deploy

## Configuration

You can modify constants in `lib/config.ts`:
- `MAX_VIDEOS`: Number of videos to analyze (default: 10)
- `MAX_TOPICS`: Maximum topics to extract (default: 7)
- `MAX_NEWS_ARTICLES`: Maximum news articles (default: 10)
- `MAX_REDDIT_POSTS`: Maximum Reddit posts (default: 10)
- `API_TIMEOUT`: API request timeout in ms (default: 30000)

## Troubleshooting

### API Keys Not Working
- Ensure `.env.local` file exists in the root directory
- Restart the development server after creating/editing `.env.local`
- Check that API keys are valid and have proper permissions
- For YouTube API, ensure YouTube Data API v3 is enabled in Google Cloud Console

### Rate Limiting
- YouTube API has daily quotas (default: 10,000 units/day)
- OpenAI API has rate limits based on your plan
- If you hit rate limits, wait before making more requests

### Invalid YouTube URL
- Supported formats:
  - `https://www.youtube.com/@channelname`
  - `https://www.youtube.com/channel/CHANNEL_ID`
  - `https://www.youtube.com/c/channelname`

## License

This project is private and proprietary.

## Contributing

This is a private project. Contributions are not accepted at this time.
