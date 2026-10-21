# Social Media AI Agent (Starter) — हिंदी गाइड

यह Next.js + Supabase आधारित शुरुआती प्रोजेक्ट है। इसमें लॉगिन, पोस्ट-ड्राफ्ट, शेड्यूलिंग-डेटा, एडमिन-रोल का आधार और API adapter placeholders हैं। **यह अभी अपने-आप YouTube/Instagram/Facebook पर प्रकाशित नहीं करता**: उसके लिए हर प्लेटफॉर्म की आधिकारिक API, OAuth consent, permissions और production scheduler/worker कॉन्फ़िगर करना होगा।

## Stack
- Next.js App Router + TypeScript
- Supabase Auth + PostgreSQL + Row Level Security (RLS)
- Vercel hosting (free tier subject to limits)
- Platform adapters: YouTube Data API, Instagram Graph API, Facebook Graph API (not yet wired)

## Android से शुरू करने के स्टेप
1. ZIP डाउनलोड करके Files/Downloads में Extract करें।
2. GitHub पर नया repository बनाएं, जैसे `social-media-ai-agent`.
3. GitHub मोबाइल वेबसाइट में `Add file` → `Upload files` से extracted project files upload करें। ZIP को repository में डालना पर्याप्त नहीं; ZIP extract करके files upload करें।
4. Supabase में नया project बनाएं। SQL Editor में `supabase/schema.sql` का पूरा SQL चलाएं।
5. Supabase → Project Settings → API से Project URL और anon/publishable key लें।
6. Repository root में `.env.example` की कॉपी `.env.local` नाम से बनाएं और values भरें। `.env.local` GitHub पर upload न करें।
7. Vercel में GitHub repository Import करें। Environment Variables में `NEXT_PUBLIC_SUPABASE_URL` और `NEXT_PUBLIC_SUPABASE_ANON_KEY` सेट करें; Deploy करें।
8. Supabase Authentication → URL Configuration में deployed Vercel URL को Site URL और Redirect URLs में जोड़ें।
9. वेबसाइट पर Sign up करें। Admin बनाने के लिए Supabase SQL Editor में अपने signup वाले ईमेल के बदले नीचे वाला SQL चलाएं:
   `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL');`
   `YOUR_EMAIL` को अपने ईमेल से बदलें। Admin route सुरक्षा के लिए database role/RLS इस्तेमाल करें; केवल URL छिपाना सुरक्षा नहीं है।
10. पहले Draft बनाकर टेस्ट करें। असली publishing जोड़ने से पहले OAuth और platform app review/permissions पूरी करें।

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

इन public Supabase values को browser में इस्तेमाल किया जा सकता है; **service-role key कभी भी `NEXT_PUBLIC_` variable में न रखें और GitHub पर न डालें**।

## मौजूदा सीमाएँ
- AI caption generation अभी demo template है; किसी paid AI API की जरूरत नहीं, लेकिन यह वास्तविक LLM नहीं है।
- Scheduler UI केवल schedule timestamp save करता है; background worker अभी शामिल नहीं है।
- Platform publish adapters जानबूझकर placeholder हैं; कोई fake publish success नहीं दिखाते।
- Instagram publishing के लिए सामान्यतः Professional account और Meta Graph API permissions/setup चाहिए।
- Facebook Pages publishing के लिए Page access token और उचित permissions चाहिए।
- YouTube upload के लिए Google OAuth, YouTube Data API और quota लागू हैं; unverified projects पर visibility/verification restrictions हो सकती हैं।
- Free tier में hosting/database/API quotas बदल सकते हैं; 24/7 scheduled jobs की मुफ्त गारंटी नहीं है।

## Production से पहले
- OAuth tokens server-side encrypted storage में रखें; logs में tokens न लिखें।
- Admin role केवल server/database से verify करें; सभी writes पर RLS लागू करें।
- Upload/media hosting, retries, duplicate prevention, rate limits, consent, privacy policy और audit logs जोड़ें।
- Publish endpoint में idempotency key और platform response validation लागू करें।
