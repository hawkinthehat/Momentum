# Momentum Garden

Momentum Garden is a lightweight, single-page app for low-energy recovery loops:

1. **Floating Anchor** - a 60-second guided breathing pulse.
2. **Smasher (Atomic Sequencer)** - splits a big task into 5 tiny moves.
3. **Worth Vault** - stores and rotates grounding truths.
4. **Presence Room** - logs "pulse" check-ins to friends.
5. **Garden** - tracks micro-wins and growth stage over a 7-day window.

Everything is stored in browser `localStorage`, so there is no backend required.

## Run locally

This project is static HTML/CSS/JS.

Open `index.html` directly in a browser, or run a tiny local server:

```bash
python3 -m http.server 5173
```

Then visit: `http://localhost:5173`

## Deploy (Replit / Vercel / Netlify)

Because this is a static app, deploy by pointing your platform at this repo root:

- **Build command:** none
- **Output directory:** `.`

## Tuning improvements applied

- Converted raw notes into a usable, mobile-friendly UI.
- Added interactive modules for all five Momentum stages.
- Added local persistence for truths, pulses, and micro-wins.
- Added growth scoring and stage progression for the garden.
- Hardened rendering with HTML escaping for user-entered content.

## Next good upgrades

- Add edit/delete controls for wins/truths/signals.
- Add export/import backup for local data.
- Split CSS/JS into separate files and add tests/linting.
- Add PWA manifest + service worker for offline home-screen install.
