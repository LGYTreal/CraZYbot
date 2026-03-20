// =============================================
//   Event: messageCreate — Prefix Commands
// =============================================

const PREFIX = '!';

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.executePrefix(message, args, client);
    } catch (error) {
      console.error(`❌ Error in prefix command ${commandName}:`, error);
      message.reply('💥 Something exploded! The bot is *too crazy* for that command.');
    }
  },
};
