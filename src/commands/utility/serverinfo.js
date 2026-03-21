const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: serverinfo 🏰
// =============================================

module.exports = {
  name: 'serverinfo',
  aliases: ['serverinfo', 'server', 'si'],
  cooldown: 10,

  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('🏰 View info about this server.'),

  async execute(interaction) {
    const g = interaction.guild;
    await g.members.fetch();

    const bots = g.members.cache.filter(m => m.user.bot).size;
    const humans = g.memberCount - bots;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`🏰 ${g.name}`)
      .setThumbnail(g.iconURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: '🆔 Server ID', value: g.id, inline: true },
        { name: '👑 Owner', value: `<@${g.ownerId}>`, inline: true },
        { name: '📅 Created', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Members', value: `${g.memberCount} (${humans} humans, ${bots} bots)`, inline: true },
        { name: '📢 Channels', value: `${g.channels.cache.size}`, inline: true },
        { name: '🎭 Roles', value: `${g.roles.cache.size}`, inline: true },
        { name: '💎 Boost Level', value: `Level ${g.premiumTier}`, inline: true },
        { name: '🚀 Boosts', value: `${g.premiumSubscriptionCount}`, inline: true },
        { name: '😀 Emojis', value: `${g.emojis.cache.size}`, inline: true },
      )
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async executePrefix(message) {
    const g = message.guild;
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`🏰 ${g.name}`)
      .setThumbnail(g.iconURL({ dynamic: true }))
      .addFields(
        { name: '🆔 Server ID', value: g.id, inline: true },
        { name: '👑 Owner', value: `<@${g.ownerId}>`, inline: true },
        { name: '👥 Members', value: `${g.memberCount}`, inline: true },
        { name: '💎 Boost Level', value: `Level ${g.premiumTier}`, inline: true },
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};
