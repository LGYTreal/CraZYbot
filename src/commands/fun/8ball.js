const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomPick } = require('../../utils/helpers');

// =============================================
//   Command: 8ball — Magic 8-ball fortune 🎱
// =============================================

const RESPONSES = {
  positive: [
    'It is certain.', 'Without a doubt!', 'Yes, definitely!',
    'You may rely on it.', 'As I see it, yes.', 'Most likely!',
    'Outlook good!', 'Signs point to yes!', '100% YES bestie 🫶',
    'The universe says ABSOLUTELY.',
  ],
  neutral: [
    'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
    'Cannot predict now.', 'Concentrate and ask again.', '...maybe?',
    'The crystal ball is buffering...', 'idk tbh 🤷',
  ],
  negative: [
    "Don't count on it.", 'My reply is no.', 'My sources say no.',
    'Outlook not so good.', 'Very doubtful.', 'Absolutely NOT.',
    'The spirits say NOPE.', 'Hard pass from the cosmos.',
  ],
};

const ALL_RESPONSES = [
  ...RESPONSES.positive.map(r => ({ text: r, type: 'positive' })),
  ...RESPONSES.neutral.map(r => ({ text: r, type: 'neutral' })),
  ...RESPONSES.negative.map(r => ({ text: r, type: 'negative' })),
];

const TYPE_CONFIG = {
  positive: { color: 0x00FF7F, emoji: '✅' },
  neutral:  { color: 0xFFD700, emoji: '🤔' },
  negative: { color: 0xFF4444, emoji: '❌' },
};

module.exports = {
  name: '8ball',
  aliases: ['8ball', 'eightball', 'fortune'],
  cooldown: 3,

  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('🎱 Ask the Magic 8-ball anything!')
    .addStringOption(opt =>
      opt.setName('question').setDescription('Your burning question...').setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const response = randomPick(ALL_RESPONSES);
    const config = TYPE_CONFIG[response.type];

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('🎱 The Magic 8-Ball Speaks...')
      .addFields(
        { name: '❓ Question', value: question },
        { name: `${config.emoji} Answer`, value: `*${response.text}*` }
      )
      .setFooter({ text: `Asked by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message, args) {
    const question = args.join(' ');
    if (!question) return message.reply('❓ You need to ask a question! `!8ball <question>`');

    const response = randomPick(ALL_RESPONSES);
    const config = TYPE_CONFIG[response.type];

    const embed = new EmbedBuilder()
      .setColor(config.color)
      .setTitle('🎱 The Magic 8-Ball Speaks...')
      .addFields(
        { name: '❓ Question', value: question },
        { name: `${config.emoji} Answer`, value: `*${response.text}*` }
      )
      .setFooter({ text: `Asked by ${message.author.username}` })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  },
};
