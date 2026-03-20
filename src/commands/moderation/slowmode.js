const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// =============================================
//   Command: slowmode — Set channel slowmode 🐢
// =============================================

module.exports = {
  name: 'slowmode',
  aliases: ['slowmode', 'slow'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('🐢 Set the slowmode delay for this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(opt =>
      opt.setName('seconds')
        .setDescription('Slowmode delay in seconds (0 = off, max 21600)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: '❌ You need **Manage Channels** permission!', ephemeral: true });
    }

    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()
      .setColor(seconds === 0 ? 0x00FF7F : 0xFF8C00)
      .setTitle(seconds === 0 ? '✅ Slowmode Disabled' : '🐢 Slowmode Enabled')
      .setDescription(seconds === 0 ? 'Slowmode has been turned off.' : `Users must wait **${seconds} seconds** between messages.`)
      .setFooter({ text: `Set by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply('❌ You need **Manage Channels** permission!');
    }

    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
      return message.reply('Usage: `!slowmode <0-21600>` (0 = off)');
    }

    await message.channel.setRateLimitPerUser(seconds);
    message.reply(seconds === 0 ? '✅ Slowmode disabled.' : `🐢 Slowmode set to **${seconds}s**.`);
  },
};
