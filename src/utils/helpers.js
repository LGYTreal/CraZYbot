// =============================================
//   CraZYbot — Shared Utilities
// =============================================

/**
 * ANSI color codes for colored text in Discord code blocks
 * Usage: wrap text in ```ansi ... ``` 
 */
const ANSI = {
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  // Foreground colors
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  orange: '\u001b[38;2;255;165;0m',
  pink: '\u001b[38;2;255;105;180m',
  // Background colors
  bgRed: '\u001b[41m',
  bgGreen: '\u001b[42m',
  bgYellow: '\u001b[43m',
  bgBlue: '\u001b[44m',
  bgMagenta: '\u001b[45m',
  bgCyan: '\u001b[46m',
};

/**
 * Wraps a string in an ANSI Discord code block with a given color
 * @param {string} text
 * @param {string} color - key from ANSI object
 * @returns {string}
 */
function colorText(text, color = 'cyan') {
  const code = ANSI[color] ?? ANSI.cyan;
  return `\`\`\`ansi\n${code}${text}${ANSI.reset}\n\`\`\``;
}

/**
 * Wraps text in a rainbow ANSI block (each char gets a different color)
 * @param {string} text
 * @returns {string}
 */
function rainbowText(text) {
  const colors = [ANSI.red, ANSI.yellow, ANSI.green, ANSI.cyan, ANSI.blue, ANSI.magenta];
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += colors[i % colors.length] + text[i];
  }
  return `\`\`\`ansi\n${result}${ANSI.reset}\n\`\`\``;
}

/**
 * Sleep for ms milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Pick a random item from an array
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Check if a member has a required permission
 */
function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

/**
 * Create or retrieve a webhook for a channel (used for impersonation)
 * @param {TextChannel} channel
 * @returns {Webhook}
 */
async function getOrCreateWebhook(channel) {
  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(w => w.owner?.id === channel.client.user.id && w.name === 'CraZYbot Impersonator');
  if (!webhook) {
    webhook = await channel.createWebhook({
      name: 'CraZYbot Impersonator',
      avatar: channel.client.user.displayAvatarURL(),
    });
  }
  return webhook;
}

module.exports = { ANSI, colorText, rainbowText, sleep, randomPick, hasPermission, getOrCreateWebhook };
