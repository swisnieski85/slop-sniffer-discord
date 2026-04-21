// bot.js
require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const SlopSniffer = require('./slopSniffer');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const REPORT_CHANNEL_ID = process.env.REPORT_CHANNEL_ID;

if (!DISCORD_TOKEN || !REPORT_CHANNEL_ID) {
  console.error('Missing required environment variables. Check your .env file.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Reporting flagged messages to channel ID: ${REPORT_CHANNEL_ID}`);
});

client.on('messageCreate', async (message) => {
  // Ignore bots and the report channel itself
  if (message.author.bot) return;
  if (message.channelId === REPORT_CHANNEL_ID) return;

  const result = SlopSniffer.sniff(message.content);
  if (!result.detected) return;

  const reportChannel = client.channels.cache.get(REPORT_CHANNEL_ID);
  if (!reportChannel) {
    console.error(`Report channel ${REPORT_CHANNEL_ID} not found or bot lacks access.`);
    return;
  }

  const excerpt = message.content.length > 1024
    ? message.content.slice(0, 1021) + '...'
    : message.content;

  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle('AI-Generated Content Flagged')
    .setDescription(excerpt)
    .addFields(
      { name: 'Author', value: `${message.author} (${message.author.tag})`, inline: true },
      { name: 'Channel', value: `${message.channel}`, inline: true },
      { name: 'Heuristic', value: result.reason, inline: true },
    )
    .setFooter({ text: `Message ID: ${message.id}` })
    .setTimestamp(message.createdAt);

  await reportChannel.send({
    content: `[Jump to message](${message.url})`,
    embeds: [embed]
  });
});

client.login(DISCORD_TOKEN);
