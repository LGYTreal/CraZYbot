const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// =============================================
//   Command: ping — Check bot latency 🏓
// =============================================

module.exports = {
  name: 'ping',
  aliases: ['ping', 'latency'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Check the bot latency and API ping.'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    const getColor = (ms) => ms < 100 ? 0x00FF7F : ms < 250 ? 0xFFD700 : 0xFF4444;

    const embed = new EmbedBuilder()
      .setColor(getColor(roundtrip))
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '⏱️ Roundtrip', value: `${roundtrip}ms`, inline: true },
        { name: '💓 API Heartbeat', value: `${apiPing}ms`, inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  },

  async executePrefix(message) {
    const start = Date.now();
    const msg = await message.reply('🏓 Pinging...');
    const roundtrip = Date.now() - start;

    const embed = new EmbedBuilder()
      .setColor(roundtrip < 100 ? 0x00FF7F : roundtrip < 250 ? 0xFFD700 : 0xFF4444)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '⏱️ Roundtrip', value: `${roundtrip}ms`, inline: true },
        { name: '💓 API Heartbeat', value: `${message.client.ws.ping}ms`, inline: true },
      );

    await msg.edit({ content: null, embeds: [embed] });
  },
};
