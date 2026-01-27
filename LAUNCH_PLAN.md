# HealthyOrNot Launch Plan

## Revenue Streams Implemented

### 1. Freemium Subscriptions ($4.99/mo Pro, $29.99/mo Business)
- Free tier: 5 scans/month
- Pro tier: Unlimited scans, scan history, detailed analysis
- Business tier: API access (1000 calls/mo), team features

### 2. B2B API
- Usage-based pricing at $0.05/scan
- Enterprise contracts for high-volume users
- Target customers: Grocery apps, meal planners, health apps

### 3. Future: Affiliate Commissions
- Amazon affiliate links for healthier product alternatives
- Grocery delivery partnerships

---

## Marketing Launch Checklist

### Week 1: Pre-Launch Setup

- [ ] **Domain & Hosting**
  - Purchase domain: healthyornot.app (~$12/year)
  - Deploy to Vercel (free tier)
  - Set up custom domain

- [ ] **Stripe Setup**
  - Create Stripe account
  - Set up products: Pro ($4.99/mo), Business ($29.99/mo)
  - Configure webhook endpoint
  - Add price IDs to .env

- [ ] **Auth Setup**
  - Create Google Cloud OAuth credentials
  - Add to .env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - Generate NEXTAUTH_SECRET

- [ ] **Analytics**
  - Vercel Analytics (automatic)
  - Optional: Add PostHog for product analytics

### Week 2: Launch Campaign

#### Product Hunt Launch
1. Create Product Hunt account
2. Prepare assets:
   - Logo (1024x1024)
   - Gallery images (1270x760)
   - Demo video (30-60 seconds)
3. Write tagline: "AI-powered food label scanner for healthier choices"
4. Schedule launch for Tuesday (best day)

#### Reddit Strategy
Post to these subreddits (space out 1-2 per day):
- r/nutrition (2.3M members)
- r/loseit (3.5M members)
- r/HealthyFood (1.2M members)
- r/fitness (10M members)
- r/diabetes (100K members)
- r/EatCheapAndHealthy (2.5M members)
- r/SideProject (150K members)

Sample post:
```
Title: I built a free AI tool that scans food labels and tells you if it's actually healthy

I got frustrated trying to decode nutrition labels at the grocery store.
So I built HealthyOrNot - snap a photo of any food label and AI analyzes it instantly.

You get:
- Health score (0-100)
- Ingredient breakdown in plain English
- Detection of hidden additives and preservatives
- Personalized recommendations

5 free scans per month, no sign up needed.

Link: https://healthyornot.app

Would love feedback!
```

#### Twitter/X Strategy
1. Create account @healthyornot_ai
2. Content calendar:
   - Day 1: Launch announcement with demo video
   - Day 2-7: Daily "food expose" posts (scan popular products, reveal scores)
   - Engage with health/fitness influencers
   - Use hashtags: #HealthyEating #FoodTech #AI #Nutrition

Sample tweets:
```
🚨 Just scanned a "healthy" granola bar.
Health Score: 34/100

Hidden sugar: 18g (that's 4.5 teaspoons!)
Found: High fructose corn syrup, artificial flavors

The packaging said "Natural" 🙄

Want to scan your food? Link in bio.
```

#### Hacker News
Post on Show HN:
```
Show HN: HealthyOrNot - AI food label scanner

I built an AI tool that analyzes food labels using GPT-4 Vision.

Point your camera at any nutrition label → get instant health analysis.

Tech stack: Next.js 15, OpenAI GPT-4o, Prisma, Stripe

Free tier available, no login required.

https://healthyornot.app
```

### Week 3-4: Growth & Optimization

#### SEO Content
Create blog posts targeting:
- "Is [popular food] healthy?" (20+ articles)
- "Hidden ingredients in [food category]"
- "How to read nutrition labels"
- "Best healthy snacks 2025"

#### Influencer Outreach
Contact:
- Health/fitness YouTubers
- Dietitians with social presence
- Mom bloggers (family health angle)
- Diabetes/health condition advocates

Offer:
- Free Pro account
- Affiliate commission (20% lifetime)

#### Email Marketing
1. Collect emails from free users
2. Weekly newsletter:
   - "Food of the week" expose
   - Health tips
   - New feature announcements

---

## Revenue Projections

### Conservative (6 months)
- 1,000 free users
- 50 Pro subscribers ($250/mo)
- 5 Business customers ($150/mo)
- **Monthly Revenue: $400**

### Moderate (12 months)
- 10,000 free users
- 500 Pro subscribers ($2,500/mo)
- 20 Business customers ($600/mo)
- API revenue ($500/mo)
- **Monthly Revenue: $3,600**

### Optimistic (12 months)
- 50,000 free users
- 2,500 Pro subscribers ($12,500/mo)
- 50 Business customers ($1,500/mo)
- API revenue ($2,000/mo)
- **Monthly Revenue: $16,000**

---

## Immediate Action Items

### TODAY:
1. Deploy to Vercel
2. Create Stripe account and products
3. Set up Google OAuth
4. Test full flow: signup → scan → upgrade

### THIS WEEK:
1. Create social media accounts
2. Record demo video
3. Write Product Hunt copy
4. Schedule launch date

### COSTS:
- Domain: $12/year
- OpenAI API: ~$10-100/month (usage based)
- Everything else: FREE (Vercel, Stripe, etc.)

---

## Need Help With

1. **OpenAI API Key** - You need to add your key to .env
2. **Stripe Setup** - Create account at stripe.com
3. **Google OAuth** - Create credentials at console.cloud.google.com
4. **Domain** - Purchase from Namecheap/Google Domains

Let me know when you've done the above and I can help deploy!
