# slop-sniffer-discord

A Discord bot that monitors server messages and reports likely AI-generated content to a designated channel for moderator review.

## How it works

The bot listens to every message posted in the server. When a message trips one of the detection heuristics, it sends a report embed to a channel you configure. No action is taken on the original message — reporting only.

### Heuristics

- **Contrast Framing (Inline):** Negation clause followed by an em dash or similar dash (e.g. *"It's not hard — it's just unfamiliar."*)
- **Contrast Framing (Sequential):** Negation across two consecutive sentences (e.g. *"Not because X. Because Y."* or *"This isn't X. It's Y."*)
- **Negative Tricolon:** Three consecutive sentences beginning with "No" or "Not", optionally resolving to "Just"

---

## Setup

### 1. Create a report channel

Create a private channel visible only to moderators and admins (e.g. `#slop-reports`). This is where SlopSniffer will post flagged message reports.

### 2. Grant channel access (if needed)

By default SlopSniffer monitors every channel it can see. If any of your channels have locked permissions, you'll need to add the SlopSniffer role explicitly:

1. Right-click the channel → **Edit Channel** → **Permissions**
2. Click **+** and add the **SlopSniffer** role
3. Grant it **View Channel** and **Read Message History**

Repeat for each locked channel you want monitored. Also add the role to your report channel with **View Channel**, **Send Messages**, and **Embed Links**.

### 3. Set environment variables

Set the following environment variables wherever you host the bot:

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Your bot's token from the Discord Developer Portal |
| `REPORT_CHANNEL_ID` | The ID of the channel where reports should be sent |

To get a channel ID in Discord: right-click the channel → **Copy Channel ID** (requires Developer Mode to be enabled in Discord settings).

---

## Privacy

SlopSniffer stores only your server ID and report channel ID. No message content or personal data is ever stored. [Full privacy policy.](https://gist.github.com/swisnieski85/06c9220854c1e877f9c71274a4d26ef5)

---

## License

[MIT](LICENSE)

## Author

Sean Wisnieski
