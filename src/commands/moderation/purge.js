const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// =============================================
//   Command: purge — Bulk delete messages 🗑️
// =============================================

module.exports = {
  name: 'purge',
  aliases: ['purge', 'clear', 'nuke'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('🗑️ Bulk delete messages in a channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt =>
      opt.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .addUserOption(opt =>
      opt.setName('target').setDescription('Only delete messages from this user (optional)')
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: '❌ You need **Manage Messages** permission!', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('target');

    await interaction.deferReply({ ephemeral: true });

    try {
      let messages = await interaction.channel.messages.fetch({ limit: 100 });

      if (targetUser) {
        messages = messages.filter(m => m.author.id === targetUser.id);
      }

      // Discord won't bulk-delete messages older than 14 days
      const deletable = messages.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000)
        .first(amount);

      const deleted = await interaction.channel.bulkDelete(deletable, true);

      await interaction.editReply({
        content: `🗑️ Deleted **${deleted.size}** message(s)${targetUser ? ` from ${targetUser.username}` : ''}.`,
      });
    } catch (err) {
      console.error('Purge error:', err);
      await interaction.editReply({ content: '❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.' });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply('❌ You need **Manage Messages** permission!');
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply('Usage: `!purge <1-100>` or `!purge <1-100> @user`');
    }

    const targetUser = message.mentions.users.first();

    try {
      await message.delete().catch(() => {});
      let messages = await message.channel.messages.fetch({ limit: 100 });

      if (targetUser) {
        messages = messages.filter(m => m.author.id === targetUser.id);
      }

      const deletable = messages.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000)
        .first(amount);

      const deleted = await message.channel.bulkDelete(deletable, true);

      const confirm = await message.channel.send(
        `🗑️ Deleted **${deleted.size}** message(s)${targetUser ? ` from ${targetUser.username}` : ''}.`
      );
      setTimeout(() => confirm.delete().catch(() => {}), 4000);
    } catch (err) {
      message.channel.send('❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.');
    }
  },
};
