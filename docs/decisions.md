# Groww Pulse — Engineering Decisions

This document outlines the architectural and product decisions made to address the core challenges of building a "Smart Market Watchlist."

## 1. What counts as a "meaningful change"?
Instead of relying on simple percentage thresholds, we implemented **Deterministic Statistical Detection**. 
* **Volume Anomalies:** We compare current volume against a moving average. A 5% price drop on 10x volume is highly meaningful; a 5% drop on 0.1x volume is noise.
* **52-Week Boundaries:** Approaching or breaking 52-week highs/lows triggers high attention.
* **Goal Context:** A change is more "meaningful" if the stock is linked to a user's high-priority financial goal (e.g., "House Downpayment").

*Why not AI/ML?* We deliberately avoided black-box AI models. Users need to trust their financial tools, which requires explainability. Our Attention Score (0-100) provides an exact, human-readable breakdown of why a stock was flagged.

## 2. How state persists across sessions/devices
We moved the "last seen" state from local device storage to the **Server (PostgreSQL)**. 
* **Implementation:** The `UserStockState` table tracks the exact price, volume, and timestamp a specific user last viewed a specific stock. 
* **Rationale:** If a user checks their watchlist on their phone on Monday, and then on their laptop on Thursday, the laptop should show what changed since *Monday*. LocalStorage would fail here. Server-side tracking guarantees a consistent "Since you last checked" experience.

## 3. How to handle stale, delayed, or conflicting data
* **Abstracted Providers:** We built a `MarketProvider` interface. If Yahoo Finance fails or returns conflicting data, we can seamlessly failover to another provider without changing core business logic.
* **Data Freshness Indicators:** The UI is designed to degrade gracefully. If market data is delayed (e.g., timestamp is > 15 mins old), the UI explicitly tags the data as "Delayed" or "Stale", rather than presenting old prices as current reality.

## 4. How the system scales for larger watchlists and more users
* **Decoupled Background Workers:** Fetching market data synchronously during an API request blocks the event loop and ruins UX. We introduced **Redis & BullMQ**. 
* **Implementation:** API requests simply read the latest snapshot from the DB/Cache. A separate fleet of background workers continuously fetches prices in batches and runs the change-detection engine asynchronously. 
* **Rationale:** This allows us to scale API web servers independently from market-data ingestion workers.

## 5. Where to keep things simple vs. add complexity
* **Added Complexity:** We added complexity in the **Change Detection Engine** and **Background Workers** because that is the core value proposition of the app.
* **Kept Simple:** We avoided Microservices. We built a **Modular Monolith**. At this scale, distributed systems add operational overhead (network latency, distributed tracing) without actual benefits. A well-structured monolith with clean boundaries allows us to move fast while maintaining the ability to extract services later if needed.
