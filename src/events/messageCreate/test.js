const { Events } = require("discord.js");
const { prefix } = require("../../../config.json");

module.exports = (client) => {
  client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;
    if (message.content === prefix + "test") {
      message.reply("test!");
      return
    }
  });
};
