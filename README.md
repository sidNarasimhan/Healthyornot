# HealthyOrNot - AI Food Label Scanner

An AI-powered food label scanner that helps you make healthier choices by analyzing nutrition labels and ingredients.

## Features

- 📸 **Camera Integration** - Take photos of food labels directly from your device
- 🖼️ **Image Upload** - Upload existing photos of nutrition labels
- 🤖 **AI Analysis** - Powered by OpenAI GPT-4o for accurate ingredient analysis
- 📊 **Health Scoring** - Get a 0-100 health score for any food product
- 💡 **Smart Recommendations** - Understand pros, cons, and get personalized recommendations
- 🎨 **Modern UI** - Clean, responsive design that works on all devices

## How It Works

1. **Scan or Upload** - Take a photo or upload an image of any food label
2. **AI Analysis** - GPT-4o reads the ingredients, nutritional facts, and identifies additives
3. **Get Insights** - Receive a health score, ingredient breakdown, and recommendations in simple language

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **AI**: OpenAI GPT-4o (Vision API)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Healthyornot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Deployment

This app is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your `OPENAI_API_KEY` environment variable
4. Deploy!

## Usage Tips

- Ensure good lighting when taking photos
- Include both the nutrition facts and ingredients list
- Hold your device steady to avoid blurry images
- Works with packaged foods, snacks, drinks, and supplements

## Health Scoring

- **80-100**: Excellent - Whole foods, minimal processing
- **60-79**: Good - Decent nutrition, some processing acceptable
- **40-59**: Fair - Moderate concerns, okay occasionally
- **20-39**: Poor - Significant concerns, limit consumption
- **0-19**: Unhealthy - Avoid or consume very rarely

## License

ISC

## Built With

Powered by OpenAI GPT-4o - Making healthy choices easier.