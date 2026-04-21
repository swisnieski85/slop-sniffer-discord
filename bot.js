// bot.js
require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const SlopSniffer = require('./slopSniffer');
const db = require('./db');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN environment variable.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', async () => {
  await db.init();
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, guildId } = interaction;

  if (commandName === 'setup') {
    const channel = interaction.options.getChannel('channel');
    await db.setConfig(guildId, channel.id);
    await interaction.reply({
      content: `Reports will be sent to ${channel}.`,
      ephemeral: true,
    });

  } else if (commandName === 'status') {
    const config = await db.getConfig(guildId);
    if (!config) {
      await interaction.reply({
        content: 'SlopSniffer is not configured for this server. Use `/setup` to set a report channel.',
        ephemeral: true,
      });
    } else {
      const channel = interaction.guild.channels.cache.get(config.channel_id);
      const channelMention = channel ? `${channel}` : `<deleted channel \`${config.channel_id}\`>`;
      await interaction.reply({
        content: `Reports are currently being sent to ${channelMention}.`,
        ephemeral: true,
      });
    }

  } else if (commandName === 'disable') {
    const deleted = await db.deleteConfig(guildId);
    await interaction.reply({
      content: deleted
        ? 'SlopSniffer has been disabled for this server.'
        : 'SlopSniffer was not configured for this server.',
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guildId) return;

  const result = SlopSniffer.sniff(message.content);
  if (!result.detected) return;

  const config = await db.getConfig(message.guildId);
  if (!config) return;

  if (message.channelId === config.channel_id) return;

  const reportChannel = client.channels.cache.get(config.channel_id);
  if (!reportChannel) {
    console.error(`Report channel ${config.channel_id} not found or bot lacks access.`);
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
