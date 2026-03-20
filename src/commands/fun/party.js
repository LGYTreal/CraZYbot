const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { sleep } = require('../../utils/helpers');

// =============================================
//   Command: party — Start a DISCO PARTY! 🕺
// =============================================

const DISCO_FRAMES = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '💜', '💛', '❤️', '🧡'];
const DISCO_EMOJIS = ['🕺', '💃', '🎵', '🎶', '✨', '🪩', '🎉', '🥳', '🎊', '🎸'];

function buildDiscoEmbed(round) {
  const color = [0xFF0000, 0xFF7700, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8B00FF][round % 6];
  const disco = DISCO_FRAMES[round % DISCO_FRAMES.length];
  const emoji = DISCO_EMOJIS[round % DISCO_EMOJIS.length];
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(`${disco} DISCO PARTY TIME! ${disco}`)
    .setDescription(
      `${emoji.repeat(5)}\n\n` +
      `**THE FLOOR IS LIT** 🔥\n\n` +
      `${'🎵 '.repeat(8)}\n` +
      `${'💫 '.repeat(8)}\n\n` +
      `Round ${round + 1} of 8 — Keep dancing!`
    )
    .setFooter({ text: '🪩 Powered by CraZYbot' });
}

module.exports = {
  name: 'party',
  aliases: ['disco', 'party'],
  cooldown: 30,

  data: new SlashCommandBuilder()
    .setName('party')
    .setDescription('🕺 Start an insane disco party in the channel!'),

  async execute(interaction) {
    await interaction.deferReply();
    const msg = await interaction.editReply({ embeds: [buildDiscoEmbed(0)] });

    for (let i = 1; i < 8; i++) {
      await sleep(800);
      await msg.edit({ embeds: [buildDiscoEmbed(i)] });
    }

    await sleep(800);
    await msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFFD700)
          .setTitle('🎉 PARTY OVER! That was INSANE!')
          .setDescription('Thanks for dancing with CraZYbot! 🕺💃\n\nType `/party` again to go again!')
          .setFooter({ text: '🪩 Powered by CraZYbot' }),
      ],
    });
  },

  async executePrefix(message) {
    const msg = await message.channel.send({ embeds: [buildDiscoEmbed(0)] });
    for (let i = 1; i < 8; i++) {
      await sleep(800);
      await msg.edit({ embeds: [buildDiscoEmbed(i)] });
    }
    await sleep(800);
    await msg.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(0xFFD700)
          .setTitle('🎉 PARTY OVER! That was INSANE!')
          .setDescription('Thanks for dancing with CraZYbot! 🕺💃')
          .setFooter({ text: '🪩 Powered by CraZYbot' }),
      ],
    });
  },
};
