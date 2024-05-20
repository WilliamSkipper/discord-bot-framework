const { Events } = require("discord.js");
const { prefix } = require("../../../config.json");

module.exports = (client) => {
  client.on(Events.MessageCreate, (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if the message starts with the prefix and the command is "ping"
    if (
      message.content.startsWith(prefix) &&
      message.content.toLowerCase() === prefix + "ping"
    ) {
      // Reply with "Pong!"
      message.reply("Pong!");
      return
    }
  });
};
