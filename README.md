# 🤖 CraZYbot

> The wildest Discord bot ever made. Disco parties, colored text, impersonation, AI roasts, and full moderation — all in one.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A Discord account and a server where you have admin permissions

---

### 2. Create Your Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** → name it `CraZYbot`
3. Go to **Bot** tab → click **Add Bot**
4. Under **Privileged Gateway Intents**, enable ALL THREE:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Copy your **Bot Token** (keep it secret!)
6. Go to **OAuth2 → General** and copy your **Client ID**

---

### 3. Invite the Bot to Your Server

Use this URL (replace `YOUR_CLIENT_ID`):

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

> `permissions=8` is Administrator — reduces permission headaches during dev. Restrict later if you want.

---

### 4. Install & Configure

```bash
# Clone or open the project in VS Code
cd crazybot

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_server_id_here        # Right-click your server → Copy Server ID
ANTHROPIC_API_KEY=your_key_here     # Optional — only needed for /roast
```

---

### 5. Deploy Slash Commands

```bash
npm run deploy
```

This registers all `/slash` commands to your server. You only need to run this once (or whenever you add new commands).

---

### 6. Start the Bot!

```bash
# Normal start
npm start

# Development mode (auto-restarts on file changes)
npm run dev
```

You should see the ASCII art logo and `✅ Logged in as CraZYbot#XXXX` in your terminal.

---

## 🎮 Commands

### 🎉 Fun Commands

| Command | Prefix | Description |
|---------|--------|-------------|
| `/party` | `!party` | Start an animated 8-frame disco party! 🕺 |
| `/color <color> <text>` | `!color <color> <text>` | Send colored ANSI text (red, green, rainbow, etc.) |
| `/impersonate @user <msg>` | `!impersonate @user <msg>` | Send a message AS another member 😈 |
| `/8ball <question>` | `!8ball <question>` | Ask the Magic 8-Ball anything |
| `/meme [subreddit]` | `!meme` | Fetch a hot meme from Reddit |
| `/poll <question> <options>` | `!poll Q \| A \| B \| C` | Create a timed reaction poll |
| `/roast @user` | `!roast @user` | AI-generated roast powered by Claude 🔥 |
| `/coinflip` | `!coinflip` | Flip a coin |
| `/rps <choice>` | `!rps rock` | Rock Paper Scissors vs the bot |

### 🔨 Moderation Commands

| Command | Prefix | Permission Required |
|---------|--------|---------------------|
| `/ban @user [reason] [days]` | `!ban @user [reason]` | Ban Members |
| `/kick @user [reason]` | `!kick @user [reason]` | Kick Members |
| `/timeout @user <duration>` | `!timeout @user <dur> [reason]` | Moderate Members |
| `/warn add/list/clear @user` | `!warn add/list/clear @user` | Moderate Members |
| `/purge <amount> [@user]` | `!purge <amount>` | Manage Messages |
| `/slowmode <seconds>` | `!slowmode <seconds>` | Manage Channels |

**Timeout durations:** `60s`, `5m`, `10m`, `30m`, `1h`, `6h`, `12h`, `1d`, `1w`

### 🔧 Utility Commands

| Command | Prefix | Description |
|---------|--------|-------------|
| `/help` | `!help` | Show all commands |
| `/userinfo [@user]` | `!userinfo [@user]` | View user details |
| `/serverinfo` | `!serverinfo` | View server details |
| `/avatar [@user]` | `!avatar [@user]` | Get full-size avatar |
| `/ping` | `!ping` | Check bot latency |

---

## 🏗️ Project Structure

```
crazybot/
├── src/
│   ├── index.js              # Main entry point — loads commands & events
│   ├── deploy-commands.js    # Run once to register slash commands
│   ├── commands/
│   │   ├── fun/
│   │   │   ├── party.js      # Disco party animation
│   │   │   ├── color.js      # ANSI colored text
│   │   │   ├── impersonate.js# Webhook impersonation
│   │   │   ├── 8ball.js      # Magic 8-ball
│   │   │   ├── meme.js       # Reddit meme fetcher
│   │   │   ├── poll.js       # Reaction poll with auto-results
│   │   │   ├── roast.js      # AI roast via Anthropic API
│   │   │   ├── coinflip.js   # Coin flip
│   │   │   └── rps.js        # Rock Paper Scissors
│   │   ├── moderation/
│   │   │   ├── ban.js
│   │   │   ├── kick.js
│   │   │   ├── timeout.js
│   │   │   ├── warn.js       # Warnings saved to data/warnings.json
│   │   │   ├── purge.js
│   │   │   └── slowmode.js
│   │   └── utility/
│   │       ├── help.js
│   │       ├── userinfo.js
│   │       ├── serverinfo.js
│   │       ├── avatar.js
│   │       └── ping.js
│   ├── events/
│   │   ├── ready.js          # Bot ready + rotating status
│   │   ├── interactionCreate.js # Slash command handler + cooldowns
│   │   └── messageCreate.js  # Prefix command handler
│   └── utils/
│       └── helpers.js        # ANSI colors, webhook utils, sleep, etc.
├── data/
│   └── warnings.json         # Auto-created — persists member warnings
├── .env                      # Your secrets (DO NOT COMMIT)
├── .env.example              # Template for new installs
├── .gitignore
└── package.json
```

---

## 🧩 Adding New Commands

Every command file exports the same shape:

```js
module.exports = {
  name: 'mycommand',           // Used for prefix commands
  aliases: ['mycommand', 'mc'],// All prefix aliases
  cooldown: 5,                 // Cooldown in seconds (default: 3)

  data: new SlashCommandBuilder()  // Slash command definition
    .setName('mycommand')
    .setDescription('Does something cool'),

  async execute(interaction) {     // Slash command handler
    await interaction.reply('Hello!');
  },

  async executePrefix(message, args, client) {  // Prefix handler
    await message.reply('Hello!');
  },
};
```

Drop the file in `src/commands/fun/`, `moderation/`, or `utility/` and run `npm run deploy` to register the slash command.

---

## 🔑 Required Bot Permissions

| Permission | Used By |
|-----------|---------|
| Send Messages | All commands |
| Embed Links | Embeds |
| Manage Messages | `/purge` |
| Manage Webhooks | `/impersonate` |
| Ban Members | `/ban` |
| Kick Members | `/kick` |
| Moderate Members | `/timeout`, `/warn` |
| Manage Channels | `/slowmode` |
| Read Message History | `/purge` |

---

## 📦 Dependencies

- [`discord.js`](https://discord.js.org/) v14 — Discord API wrapper
- [`dotenv`](https://github.com/motdotla/dotenv) — Environment variable loading
- [`node-fetch`](https://github.com/node-fetch/node-fetch) v2 — HTTP requests (Reddit memes)

---

## 💡 Tips

- **Warnings** are saved to `data/warnings.json` — back this up if you care about history
- **Impersonation** requires the bot to have `Manage Webhooks` in the channel
- **Meme command** uses Reddit's public JSON API — no auth required unless you hit rate limits
- **AI Roast** requires an `ANTHROPIC_API_KEY` in your `.env`
- Run `npm run deploy` again any time you add or rename slash commands

---

*Built with ❤️ and CraZY energy by LifeguardYT*
