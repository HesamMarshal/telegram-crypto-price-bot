# Nobitex Price Tracker Bot

## 📌 Overview

This project is a **Cloudflare Worker** that fetches real-time cryptocurrency prices from [Nobitex API](https://api.nobitex.ir/) and sends them to multiple **Telegram channels**.

## 🚀 Features

- Fetches the **latest cryptocurrency prices** from Nobitex.
- Supports multiple **trading pairs** (e.g., USDT/IRT, BTC/USDT, ETH/USDT).
- Sends formatted price updates to multiple **Telegram channels**.
- **Data persistence** via Cloudflare KV store to track price changes.
- Uses **colored icons** (🔼🔽⏺️) to indicate price movements.
- **Formatted numbers** with factor-based adjustments.
- Includes the **current date** in messages (e.g., `Jan 26 2025`).

## 🛠️ Installation & Setup

### 1️⃣ Prerequisites

- A **Cloudflare Workers** account
- Access to **Cloudflare KV store**
- A **Telegram Bot** (Get one via [@BotFather](https://t.me/BotFather))

### 2️⃣ Clone the Repository

```bash
 git clone https://github.com/yourusername/nobitex-telegram-bot.git
 cd nobitex-telegram-bot
```

### 3️⃣ Configure Environment Variables

Update `wrangler.toml` with your credentials:

```toml
name = "nobitex-tracker"
type = "javascript"
workers_dev = true

[[kv_namespaces]]
binding = "priceKV"
id = "your_kv_namespace_id"
preview_id = "your_preview_id"
```

### 4️⃣ Deploy to Cloudflare Workers

```bash
wrangler publish
```

## 🔧 How It Works

### 1️⃣ Fetching Prices

- Calls `https://api.nobitex.ir/v3/orderbook/{symbol}` for each trading pair.
- Extracts the **last trade price** and adjusts it based on predefined **factors**.

### 2️⃣ Storing & Comparing Prices

- Saves the latest price to **Cloudflare KV store**.
- Compares with the last stored price to determine **price movement**.

### 3️⃣ Sending Messages to Telegram

- Formats messages with:
  - Price updates
  - Movement icons (🔼🔽⏺️)
  - Date stamp (e.g., `Jan 26 2025`)
- Sends updates to multiple Telegram channels using `sendMessage` API.

## 📋 Example Telegram Output

```
📊 قیمت رمزارزها در تاریخ Jan 26 2025
🔼 بیتکوین: 42,350 دلار (+200 دلار)
⏺️ تتر: 83,780 تومان (0 تومان)
🔽 اتریوم: 3,000 دلار (-50 دلار)
```

## 🚀 Future Improvements

- ✅ **Add Price Alerts** (e.g., notify if price changes by >5%)
- ✅ **Historical Price Tracking** (store last N prices in KV store)
- ✅ **More Telegram Formatting** (bold, italics, inline buttons)
- ✅ **Admin Panel for Symbol Management**
- ✅ **Multi-Language Support**

---

### 👨‍💻 Author

- **Your Name**
- Telegram: [@YourHandle](https://t.me/YourHandle)
- GitHub: [Your GitHub](https://github.com/yourusername)

📌 _Feel free to contribute by submitting a pull request!_ 🚀
