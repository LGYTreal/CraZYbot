const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: help — Show all commands 📖
// =============================================

const COMMAND_LIST = {
  '🎉 Fun': [
    { name: '/party', desc: 'Start an insane animated disco party!' },
    { name: '/color <color> <text>', desc: 'Send colored ANSI text (rainbow too!)' },
    { name: '/impersonate @user <msg>', desc: 'Send a message as someone else 😈' },
    { name: '/8ball <question>', desc: 'Ask the Magic 8-ball anything' },
    { name: '/meme [subreddit]', desc: 'Fetch a fresh hot meme from Reddit' },
    { name: '/poll <question> <options>', desc: 'Create a timed voting poll' },
    { name: '/roast @user', desc: '🔥 AI-generated roast powered by Claude' },
    { name: '/coinflip', desc: 'Flip a coin — heads or tails?' },
    { name: '/rps <choice>', desc: 'Rock Paper Scissors against the bot' },
  ],
  '🔨 Moderation': [
    { name: '/ban @user [reason]', desc: 'Permanently ban a member' },
    { name: '/kick @user [reason]', desc: 'Kick a member from the server' },
    { name: '/timeout @user <duration>', desc: 'Temporarily mute a member' },
    { name: '/warn add/list/clear @user', desc: 'Manage member warnings (persisted!)' },
    { name: '/purge <amount> [@user]', desc: 'Bulk delete messages' },
    { name: '/slowmode <seconds>', desc: 'Set channel slowmode (0 = off)' },
  ],
  '🔧 Utility': [
    { name: '/help', desc: 'Show this help menu' },
    { name: '/userinfo [@user]', desc: 'View detailed info about a user' },
    { name: '/serverinfo', desc: 'View info about this server' },
    { name: '/avatar [@user]', desc: 'Get a user\'s full-size avatar' },
    { name: '/ping', desc: 'Check the bot\'s latency' },
  ],
};

module.exports = {
  name: 'help',
  aliases: ['help', 'commands', 'h'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Show all CraZYbot commands!'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🤖 CraZYbot — Command Reference')
      .setDescription('Use `/command` (slash) or `!command` (prefix) for any command below!\n\u200b')
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: 'CraZYbot • The wildest bot around 🎉' })
      .setTimestamp();

    for (const [category, commands] of Object.entries(COMMAND_LIST)) {
      embed.addFields({
        name: category,
        value: commands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n'),
      });
    }

    await interaction.editReply({ embeds: [embed], ephemeral: true });
  },

  async executePrefix(message) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🤖 CraZYbot — Command Reference')
      .setDescription('Use `/command` (slash) or `!command` (prefix) for any command!\n\u200b')
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter({ text: 'CraZYbot • The wildest bot around 🎉' });

    for (const [category, commands] of Object.entries(COMMAND_LIST)) {
      embed.addFields({
        name: category,
        value: commands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n'),
      });
    }

    await message.reply({ embeds: [embed] });
  },
};
