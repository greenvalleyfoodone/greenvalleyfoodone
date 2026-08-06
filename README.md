# Green Valley — Website

React + Vite + Tailwind CSS v4 site for Green Valley (cafe & restaurant, Santhamaguluru).

## Pages
Home, Cafe, Restaurant, Menu, Gallery, About, Contact, Reservation — all in `src/pages/`.

## Run locally
```bash
npm install
npm run dev
```
Opens at http://localhost:5173

## What still needs your input
- **Images**: replace the placeholder files in `public/images/` with real photos (same filenames, or update the `src` paths in the page files).
- **Menu items & prices**: edit the arrays at the top of `src/pages/Cafe.jsx`, `Restaurant.jsx`, and `Menu.jsx`.
- **Reservation form**: currently only confirms in the UI. Before launch, connect it to a real backend — easiest options:
  - [Formspree](https://formspree.io) — free, just point the form action at your Formspree endpoint
  - [EmailJS](https://www.emailjs.com) — sends form submissions straight to your email
  - A phone number tel: link is already in place as a fallback in the footer.
- **Google Maps embed** in `Contact.jsx` — currently a basic query embed; for a pinned exact location, get an embed URL from Google Maps → Share → Embed a map.

## Deploy (Day 7–8 of your plan)

### 1. Buy a domain
Namecheap or GoDaddy — a `.com` or `.in` runs about ₹800–1500/year.

### 2. Push this project to GitHub
```bash
git init
git add .
git commit -m "Green Valley website"
gh repo create green-valley --public --source=. --push
```
(Or create a repo on github.com and follow its push instructions.)

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com), sign up with GitHub.
2. Click **New Project** → import your `green-valley` repo.
3. Framework preset: Vite (auto-detected). Click **Deploy**.
4. You'll get a live URL like `green-valley.vercel.app` in ~1 minute.

### 4. Connect your domain
1. In the Vercel project → **Settings → Domains** → add your domain.
2. Vercel gives you DNS records (usually an A record + CNAME).
3. Add those records in your domain registrar's DNS settings (Namecheap/GoDaddy → Manage DNS).
4. Propagation takes anywhere from a few minutes to 24 hours.

That's it — no server to manage, and every future `git push` auto-deploys.

## Tech
- React 18 + React Router
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Fonts: Fraunces (display), Work Sans (body), IBM Plex Mono (labels/prices)
