const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// =============================================
//   Command: warn — Warn a member ⚠️
// =============================================

const WARNINGS_FILE = path.join(__dirname, '../../../data/warnings.json');

function loadWarnings() {
  if (!fs.existsSync(WARNINGS_FILE)) {
    fs.mkdirSync(path.dirname(WARNINGS_FILE), { recursive: true });
    fs.writeFileSync(WARNINGS_FILE, '{}');
  }
  return JSON.parse(fs.readFileSync(WARNINGS_FILE, 'utf8'));
}

function saveWarnings(data) {
  fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2));
}

function addWarning(guildId, userId, reason, moderatorId) {
  const warnings = loadWarnings();
  if (!warnings[guildId]) warnings[guildId] = {};
  if (!warnings[guildId][userId]) warnings[guildId][userId] = [];
  warnings[guildId][userId].push({
    id: Date.now(),
    reason,
    moderatorId,
    timestamp: new Date().toISOString(),
  });
  saveWarnings(warnings);
  return warnings[guildId][userId];
}

function getWarnings(guildId, userId) {
  const warnings = loadWarnings();
  return warnings[guildId]?.[userId] ?? [];
}

function clearWarnings(guildId, userId) {
  const warnings = loadWarnings();
  if (warnings[guildId]) {
    delete warnings[guildId][userId];
    saveWarnings(warnings);
  }
}

module.exports = {
  name: 'warn',
  aliases: ['warn', 'warning'],
  cooldown: 3,

  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Warn a member (warnings are saved!)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a warning to a member')
        .addUserOption(opt => opt.setName('target').setDescription('Who to warn').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('List warnings for a member')
        .addUserOption(opt => opt.setName('target').setDescription('Whose warnings to view').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('clear')
        .setDescription('Clear all warnings for a member')
        .addUserOption(opt => opt.setName('target').setDescription('Whose warnings to clear').setRequired(true))
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.editReply({ content: '❌ You need **Moderate Members** permission!' });
    }

    const sub = interaction.options.getSubcommand();
    const target = interaction.options.getUser('target');

    if (sub === 'add') {
      const reason = interaction.options.getString('reason');
      const userWarnings = addWarning(interaction.guild.id, target.id, reason, interaction.user.id);

      const embed = new EmbedBuilder()
        .setColor(0xFFCC00)
        .setTitle('⚠️ Member Warned')
        .addFields(
          { name: 'User', value: `${target.tag} (${target.id})` },
          { name: 'Reason', value: reason },
          { name: 'Moderator', value: interaction.user.tag },
          { name: 'Total Warnings', value: `${userWarnings.length}` },
        )
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp();

      // DM the warned user
      const member = interaction.guild.members.cache.get(target.id);
      if (member) {
        await member.send(
          `⚠️ You have been **warned** in **${interaction.guild.name}**.\n**Reason:** ${reason}\n**Total warnings:** ${userWarnings.length}`
        ).catch(() => {});
      }

      await interaction.editReply({ embeds: [embed] });
    } else if (sub === 'list') {
      const userWarnings = getWarnings(interaction.guild.id, target.id);

      const embed = new EmbedBuilder()
        .setColor(0xFFCC00)
        .setTitle(`⚠️ Warnings for ${target.tag}`)
        .setThumbnail(target.displayAvatarURL())
        .setTimestamp();

      if (!userWarnings.length) {
        embed.setDescription('✅ This user has no warnings!');
      } else {
        embed.setDescription(
          userWarnings.map((w, i) =>
            `**#${i + 1}** — ${w.reason}\n*By <@${w.moderatorId}> on ${new Date(w.timestamp).toLocaleDateString()}*`
          ).join('\n\n')
        );
      }

      await interaction.editReply({ embeds: [embed] });
    } else if (sub === 'clear') {
      clearWarnings(interaction.guild.id, target.id);
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x00FF7F)
            .setTitle('✅ Warnings Cleared')
            .setDescription(`All warnings for **${target.tag}** have been cleared.`)
            .setTimestamp(),
        ],
      });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('❌ You need **Moderate Members** permission!');
    }
    const sub = args[0]; // add | list | clear
    const target = message.mentions.users.first();

    if (!target) return message.reply('Usage: `!warn add @user <reason>` | `!warn list @user` | `!warn clear @user`');

    if (sub === 'list') {
      const userWarnings = getWarnings(message.guild.id, target.id);
      if (!userWarnings.length) return message.reply(`✅ **${target.username}** has no warnings.`);
      return message.reply(
        `⚠️ **Warnings for ${target.username}:**\n` +
        userWarnings.map((w, i) => `**#${i + 1}** ${w.reason} (${new Date(w.timestamp).toLocaleDateString()})`).join('\n')
      );
    }

    if (sub === 'clear') {
      clearWarnings(message.guild.id, target.id);
      return message.reply(`✅ Cleared all warnings for **${target.username}**.`);
    }

    // Default: add
    const reason = args.slice(2).join(' ') || 'No reason provided';
    const userWarnings = addWarning(message.guild.id, target.id, reason, message.author.id);
    message.reply(`⚠️ **${target.username}** has been warned. Reason: ${reason}. (Total: ${userWarnings.length})`);
  },

  // Export helpers so other commands can use them
  getWarnings,
  addWarning,
};
