const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// =============================================
//   Command: ban — Ban a member 🔨
// =============================================

module.exports = {
  name: 'ban',
  aliases: ['ban'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🔨 Ban a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt =>
      opt.setName('target').setDescription('Who to ban').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the ban').setRequired(false)
    )
    .addIntegerOption(opt =>
      opt.setName('days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ You need **Ban Members** permission!', ephemeral: true });
    }

    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const days = interaction.options.getInteger('days') ?? 0;

    if (!target) return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: "❌ You can't ban yourself!", ephemeral: true });
    if (!target.bannable) return interaction.reply({ content: "❌ I can't ban that user — they may have a higher role than me.", ephemeral: true });

    try {
      await target.send(`🔨 You have been **banned** from **${interaction.guild.name}**.\n**Reason:** ${reason}`).catch(() => {});
      await target.ban({ deleteMessageDays: days, reason });

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🔨 Member Banned')
        .addFields(
          { name: 'User', value: `${target.user.tag} (${target.id})` },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: interaction.user.tag },
          { name: 'Messages Deleted', value: `${days} day(s)` },
        )
        .setThumbnail(target.user.displayAvatarURL())
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Ban error:', err);
      await interaction.editReply({ content });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply('❌ You need **Ban Members** permission!');
    }

    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No reason provided';

    if (!target) return message.reply('Usage: `!ban @user [reason]`');
    if (target.id === message.author.id) return message.reply("❌ You can't ban yourself!");
    if (!target.bannable) return message.reply("❌ I can't ban that user.");

    try {
      await target.send(`🔨 You have been **banned** from **${message.guild.name}**.\n**Reason:** ${reason}`).catch(() => {});
      await target.ban({ reason });

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🔨 Member Banned')
        .addFields(
          { name: 'User', value: `${target.user.tag}` },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: message.author.tag },
        )
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.reply('❌ Failed to ban that user.');
    }
  },
};
