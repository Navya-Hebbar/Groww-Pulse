# Groww Pulse — Demo Script

> **Goal:** Showcase how Groww Pulse solves the "information overload" problem by highlighting meaningful changes instead of raw prices.

### Preparation Before Demo
1. Ensure `docker-compose up --build` is running.
2. Ensure `DEMO_MODE=true` is set in your `docker-compose.yml` (this ensures predictable price movements and mock news events for Reliance/TCS).
3. Open a clean browser window at `http://localhost:5173`.

---

## 🎬 Act 1: The Problem (Information Overload)
**"Welcome to Groww Pulse. Let me show you why we built this."**
1. Open the app and create a new account.
2. Go to your **Watchlist** and add 4-5 common stocks (e.g., `RELIANCE`, `TCS`, `INFY`, `HDFCBANK`).
3. Point out that initially, this looks like any other watchlist—you see current prices.
4. Explain: *"But what happens when I close this app and come back 3 days later? Do I have to remember all these prices to know what happened?"*

## 🎬 Act 2: The Core Feature ("Since You Last Checked")
**"Groww Pulse remembers your last state, so you don't have to."**
1. Wait a few seconds for the background worker to fetch new mock data (prices will fluctuate).
2. Hit "Refresh" or wait for the automatic UI update.
3. Show the **"What Changed"** column.
   * **Talking Point:** *"Notice how Pulse instantly highlights the delta from the exact moment I last viewed the app, not just the generic 'daily change' that other apps show."*

## 🎬 Act 3: Attention Scoring & Signals
**"Not all changes are equal. We separate noise from signal."**
1. Navigate to the **Pulse Dashboard** (or highlight the Attention Score column).
2. Point out a stock with a high **Attention Score** (0-100).
3. Click on the score to reveal the **Explanation/Breakdown**.
   * Show that a stock isn't flagged just because it moved 1%, but because of a **Volume Anomaly**, a **52-Week High**, or breaking news (Mock Mode generates news for `RELIANCE`/`TCS`).
   * **Talking Point:** *"We use deterministic statistical analysis to explain exactly WHY a stock needs your attention right now."*

## 🎬 Act 4: Personalization (Goals)
**"A 5% drop in a random stock is noise. A 5% drop in a stock meant for my house downpayment is an emergency."**
1. Go to the **Goals** section. Create a goal: "House Downpayment".
2. Link `HDFCBANK` to this goal.
3. Show how the Attention Score for `HDFCBANK` gets an artificial boost because it's tied to a high-priority user goal.
   * **Talking Point:** *"Groww Pulse understands your context. We surface changes based on your actual financial priorities, not just market mechanics."*

## 🎬 Act 5: The Wrap-up
1. Demonstrate adding a **Custom Alert** (e.g., "Alert me if Attention Score > 80").
2. Conclude: *"Groww Pulse doesn't show you more data—it reduces the data you have to process. You know what changed, and you know what matters."*
