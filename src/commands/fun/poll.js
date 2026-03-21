const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: poll — Create a vote poll 📊
// =============================================

const NUMBER_EMOJIS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

module.exports = {
  name: 'poll',
  aliases: ['poll', 'vote'],
  cooldown: 10,

  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('📊 Create a poll for people to vote on!')
    .addStringOption(opt =>
      opt.setName('question').setDescription('What are we voting on?').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('options')
        .setDescription('Comma-separated options (e.g. "Pizza, Sushi, Tacos")')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('duration')
        .setDescription('Poll duration in minutes (default: 5)')
        .setMinValue(1)
        .setMaxValue(60)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const optionsRaw = interaction.options.getString('options');
    const duration = interaction.options.getInteger('duration') ?? 5;

    const options = optionsRaw.split(',').map(o => o.trim()).filter(Boolean).slice(0, 10);
    if (options.length < 2) {
      return interaction.reply({ content: '❌ You need at least 2 options!', ephemeral: true });
    }

    const description = options.map((o, i) => `${NUMBER_EMOJIS[i]} **${o}**`).join('\n');
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📊 ${question}`)
      .setDescription(description)
      .setFooter({ text: `Poll by ${interaction.user.username} • Ends in ${duration} min` })
      .setTimestamp(Date.now() + duration * 60 * 1000);

    await interaction.editReply({ embeds: [embed] });
    const msg = await interaction.fetchReply();

    // Add reactions for voting
    for (let i = 0; i < options.length; i++) {
      await msg.react(NUMBER_EMOJIS[i]);
    }

    // End poll after duration
    setTimeout(async () => {
      try {
        const updatedMsg = await msg.fetch();
        const results = options.map((o, i) => {
          const reaction = updatedMsg.reactions.cache.get(NUMBER_EMOJIS[i]);
          const count = (reaction?.count ?? 1) - 1; // subtract bot's own reaction
          return { option: o, votes: count };
        });
        results.sort((a, b) => b.votes - a.votes);

        const resultDesc = results.map((r, i) => {
          const bar = '█'.repeat(Math.max(r.votes, 0)) || '░';
          return `${i === 0 ? '🏆' : `${i + 1}.`} **${r.option}** — ${r.votes} vote(s)\n\`${bar}\``;
        }).join('\n\n');

        const resultEmbed = new EmbedBuilder()
          .setColor(0xFFD700)
          .setTitle(`📊 POLL CLOSED: ${question}`)
          .setDescription(resultDesc)
          .setFooter({ text: `Poll by ${interaction.user.username}` })
          .setTimestamp();

        await interaction.followUp({ embeds: [resultEmbed] });
      } catch (e) {
        console.error('Poll end error:', e);
      }
    }, duration * 60 * 1000);
  },

  async executePrefix(message, args) {
    // Usage: !poll Question | Option1 | Option2 | Option3
    const full = args.join(' ');
    const parts = full.split('|').map(p => p.trim()).filter(Boolean);
    if (parts.length < 3) {
      return message.reply('Usage: `!poll Question | Option1 | Option2 | ...`');
    }

    const question = parts[0];
    const options = parts.slice(1, 11);
    const description = options.map((o, i) => `${NUMBER_EMOJIS[i]} **${o}**`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📊 ${question}`)
      .setDescription(description)
      .setFooter({ text: `Poll by ${message.author.username}` })
      .setTimestamp();

    const msg = await message.channel.send({ embeds: [embed] });
    for (let i = 0; i < options.length; i++) {
      await msg.react(NUMBER_EMOJIS[i]);
    }
  },
};
