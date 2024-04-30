const { EmbedBuilder } = require('discord.js');
const { accentColor } = require('../../../config.json');


module.exports = {
    name: 'ping',
    description: 'Replies with the bot ping!',
  
    callback: async (client, interaction) => {

      await interaction.deferReply();
  
      const reply = await interaction.fetchReply();
  
      const ping = reply.createdTimestamp - interaction.createdTimestamp;

      const embed = new EmbedBuilder()
        .setTitle("🏓 Pong!")
        .setFooter({ text: `Client ${ping}ms | Websocket: ${client.ws.ping}ms`})
        .setColor(accentColor);

  
      interaction.editReply(
        {embeds: [embed]}
      );
    },
  };