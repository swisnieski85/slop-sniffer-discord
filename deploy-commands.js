// deploy-commands.js
// Run this once manually to clear any previously registered slash commands.
require('dotenv').config();

const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Clearing slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('Slash commands cleared.');
  } catch (error) {
    console.error('Failed to clear slash commands:', error);
    process.exit(1);
  }
})();
