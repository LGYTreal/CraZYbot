const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: roast — AI-powered roast 🔥
// =============================================

async function generateRoast(targetName) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',  // Free, very fast via Groq
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: 'You are a roast comedian at a comedy roast show. Keep roasts playful, funny, and lighthearted — never genuinely mean or offensive.',
        },
        {
          role: 'user',
          content: `Write a SHORT, funny roast of a Discord user named "${targetName}". Max 2-3 sentences. Celebrity roast style — creative and hilarious!`,
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? 'Groq API error');
  return data.choices[0].message.content.trim();
}

module.exports = {
  name: 'roast',
  aliases: ['roast'],
  cooldown: 10,

  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('🔥 Get an AI-generated roast of a server member!')
    .addUserOption(opt =>
      opt.setName('target').setDescription('Who to roast 😈').setRequired(true)
    ),

  async execute(interaction) {
    if (!process.env.GROQ_API_KEY) {
      return interaction.reply({
        content: '❌ No `GROQ_API_KEY` set in `.env`! The roast cannon is empty.',
        ephemeral: true,
      });
    }

    const target = interaction.options.getUser('target');
    await interaction.deferReply();

    try {
      const roast = await generateRoast(target.username);
      const embed = new EmbedBuilder()
        .setColor(0xFF4444)
        .setTitle(`🔥 ROASTED: ${target.displayName ?? target.username}`)
        .setDescription(`*"${roast}"*`)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Roast requested by ${interaction.user.username} • Powered by Groq AI` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('Roast error:', err);
      await interaction.editReply('❌ The roast machine broke. Try again!');
    }
  },

  async executePrefix(message, args) {
    if (!process.env.GROQ_API_KEY) {
      return message.reply('❌ No `GROQ_API_KEY` in `.env`!');
    }

    const target = message.mentions.users.first();
    if (!target) return message.reply('Usage: `!roast @user`');

    const loading = await message.reply('🔥 Warming up the roast machine...');

    try {
      const roast = await generateRoast(target.username);
      const embed = new EmbedBuilder()
        .setColor(0xFF4444)
        .setTitle(`🔥 ROASTED: ${target.username}`)
        .setDescription(`*"${roast}"*`)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Roast by ${message.author.username} • Powered by Groq AI` });

      await loading.edit({ content: null, embeds: [embed] });
    } catch (err) {
      await loading.edit('❌ Roast machine broke. Try again!');
    }
  },
};
