# Deployment Guide

This guide will help you deploy your HealthyOrNot app to Vercel.

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (already done! ✓)
   - Your code is on branch: `claude/food-scanner-app-hlgVd`

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (you can use your GitHub account)

3. **Import Project**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your `Healthyornot` repository
   - Select the branch `claude/food-scanner-app-hlgVd`

4. **Configure Environment Variables**
   - In the "Environment Variables" section, add:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: `<YOUR_OPENAI_API_KEY>` (use the API key provided)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-app-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   cd /home/user/Healthyornot
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY production
   # When prompted, paste your OpenAI API key
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

## Alternative Hosting Options

### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variable: `OPENAI_API_KEY`

### Railway

1. Create new project from GitHub repo
2. Add environment variable: `OPENAI_API_KEY`
3. Railway will auto-detect Next.js and deploy

### Docker (Self-hosted)

```bash
# Build
docker build -t healthyornot .

# Run
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key healthyornot
```

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Camera/upload buttons work
- [ ] Can upload an image
- [ ] AI analysis returns results
- [ ] Health score displays correctly
- [ ] Responsive on mobile devices
- [ ] HTTPS is enabled (automatic on Vercel)

## Testing Your Deployed App

1. Open your deployment URL
2. Click "Take Photo" or "Upload Image"
3. Upload a photo of any nutrition label
4. Verify the AI analysis works
5. Check the health score and recommendations

## Troubleshooting

### "Failed to analyze image" error
- Check that `OPENAI_API_KEY` is set correctly in Vercel
- Verify the API key is valid
- Check the Vercel function logs

### Build fails
- Ensure all dependencies are in package.json
- Check that TypeScript compiles: `npm run build`
- Review build logs in Vercel dashboard

### Slow performance
- Vercel's free tier has some cold starts (1-2 seconds)
- Consider upgrading to Pro for better performance
- Images are analyzed on-demand, which takes 3-5 seconds

## Monitoring

- View logs in Vercel Dashboard → Your Project → Logs
- Monitor API usage in Anthropic Console
- Set up error tracking with Sentry (optional)

## Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- OpenAI API Docs: https://platform.openai.com/docs
