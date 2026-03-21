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
    console.log(`🚀 Deploying ${commands.length} slash commands globally...`);

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Successfully deployed globally! (May take up to 1 hour to appear in all servers)');
  } catch (error) {
    console.error('❌ Deployment failed:', error);
  }
})();
