export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleRequest(env));
  },
};

async function handleRequest(env) {
  const apiUrl = "https://api.nobitex.ir/v3/orderbook/";
  const symbols = [
    {
      symbol: "USDTIRT",
      title: "تتر",
      unit: "تومان",
      factor: 0.1,
      fixedPoint: 0,
    },
    {
      symbol: "BTCUSDT",
      title: "بیتکوین",
      unit: "دلار",
      factor: 1,
      fixedPoint: 0,
    },
    {
      symbol: "ETHUSDT",
      title: "اتریوم",
      unit: "دلار",
      factor: 1,
      fixedPoint: 0,
    },
    {
      symbol: "XRPUSDT",
      title: "ریپل",
      unit: "دلار",
      factor: 1,
      fixedPoint: 3,
    },
    {
      symbol: "SOLUSDT",
      title: "سولانا",
      unit: "دلار",
      factor: 1,
      fixedPoint: 3,
    },
    {
      symbol: "BNBUSDT",
      title: "بی ان بی",
      unit: "دلار",
      factor: 1,
      fixedPoint: 3,
    },
    {
      symbol: "ADAUSDT",
      title: "کاردانو",
      unit: "دلار",
      factor: 1,
      fixedPoint: 4,
    },
    { symbol: "TONUSDT", title: "تون", unit: "دلار", factor: 1, fixedPoint: 3 },
  ];

  const tgBotToken = "Your Bot Token";
  const tgChannelList = [
    "Your first channel id or address",
    "Your second channel id or address",
  ];

  const fetchPrice = async (symbol) => {
    const url = `${apiUrl}${symbol}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch price for ${symbol}`);
      }
      const data = await response.json();
      if (data.status === "ok" && data.lastTradePrice) {
        return parseFloat(data.lastTradePrice);
      }
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
    }
    return null;
  };

  const sendToTelegram = async (channel, messages) => {
    const tgApiUrl = `https://api.telegram.org/bot${tgBotToken}/sendMessage`;
    const body = {
      chat_id: channel,
      text: messages.join("\n"),
    };

    try {
      const response = await fetch(tgApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error(
          `Failed to send message to Telegram channel ${channel}:`,
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error sending message to Telegram:", error);
    }
  };

  const savePriceToKV = async (key, price) => {
    await env.priceKV.put(key, price.toString());
  };

  const getLastPriceFromKV = async (key) => {
    const lastPrice = await env.priceKV.get(key);
    return lastPrice ? parseFloat(lastPrice) : null;
  };

  // Function to get the current date in "Jan 26 2025" format
  const getCurrentSimpleDate = () => {
    const now = new Date(); // Get current date
    return now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  // Add the simple date to the first message
  const simpleDate = getCurrentSimpleDate();
  const messages = [`📊 قیمت رمزارزها در تاریخ  ${simpleDate}`];

  for (const { symbol, title, unit, factor, fixedPoint } of symbols) {
    const price = await fetchPrice(symbol);
    if (price !== null) {
      const adjustedPrice = (price * factor).toFixed(fixedPoint);

      // Retrieve the last posted price from KV
      const lastPrice = await getLastPriceFromKV(symbol);
      let trendIcon = "⚪"; // Default to white
      let priceChangeText = "";

      if (lastPrice !== null) {
        if (price > lastPrice) trendIcon = "🟢"; // Higher price
        else if (price < lastPrice) trendIcon = "🔴"; // Lower price

        // const priceChange = ((price - lastPrice) / lastPrice) * 100;
        // priceChangeText = ` (${priceChange.toFixed(2)}%)`; // Price change percentage

        const priceChange = (price - lastPrice) * factor;
        priceChangeText = ` (${priceChange.toFixed(fixedPoint)} ${unit})`; // Price change percentage
      }

      // Save the current price to KV
      await savePriceToKV(symbol, price);

      // Format price with thousands separator

      const formattedPrice = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: fixedPoint, // Ensure consistent decimal places
      }).format(adjustedPrice);

      // messages.push(`${title}: ${formattedPrice} ${unit}`);
      messages.push(
        `${trendIcon} ${title}: ${formattedPrice} ${unit}${priceChangeText}`
      );
    }
  }

  // Send messages to all Telegram channels
  for (const channel of tgChannelList) {
    await sendToTelegram(channel, messages);
  }
}
