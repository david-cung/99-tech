## 1. Why Redis Sorted Sets?
We chose Redis `ZSET` over SQL `ORDER BY` for the following reasons:
*   **Time Complexity:** Redis `ZINCRBY` is O(log(N)) and `ZREVRANGE` is O(log(N) + M). SQL sorting on a table with millions of rows is O(N log N) without heavy indexing, and extremely expensive on CPU during write-heavy loads.
*   **Throughput:** Redis handles in-memory operations allowing for 100k+ OPS, essential for a viral feature.

## 2. Data Consistency Strategy
We acknowledge a potential race condition between the Cache (Redis) and the Permanent Store (DB).
*   **Decision:** We accept **Eventual Consistency**.
*   **Rationale:** In a gaming context, it is acceptable if the "History Page" (SQL) lags behind the "Live Leaderboard" (Redis) by a few seconds.
*   **Safety Net:** A cron job will run nightly to reconcile Redis scores with the SQL audit log to ensure long-term accuracy.

## 3. The "Thundering Herd" Problem in WebSockets
Broadcasting to all connected clients (e.g., 50,000 users) for every single score update is a common pitfall.
*   **Solution:** We implement a **Debounce/Throttle** mechanism at the Application Layer.
*   **Logic:** The broadcaster loop ticks every 500ms. It checks `if (currentState != lastBroadcastState) -> emit()`. This creates a predictable upper bound on network traffic regardless of input volume.

## 4. Security Considerations
Trusting the client is the root cause of most scoreboard hacks.
*   **Enhancement:** We mandate an HMAC signature flow. The `X-Action-Signature` header ensures that parameters like `score_delta` have not been tampered with by tools like Postman or Charles Proxy between the client and server.