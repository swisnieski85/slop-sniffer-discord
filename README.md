# slop-sniffer-discord

A Discord bot that monitors server messages and reports likely AI-generated content to a designated channel for moderator review.

## How it works

The bot listens to every message posted in the server. When a message trips one of the detection heuristics, it sends a report embed to a channel you configure. No action is taken on the original message — reporting only.

### Heuristics

- **Contrast Framing (Inline):** Negation clause followed by an em dash or similar dash (e.g. *"It's not hard — it's just unfamiliar."*)
- **Contrast Framing (Sequential):** Negation across two consecutive sentences (e.g. *"Not because X. Because Y."* or *"This isn't X. It's Y."*)
- **Negative Tricolon:** Three consecutive sentences beginning with "No" or "Not", optionally resolving to "Just"

---

## Self-hosting on Railway

SlopSniffer is designed to be self-hosted — each instance runs on your own Railway account and serves a single Discord server.

### 1. Create a Discord application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**
2. Name it (e.g. "SlopSniffer") and save
3. Go to **Bot** → click **Add Bot**
4. Under **Privileged Gateway Intents**, enable **Message Content Intent**
5. Copy your bot token — you'll need it later

### 2. Invite the bot to your server

1. In the Developer Portal, go to **OAuth2** → **URL Generator**
2. Under **Scopes**, select `bot`
3. Under **Bot Permissions**, select:
   - View Channels
   - Read Message History
   - Send Messages
   - Embed Links
4. Copy the generated URL, open it in your browser, and invite the bot to your server

### 3. Create a report channel

In Discord, create a private channel visible only to moderators and admins (e.g. `#slop-reports`). This is where SlopSniffer will post flagged message reports.

To get the channel ID: enable Developer Mode in Discord (User Settings → Advanced → Developer Mode), then right-click the channel → **Copy Channel ID**.

### 4. Grant channel access (if needed)

By default SlopSniffer monitors every channel it can see. If any channels have locked permissions, add the SlopSniffer role explicitly:

1. Right-click the channel → **Edit Channel** → **Permissions**
2. Click **+** and add the SlopSniffer role
3. Grant it **View Channel** and **Read Message History**

Repeat for each locked channel you want monitored. Also add the role to your report channel with **View Channel**, **Send Messages**, and **Embed Links**.

### 5. Deploy to Railway

1. Fork this repository
2. Create a new project at [railway.app](https://railway.app) and connect your forked repo
3. Under **Variables**, add:

| Variable | Value |
|---|---|
| `DISCORD_TOKEN` | Your bot token from Step 1 |
| `REPORT_CHANNEL_ID` | The channel ID from Step 3 |

Railway will deploy automatically. Check the deploy logs to confirm you see:

```
Logged in as <your bot name>
Reporting flagged messages to channel ID: <your channel id>
```

---

## Privacy

SlopSniffer does not store any data. No message content, user information, or server data is written to any database or external service. [Full privacy policy.](https://gist.github.com/swisnieski85/06c9220854c1e877f9c71274a4d26ef5)

---

## License

[MIT](LICENSE)

## Author

Sean Wisnieski
