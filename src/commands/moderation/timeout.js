const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// =============================================
//   Command: timeout — Mute a member ⏳
// =============================================

const DURATION_MAP = {
  '60s':   60,
  '5m':    300,
  '10m':   600,
  '30m':   1800,
  '1h':    3600,
  '6h':    21600,
  '12h':   43200,
  '1d':    86400,
  '1w':    604800,
};

function parseDuration(str) {
  if (DURATION_MAP[str]) return DURATION_MAP[str] * 1000;
  const match = str.match(/^(\d+)(s|m|h|d|w)$/);
  if (!match) return null;
  const [, num, unit] = match;
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
  return parseInt(num) * multipliers[unit];
}

module.exports = {
  name: 'timeout',
  aliases: ['timeout', 'mute', 'to'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('⏳ Timeout (mute) a member for a duration.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('target').setDescription('Who to timeout').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('duration')
        .setDescription('Duration (e.g. 10m, 1h, 1d)')
        .setRequired(true)
        .addChoices(
          { name: '60 seconds', value: '60s' },
          { name: '5 minutes', value: '5m' },
          { name: '10 minutes', value: '10m' },
          { name: '30 minutes', value: '30m' },
          { name: '1 hour', value: '1h' },
          { name: '6 hours', value: '6h' },
          { name: '12 hours', value: '12h' },
          { name: '1 day', value: '1d' },
          { name: '1 week', value: '1w' },
        )
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the timeout')
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ You need **Moderate Members** permission!', ephemeral: true });
    }

    const target = interaction.options.getMember('target');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const durationMs = parseDuration(durationStr);

    if (!target) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!durationMs) return interaction.reply({ content: '❌ Invalid duration.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: "❌ I can't timeout that user.", ephemeral: true });

    try {
      await target.timeout(durationMs, reason);

      const embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setTitle('⏳ Member Timed Out')
        .addFields(
          { name: 'User', value: `${target.user.tag} (${target.id})` },
          { name: 'Duration', value: durationStr },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: interaction.user.tag },
          { name: 'Expires', value: `<t:${Math.floor((Date.now() + durationMs) / 1000)}:R>` },
        )
        .setThumbnail(target.user.displayAvatarURL())
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({ content });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ You need **Moderate Members** permission!');
    }

    const target = message.mentions.members.first();
    const durationStr = args[1] ?? '10m';
    const reason = args.slice(2).join(' ') || 'No reason provided';
    const durationMs = parseDuration(durationStr);

    if (!target) return message.reply('Usage: `!timeout @user <duration> [reason]`\nExample: `!timeout @user 10m spamming`');
    if (!durationMs) return message.reply('❌ Invalid duration. Use formats like: `60s`, `5m`, `1h`, `1d`');
    if (!target.moderatable) return message.reply("❌ I can't timeout that user.");

    try {
      await target.timeout(durationMs, reason);

      const embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setTitle('⏳ Member Timed Out')
        .addFields(
          { name: 'User', value: target.user.tag },
          { name: 'Duration', value: durationStr },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: message.author.tag },
        )
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.reply('❌ Failed to timeout that user.');
    }
  },
};
