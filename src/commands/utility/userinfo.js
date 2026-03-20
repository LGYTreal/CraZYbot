const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: userinfo — View a user's info 👤
// =============================================

module.exports = {
  name: 'userinfo',
  aliases: ['userinfo', 'whois', 'ui'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('👤 View detailed info about a server member.')
    .addUserOption(opt =>
      opt.setName('target').setDescription('User to inspect (defaults to you)').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('target') ?? interaction.member;
    const user = target.user;

    const roles = target.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => r.toString())
      .slice(0, 10)
      .join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setColor(target.displayHexColor || 0x5865F2)
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: '🆔 User ID', value: user.id, inline: true },
        { name: '🤖 Bot?', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '📥 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: '🎨 Display Color', value: target.displayHexColor || 'None', inline: true },
        { name: '✨ Boosting Since', value: target.premiumSince ? `<t:${Math.floor(target.premiumSinceTimestamp / 1000)}:D>` : 'Not boosting', inline: true },
        { name: `🎭 Roles (${target.roles.cache.size - 1})`, value: roles },
      )
      .setFooter({ text: `Requested by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    const target = message.mentions.members.first() ?? message.member;
    const user = target.user;

    const roles = target.roles.cache
      .filter(r => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => r.toString())
      .slice(0, 10)
      .join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setColor(target.displayHexColor || 0x5865F2)
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: '🆔 User ID', value: user.id, inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '📥 Joined Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: `🎭 Roles (${target.roles.cache.size - 1})`, value: roles },
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};
