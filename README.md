# Xavier — Discord Community Bot

[![CI](https://github.com/Bluetwinklez/Server-manage-discord-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/Bluetwinklez/Server-manage-discord-bot/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modular Discord.js v14 bot for moderation, community management, music, tickets, backups, and optional natural-language assistance. The existing commands and responses are designed for Turkish-speaking communities; this documentation is in English.

## Requirements

- **Node.js 22.12.0 or newer**; CI uses Node 24. The voice dependency requires this minimum, so Node 18/20 are insufficient.
- A Discord application and bot token from the [Developer Portal](https://discord.com/developers/applications).
- Appropriate guild permissions and gateway intents for the features you enable.
- Network access for Discord and optional music, speech, or AI providers.

## Setup

```bash
git clone https://github.com/Bluetwinklez/Server-manage-discord-bot.git
cd Server-manage-discord-bot
npm ci
npm run setup
npm run deploy
npm start
```

The setup wizard writes `.env`. Alternatively, copy `.env.example` to `.env`, then set `DISCORD_TOKEN` and `CLIENT_ID`. Set `GUILD_ID` for quick registration in one development server; omit it for global command registration. Invite the bot using the `bot` and `applications.commands` scopes. Enable the privileged intents required by your selected features in the Developer Portal. Grant only the permissions those features need.

`npm run deploy` registers slash commands; `npm start` connects the bot. Repeat deployment after changing command definitions. Never publish `.env`, bot tokens, provider keys, or runtime databases.

## Features

| Area | Capabilities |
|---|---|
| Moderation | Bans, kicks, timeouts, warnings, audit logs, anti-spam and raid protection |
| Community | Welcome/registration, roles, XP, economy, giveaways, tickets and polls |
| Server setup | Templates, channel/role organization and structural backups |
| Voice | Music queues, radio, speech synthesis and optional speech recognition |
| Optional AI | Natural-language tools, configurable personalities and provider fallback |

AI provider keys are optional for the core Discord functionality. Configure only the providers you intend to use; see `.env.example`. The local OpenClaw gateway is optional. Fish Audio is optional; speech synthesis has fallback providers. Voice and media availability depend on upstream services and FFmpeg installation, including the binary installed by `ffmpeg-static` during `npm ci`.

Unreadable JSON data is copied to a `.corrupt-<id>` recovery file before fallback values are used. If preservation fails, the read fails instead of silently losing the original. Back up the runtime data directory independently.

## Development and troubleshooting

```bash
npm test
node --check index.js
node --check deploy-commands.js
```

CI checks JavaScript syntax and runs the automated suite. Tests do not prove live Discord permissions, voice playback, or third-party API availability.

- Missing slash commands: check the application/client ID, invite scopes, and command deployment target.
- Rejected gateway intent: enable the required intent in the Developer Portal or disable the dependent feature.
- Voice failure: confirm Node meets the minimum and FFmpeg installed successfully; inspect the upstream source's availability.
- AI unavailable: check the configured provider credentials and limits without printing secrets into logs.

See [the detailed command and architecture guide (Turkish)](README.tr.md), [contributing](CONTRIBUTING.md), [security](SECURITY.md), and the [MIT license](LICENSE).
