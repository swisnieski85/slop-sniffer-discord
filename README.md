# slop-sniffer-discord

A Discord bot that monitors server messages and reports likely AI-generated content to a designated channel for moderator review.

## How it works

The bot listens to every message posted in the server. When a message trips one of the detection heuristics, it sends a report embed to a channel you configure. No action is taken on the original message — reporting only.

### Heuristics

- **Contrast Framing (Inline):** Negation clause followed by an em dash or similar dash (e.g. *"It's not hard — it's just unfamiliar."*)
- **Contrast Framing (Sequential):** Negation across two consecutive sentences (e.g. *"Not because X. Because Y."* or *"I'm not X. I'm Y."*)
- **Negative Tricolon:** Three consecutive sentences beginning with "No" or "Not", optionally resolving to "Just"

---

## Adding SlopSniffer to your server

### 1. Invite the bot

Use the invite link provided by the bot's listing page. When prompted, grant these permissions:

- View Channels
- Read Message History
- Send Messages
- Embed Links

### 2. Create a report channel

Create a private channel visible only to moderators and admins (e.g. `#slop-reports`). This is where SlopSniffer will post flagged message reports.

### 3. Grant channel access (if needed)

By default SlopSniffer monitors every channel it can see. If any of your channels have locked permissions, you'll need to add the SlopSniffer role explicitly:

1. Right-click the channel → **Edit Channel** → **Permissions**
2. Click **+** and add the **SlopSniffer** role
3. Grant it **View Channel** and **Read Message History**

Repeat for each locked channel you want monitored. Also add the role to your report channel with **View Channel**, **Send Messages**, and **Embed Links**.

### 4. Configure the report channel

In any channel, run (requires **Manage Server** permission):

```
/setup channel:#slop-reports
```

SlopSniffer will confirm and immediately begin reporting flagged messages.

---

## Slash commands

| Command | Permission required | Description |
|---|---|---|
| `/setup channel:#channel` | Manage Server | Set the channel where reports are sent |
| `/status` | Manage Server | Show the current report channel |
| `/disable` | Manage Server | Stop reporting for this server |

---

## License

[MIT](LICENSE)

## Author

Sean Wisnieski
