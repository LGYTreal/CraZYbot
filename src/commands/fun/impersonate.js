const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getOrCreateWebhook } = require('../../utils/helpers');

// =============================================
//   Command: impersonate — Type as someone! 😈
// =============================================

module.exports = {
  name: 'impersonate',
  aliases: ['impersonate', 'imposter', 'fake'],
  cooldown: 5,

  data: new SlashCommandBuilder()
    .setName('impersonate')
    .setDescription('😈 Send a message as another server member (pure chaos)!')
    .addUserOption(opt =>
      opt.setName('target').setDescription('Who to impersonate').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('message').setDescription('What to say as them').setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('target');
    const messageText = interaction.options.getString('message');

    if (!target) {
      return interaction.reply({ content: '❌ That user is not in this server!', ephemeral: true });
    }
    if (target.user.bot) {
      return interaction.reply({ content: "❌ Can't impersonate bots... that'd be TOO crazy.", ephemeral: true });
    }

    try {
      const webhook = await getOrCreateWebhook(interaction.channel);

      // Delete the slash command response (it's ephemeral anyway)
      await interaction.reply({ content: '😈 Impersonation deployed!', ephemeral: true });

      await webhook.send({
        content: messageText,
        username: target.displayName,
        avatarURL: target.user.displayAvatarURL({ dynamic: true }),
      });
    } catch (err) {
      console.error('Impersonate error:', err);
      await interaction.reply({
        content: '❌ Failed to impersonate. Make sure I have **Manage Webhooks** permission!',
        ephemeral: true,
      });
    }
  },

  async executePrefix(message, args) {
    // Usage: !impersonate @user message text here
    const target = message.mentions.members.first();
    const text = args.slice(1).join(' '); // skip the mention

    if (!target) return message.reply('Usage: `!impersonate @user message here`');
    if (!text) return message.reply('❌ You need to provide a message!');
    if (target.user.bot) return message.reply("❌ Can't impersonate bots.");

    try {
      const webhook = await getOrCreateWebhook(message.channel);
      await message.delete().catch(() => {});
      await webhook.send({
        content: text,
        username: target.displayName,
        avatarURL: target.user.displayAvatarURL({ dynamic: true }),
      });
    } catch (err) {
      console.error('Impersonate error:', err);
      message.reply('❌ Failed! Make sure I have **Manage Webhooks** permission.');
    }
  },
};
