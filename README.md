# Siva Madheswaran, Portfolio

A single-page React portfolio, dark mode, purple/violet accent, with a live
metrics dashboard, 10 project case studies, a command palette, an
"Ask about Siva" chatbot, and a real client-side wafer-defect classifier
demo.

## What's in this project

```
siva-portfolio/
├── src/
│   ├── App.jsx          the whole site (one component file)
│   └── main.jsx         React entry point
├── netlify/functions/
│   └── chat.js          serverless function powering the chatbot
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml         Netlify build + function config
├── .env.example
└── .gitignore
```

Two pieces work differently after deployment:

- **Live Demo (wafer classifier)**: pure client-side JavaScript, real
  trained model weights embedded in the code. Works immediately, no
  backend, no API key, no setup.
- **Chatbot ("Ask about Siva")**: needs the `netlify/functions/chat.js`
  serverless function plus your own Anthropic API key, set as an
  environment variable in Netlify. Covered in Step 5 below.

---

## Step-by-step deployment (Netlify)

### 1. Install Node.js, if you don't have it

Download the LTS version from [nodejs.org](https://nodejs.org). This gets
you `node` and `npm`, which you need to build the site locally.

Check it worked:
```bash
node -v
npm -v
```

### 2. Install dependencies and test locally

From inside this project folder:
```bash
npm install
npm run dev
```
This starts a local dev server, usually at `http://localhost:5173`. Open
that URL and confirm the site looks right. Note: the chatbot won't work
yet locally unless you also run `netlify dev` with your API key set (see
Step 5), but everything else, including the wafer classifier, will.

### 3. Put this project on GitHub

If you don't already have a GitHub account, create one at
[github.com](https://github.com). Then, from inside this folder:
```bash
git init
git add .
git commit -m "Initial portfolio"
```
Create a new empty repository on GitHub (click the "+" in the top right
→ "New repository"), don't initialize it with a README since you already
have one. Then:
```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### 4. Connect the repo to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign up or log in
   (you can sign up directly with your GitHub account, which makes this
   step faster).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize Netlify to access your repositories, and
   select the repo you just pushed.
4. Netlify should auto-detect the build settings from `netlify.toml`
   (build command `npm run build`, publish directory `dist`). If it
   doesn't autofill, enter those manually.
5. Click **Deploy site**. Netlify will install dependencies, build, and
   give you a live URL like `random-name-123.netlify.app` within a
   minute or two.

At this point your site is live. The wafer classifier demo will already
work. The chatbot won't, yet, that needs Step 5.

### 5. Set up the chatbot's API key

1. Get an Anthropic API key from
   [console.anthropic.com](https://console.anthropic.com) if you don't
   have one (Settings → API Keys → Create Key).
2. In your Netlify site dashboard, go to **Site configuration →
   Environment variables → Add a variable**.
3. Key: `ANTHROPIC_API_KEY`, Value: your actual key. Save.
4. Go to **Deploys** and trigger **Trigger deploy → Deploy site** so the
   function picks up the new environment variable.

The chatbot should now work on your live site. It calls
`/.netlify/functions/chat`, which Netlify automatically deploys from
`netlify/functions/chat.js`, no extra configuration needed beyond the
environment variable.

### 6. (Optional) Add a custom domain

1. In your Netlify site dashboard: **Domain management → Add a domain**.
2. If you already own a domain (from Namecheap, Google Domains, etc.),
   follow Netlify's instructions to point its DNS at Netlify, either by
   changing nameservers or adding the specific records Netlify shows you.
3. If you don't have a domain yet, buy one first (roughly $10-15/year for
   a `.com`), then come back to this step.
4. Netlify issues a free SSL certificate automatically once DNS is
   pointed correctly, usually within a few minutes to an hour.

### 7. Every future update

Once connected, deployment is automatic:
```bash
git add .
git commit -m "Update project details"
git push
```
Netlify rebuilds and redeploys within a minute or two of every push to
your main branch, no manual redeploy needed.

---

## Local development with the chatbot working

To test the chatbot locally before deploying, install the Netlify CLI and
use `netlify dev` instead of `npm run dev`:
```bash
npm install -g netlify-cli
netlify login
netlify dev
```
Make sure you have a `.env` file (copy `.env.example` and fill in your
real key) in the project root, `netlify dev` reads it automatically for
local function testing.

## Troubleshooting

- **Chatbot returns an error**: double check `ANTHROPIC_API_KEY` is set
  correctly in Netlify's environment variables, and that you redeployed
  after adding it.
- **Build fails on Netlify**: check the deploy log under the **Deploys**
  tab, it's almost always a missing dependency, run `npm install` and
  commit the updated `package-lock.json` if one gets generated locally.
- **Resume download or headshot missing**: these are embedded directly
  in `App.jsx` as base64 data, so they should always work without any
  extra hosting setup.
