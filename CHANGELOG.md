# Changelog

All notable changes to slop-sniffer-discord will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/).

## [1.1.4] - 2026-04-21
### Fixed
- Replaced deprecated `.tag` with `.username` on `message.author` and `client.user`; `.tag` was removed in discord.js v14.
- Wrapped `interactionCreate` handler in try/catch — DB errors now send the user an ephemeral error reply instead of producing an unhandled promise rejection.
- Wrapped `messageCreate` handler in try/catch — DB errors now log cleanly instead of potentially crashing the process.

## [1.1.3] - 2026-04-21
### Fixed
- Added missing `interactionCreate` handler.
- `messageCreate` now reads the report channel from the database per guild instead of the hardcoded `REPORT_CHANNEL_ID` environment variable, which was never wired up to the slash command config flow.
- `db.init()` is now called on `ready` so the `guild_configs` table is guaranteed to exist before any interaction or message arrives.
- Slash command replies are ephemeral so only the invoking moderator sees them.

## [1.1.2] - 2026-04-21
### Fixed
- `/setup`, `/status`, and `/disable` now call `deferReply()` before any database operations, preventing Discord's 3-second interaction timeout from producing "The application did not respond" errors.

## [1.1.1] - 2026-04-21
### Fixed
- `/status` now correctly requires Manage Server permission; previously any server member could invoke it.
- Replaced deprecated `message.author.tag` with `message.author.username` in report embeds.
- Added try/catch to `messageCreate` handler to prevent unhandled promise rejections on database errors.
- Fixed inconsistent indentation in `interactionCreate` try/catch block.
- Fixed `/setup` permission check using `guild.members.me` instead of `guild.members.cache.get()`, which could return undefined and silently swallow the interaction reply.

## [1.1.0] - 2026-04-21
### Added
- Per-server configuration via Railway's PostgreSQL: each server stores its own report channel, replacing the single hardcoded `REPORT_CHANNEL_ID` environment variable.
- Slash commands: `/setup channel:#channel` (set report channel), `/status` (show current config), `/disable` (turn off reporting). Setup and disable require Manage Server permission.
- `deploy-commands.js` registers slash commands with Discord on every startup.
- Bot validates it has Send Messages and Embed Links permissions in the target channel before accepting a `/setup` call.

## [1.0.0] - 2026-04-21
### Added
- Initial Discord bot implementation adapted from the slop-sniffer Chrome extension (https://github.com/swisnieski85/slop-sniffer).
- Monitors all server channels to which the Slop Sniffer role has access for incoming messages and runs them through the SlopSniffer detection engine.
- Sends a report embed to a configurable report channel when a heuristic fires, including author, source channel, heuristic name, message excerpt, and a jump link to the original message.
- Three detection heuristics carried over from v1.4.0 of the Chrome extension: Contrast Framing (Inline), Contrast Framing (Sequential), Negative Tricolon.