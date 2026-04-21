# Changelog

All notable changes to slop-sniffer-discord will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and adheres to [Semantic Versioning](https://semver.org/).

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