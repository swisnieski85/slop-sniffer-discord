# slop-sniffer-discord

A Discord bot that monitors server messages and reports likely AI-generated content to a designated channel for moderator review.

## How it works

The bot listens to every message posted in the server. When a message trips one of the detection heuristics, it sends a report embed to a configured report channel. No action is taken on the original message — reporting only.

### Heuristics

- **Contrast Framing (Inline):** Negation clause followed by an em dash or similar dash (e.g. *"It's not hard — it's just unfamiliar."*)
- **Contrast Framing (Sequential):** Negation across two consecutive sentences (e.g. *"Not because X. Because Y."* or *"I'm not X. I'm Y."*)
- **Negative Tricolon:** Three consecutive sentences beginning with "No" or "Not", optionally resolving to "Just"

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```

3. Start the bot:
   ```
   npm start
   ```

## Environment variables

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Bot token from the Discord Developer Portal |
| `REPORT_CHANNEL_ID` | ID of the channel where flagged message reports will be sent |

## License

[MIT](LICENSE)

## Author

Sean Wisnieski
