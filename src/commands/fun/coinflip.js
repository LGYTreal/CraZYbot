const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { sleep } = require('../../utils/helpers');

// =============================================
//   Command: coinflip — Flip a coin 🪙
// =============================================

module.exports = {
  name: 'coinflip',
  aliases: ['coinflip', 'flip', 'coin'],
  cooldown: 3,

  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('🪙 Flip a coin — heads or tails?'),

  async execute(interaction) {
    await interaction.deferReply();
    await sleep(700);

    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new EmbedBuilder()
      .setColor(result === 'Heads' ? 0xFFD700 : 0xC0C0C0)
      .setTitle(`🪙 ${result}!`)
      .setDescription(result === 'Heads' ? '👑 **Heads wins!**' : '🔁 **Tails wins!**')
      .setFooter({ text: `Flipped by ${interaction.user.username}` });

    await interaction.editReply({ embeds: [embed] });
  },

  async executePrefix(message) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const embed = new EmbedBuilder()
      .setColor(result === 'Heads' ? 0xFFD700 : 0xC0C0C0)
      .setTitle(`🪙 ${result}!`)
      .setDescription(result === 'Heads' ? '👑 **Heads wins!**' : '🔁 **Tails wins!**')
      .setFooter({ text: `Flipped by ${message.author.username}` });

    await message.reply({ embeds: [embed] });
  },
};
