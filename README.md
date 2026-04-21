# slop-sniffer-discord

A Discord bot that monitors server messages and reports likely AI-generated content to a designated channel for moderator review.

## How it works

The bot listens to every message posted in the server. When a message trips one of the detection heuristics, it sends a report embed to a channel you configure. No action is taken on the original message — reporting only.

### Heuristics

- **Contrast Framing (Inline):** Negation clause followed by an em dash or similar dash (e.g. *"It's not hard — it's just unfamiliar."*)
- **Contrast Framing (Sequential):** Negation across two consecutive sentences (e.g. *"Not because X. Because Y."* or *"I'm not X. I'm Y."*)
- **Negative Tricolon:** Three consecutive sentences beginning with "No" or "Not", optionally resolving to "Just"

---

## Setup (self-hosting)

### Prerequisites

- [Node.js](https://nodejs.org) (LTS)
- A PostgreSQL database (see [Railway](https://railway.app) for easy hosting)
- A Discord bot token (see below)

### 1. Create a Discord application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Under **Bot**, click **Add Bot**. Copy the token — this is your `DISCORD_TOKEN`.
3. On the same page, copy the **Application ID** from the General Information tab — this is your `CLIENT_ID`.
4. Under **Privileged Gateway Intents**, enable **Message Content Intent**.

### 2. Invite the bot to your server

In the Developer Portal, go to **OAuth2 → URL Generator**. Select the `bot` scope and grant these permissions:

- View Channels
- Read Message History
- Send Messages
- Embed Links

Open the generated URL in your browser and select your server.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
DATABASE_URL=your_postgresql_connection_string
```

### 4. Install and run

```bash
npm install
npm start
```

This registers the bot's slash commands with Discord and starts the bot. You should see `Logged in as ...` in the terminal.

### 5. Configure a report channel in Discord

Once the bot is online, run this slash command in your server (requires **Manage Server** permission):

```
/setup channel:#your-report-channel
```

The bot will confirm and begin reporting flagged messages to that channel.

---

## Slash commands

| Command | Permission required | Description |
|---|---|---|
| `/setup channel:#channel` | Manage Server | Set the channel where reports are sent |
| `/status` | Anyone | Show the current report channel |
| `/disable` | Manage Server | Stop reporting for this server |

---

## Environment variables

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Bot token from the Discord Developer Portal |
| `CLIENT_ID` | Application ID from the Discord Developer Portal |
| `DATABASE_URL` | PostgreSQL connection string |

---

## License

[MIT](LICENSE)

## Author

Sean Wisnieski
