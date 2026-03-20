require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// =============================================
//   CraZYbot — Slash Command Deployer 🚀
// =============================================

const commands = [];
const commandFolders = ['fun', 'moderation', 'utility'];

for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, 'commands', folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(folderPath, file));
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} slash commands...`);

    // Deploy to a specific guild for instant updates (use for development)
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`✅ Successfully deployed to guild ${process.env.GUILD_ID}!`);
    } else {
      // Global deploy (takes up to 1 hour to propagate)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log('✅ Successfully deployed globally!');
    }
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
})();
