const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// =============================================
//   Command: kick — Kick a member 👢
// =============================================

module.exports = {
  name: 'kick',
  aliases: ['kick'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Kick a member from the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt =>
      opt.setName('target').setDescription('Who to kick').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the kick').setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: '❌ You need **Kick Members** permission!', ephemeral: true });
    }

    const target = interaction.options.getMember('target');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ content: "❌ You can't kick yourself!", ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: "❌ I can't kick that user.", ephemeral: true });

    try {
      await target.send(`👢 You have been **kicked** from **${interaction.guild.name}**.\n**Reason:** ${reason}`).catch(() => {});
      await target.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(0xFF8C00)
        .setTitle('👢 Member Kicked')
        .addFields(
          { name: 'User', value: `${target.user.tag} (${target.id})` },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: interaction.user.tag },
        )
        .setThumbnail(target.user.displayAvatarURL())
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ Failed to kick that user.', ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply('❌ You need **Kick Members** permission!');
    }

    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No reason provided';

    if (!target) return message.reply('Usage: `!kick @user [reason]`');
    if (target.id === message.author.id) return message.reply("❌ You can't kick yourself!");
    if (!target.kickable) return message.reply("❌ I can't kick that user.");

    try {
      await target.send(`👢 You have been **kicked** from **${message.guild.name}**.\n**Reason:** ${reason}`).catch(() => {});
      await target.kick(reason);

      const embed = new EmbedBuilder()
        .setColor(0xFF8C00)
        .setTitle('👢 Member Kicked')
        .addFields(
          { name: 'User', value: target.user.tag },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: message.author.tag },
        )
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.reply('❌ Failed to kick that user.');
    }
  },
};
