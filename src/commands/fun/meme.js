const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

// =============================================
//   Command: meme — Fetch a fresh meme 🐸
// =============================================

const SUBREDDITS = ['memes', 'dankmemes', 'me_irl', 'AdviceAnimals', 'funny', 'shitposting'];

async function fetchMeme(subreddit = 'memes') {
  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CraZYbot/1.0' },
  });
  const json = await res.json();
  const posts = json.data.children
    .map(p => p.data)
    .filter(p => !p.stickied && !p.is_self && p.url.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  if (!posts.length) throw new Error('No image posts found');
  return posts[Math.floor(Math.random() * posts.length)];
}

module.exports = {
  name: 'meme',
  aliases: ['meme', 'memes'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('🐸 Fetch a fresh hot meme from Reddit!')
    .addStringOption(opt =>
      opt.setName('subreddit')
        .setDescription('Which subreddit? (default: memes)')
        .setRequired(false)
        .addChoices(
          { name: 'r/memes', value: 'memes' },
          { name: 'r/dankmemes', value: 'dankmemes' },
          { name: 'r/funny', value: 'funny' },
          { name: 'r/me_irl', value: 'me_irl' },
          { name: 'r/shitposting', value: 'shitposting' },
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const sub = interaction.options.getString('subreddit') ?? 'memes';

    try {
      const post = await fetchMeme(sub);
      const embed = new EmbedBuilder()
        .setColor(0xFF4500)
        .setTitle(post.title.slice(0, 256))
        .setURL(`https://reddit.com${post.permalink}`)
        .setImage(post.url)
        .setFooter({ text: `r/${sub} • 👍 ${post.ups.toLocaleString()} upvotes` });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply('❌ Couldn\'t fetch a meme right now. Reddit might be down (or the memes are too dank).');
    }
  },

  async executePrefix(message, args) {
    const sub = SUBREDDITS.includes(args[0]) ? args[0] : 'memes';
    const loading = await message.reply('🔄 Fetching a fresh meme...');

    try {
      const post = await fetchMeme(sub);
      const embed = new EmbedBuilder()
        .setColor(0xFF4500)
        .setTitle(post.title.slice(0, 256))
        .setURL(`https://reddit.com${post.permalink}`)
        .setImage(post.url)
        .setFooter({ text: `r/${sub} • 👍 ${post.ups.toLocaleString()} upvotes` });

      await loading.edit({ content: null, embeds: [embed] });
    } catch (err) {
      await loading.edit('❌ Couldn\'t fetch a meme right now.');
    }
  },
};
