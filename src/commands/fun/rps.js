const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: rps — Rock Paper Scissors ✂️
// =============================================

const CHOICES = ['rock', 'paper', 'scissors'];
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' };

function getResult(player, bot) {
  if (player === bot) return 'tie';
  if (
    (player === 'rock' && bot === 'scissors') ||
    (player === 'paper' && bot === 'rock') ||
    (player === 'scissors' && bot === 'paper')
  ) return 'win';
  return 'lose';
}

module.exports = {
  name: 'rps',
  aliases: ['rps', 'rockpaperscissors'],
  cooldown: 3,

  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('✂️ Play Rock Paper Scissors against CraZYbot!')
    .addStringOption(opt =>
      opt.setName('choice')
        .setDescription('Your move!')
        .setRequired(true)
        .addChoices(
          { name: '🪨 Rock', value: 'rock' },
          { name: '📄 Paper', value: 'paper' },
          { name: '✂️ Scissors', value: 'scissors' },
        )
    ),

  async execute(interaction) {
    const player = interaction.options.getString('choice');
    const bot = CHOICES[Math.floor(Math.random() * 3)];
    const result = getResult(player, bot);

    const configs = {
      win:  { color: 0x00FF7F, title: '🏆 You WIN!',  desc: 'You beat me... this time 😤' },
      lose: { color: 0xFF4444, title: '😈 I WIN!',    desc: 'Better luck next time, human!' },
      tie:  { color: 0xFFD700, title: "🤝 It's a TIE!", desc: 'Great minds think alike!' },
    };
    const cfg = configs[result];

    const embed = new EmbedBuilder()
      .setColor(cfg.color)
      .setTitle(cfg.title)
      .setDescription(cfg.desc)
      .addFields(
        { name: `Your move`, value: `${EMOJI[player]} ${player}`, inline: true },
        { name: `CraZYbot's move`, value: `${EMOJI[bot]} ${bot}`, inline: true },
      )
      .setFooter({ text: `Played by ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    const player = args[0]?.toLowerCase();
    if (!CHOICES.includes(player)) {
      return message.reply('Usage: `!rps rock` | `!rps paper` | `!rps scissors`');
    }

    const bot = CHOICES[Math.floor(Math.random() * 3)];
    const result = getResult(player, bot);

    const configs = {
      win:  { color: 0x00FF7F, title: '🏆 You WIN!' },
      lose: { color: 0xFF4444, title: '😈 I WIN!' },
      tie:  { color: 0xFFD700, title: "🤝 Tie!" },
    };

    const embed = new EmbedBuilder()
      .setColor(configs[result].color)
      .setTitle(configs[result].title)
      .addFields(
        { name: 'You', value: `${EMOJI[player]} ${player}`, inline: true },
        { name: 'Bot', value: `${EMOJI[bot]} ${bot}`, inline: true },
      );

    await message.reply({ embeds: [embed] });
  },
};
