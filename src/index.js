require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');

// =============================================
//   CraZYbot — Main Entry Point 🎉
// =============================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildWebhooks,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// Collections for slash commands and prefix commands
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.cooldowns = new Collection();

// ── Load all commands ──────────────────────────────────────────────────────
const commandFolders = ['fun', 'moderation', 'utility'];
for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, 'commands', folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(folderPath, file));
    if (command.data) {
      client.slashCommands.set(command.data.name, command);
    }
    if (command.aliases) {
      for (const alias of command.aliases) {
        client.prefixCommands.set(alias, command);
      }
    }
    if (command.name) {
      client.prefixCommands.set(command.name, command);
    }
  }
}

// ── Load all events ────────────────────────────────────────────────────────
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ── Login first, then start HTTP keepalive ─────────────────────────────────
client.login(process.env.DISCORD_TOKEN).then(() => {
  const server = http.createServer((req, res) => res.end('CraZYbot is running! 🎉'));
  server.listen(3000, () => {
    console.log('🌐 HTTP keepalive server listening on port 3000');
  });

  // Self-ping every 4 minutes to prevent Leapcell from sleeping
  setInterval(() => {
    http.get('http://127.0.0.1:3000', (res) => {
      console.log('💓 Keepalive ping sent');
    }).on('error', () => {});
  }, 4 * 60 * 1000);

}).catch(err => {
  console.error('❌ Failed to login:', err);
  process.exit(1);
});
