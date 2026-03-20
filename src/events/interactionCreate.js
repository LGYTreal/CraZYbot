const { Collection } = require('discord.js');

// =============================================
//   Event: interactionCreate — Slash Commands
// =============================================

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    // Cooldown handling
    if (!client.cooldowns.has(command.data.name)) {
      client.cooldowns.set(command.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expireTime = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expireTime) {
        const remaining = ((expireTime - now) / 1000).toFixed(1);
        return interaction.reply({
          content: `⏳ Slow down! Wait **${remaining}s** before using \`/${command.data.name}\` again.`,
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ Error in /${command.data.name}:`, error);
      const msg = { content: '💥 Something exploded! The bot is *too crazy* for that command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  },
};
