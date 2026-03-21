const { SlashCommandBuilder } = require('discord.js');
const { colorText, rainbowText } = require('../../utils/helpers');

// =============================================
//   Command: color — Send colored ANSI text
// =============================================

const COLOR_CHOICES = [
  { name: '🔴 Red', value: 'red' },
  { name: '🟢 Green', value: 'green' },
  { name: '🟡 Yellow', value: 'yellow' },
  { name: '🔵 Blue', value: 'blue' },
  { name: '🟣 Magenta', value: 'magenta' },
  { name: '🩵 Cyan', value: 'cyan' },
  { name: '🟠 Orange', value: 'orange' },
  { name: '🩷 Pink', value: 'pink' },
  { name: '🌈 Rainbow', value: 'rainbow' },
];

module.exports = {
  name: 'color',
  aliases: ['color', 'colour', 'colortext'],
  cooldown: 3,

  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('🎨 Send a message in a fun color!')
    .addStringOption(opt =>
      opt.setName('text').setDescription('The text to colorize').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('color')
        .setDescription('Pick a color')
        .setRequired(true)
        .addChoices(...COLOR_CHOICES)
    ),

  async execute(interaction) {
    const text = interaction.options.getString('text');
    const color = interaction.options.getString('color');

    const output = color === 'rainbow' ? rainbowText(text) : colorText(text, color);
    await interaction.editReply(`🎨 **${interaction.user.username}** says:\n${output}`);
  },

  async executePrefix(message, args) {
    // Usage: !color <colorname> <text...>
    const colorArg = args[0]?.toLowerCase();
    const text = args.slice(1).join(' ');

    if (!colorArg || !text) {
      return message.reply(
        `Usage: \`!color <color> <text>\`\n` +
        `Colors: ${COLOR_CHOICES.map(c => c.value).join(', ')}`
      );
    }

    const validColors = COLOR_CHOICES.map(c => c.value);
    if (!validColors.includes(colorArg)) {
      return message.reply(`❌ Unknown color. Choose from: ${validColors.join(', ')}`);
    }

    const output = colorArg === 'rainbow' ? rainbowText(text) : colorText(text, colorArg);
    await message.channel.send(`🎨 **${message.author.username}** says:\n${output}`);
  },
};
