const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: avatar — Get a user's avatar 🖼️
// =============================================

module.exports = {
  name: 'avatar',
  aliases: ['avatar', 'av', 'pfp'],
  cooldown: 3,

  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("🖼️ Get a user's full-size avatar.")
    .addUserOption(opt =>
      opt.setName('target').setDescription('User to get avatar of (defaults to you)').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target') ?? interaction.user;
    const avatarURL = target.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setImage(avatarURL)
      .addFields(
        { name: 'PNG', value: `[Link](${target.displayAvatarURL({ extension: 'png', size: 4096 })})`, inline: true },
        { name: 'JPG', value: `[Link](${target.displayAvatarURL({ extension: 'jpg', size: 4096 })})`, inline: true },
        { name: 'WEBP', value: `[Link](${target.displayAvatarURL({ extension: 'webp', size: 4096 })})`, inline: true },
      )
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.editReply({ embeds: [embed] });
  },

  async executePrefix(message) {
    const target = message.mentions.users.first() ?? message.author;
    const avatarURL = target.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`🖼️ ${target.username}'s Avatar`)
      .setImage(avatarURL);

    await message.reply({ embeds: [embed] });
  },
};
