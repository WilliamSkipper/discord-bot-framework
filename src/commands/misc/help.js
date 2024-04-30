const { EmbedBuilder } = require('discord.js');
const { accentColor } = require('../../../config.json');

module.exports = {
  name: 'help',
  description: 'Lists all available commands.',

  callback: async (client, interaction) => {
    try {

      await interaction.deferReply();
  
      const reply = await interaction.fetchReply();

      // Retrieve all command names and IDs from the global variables
      const { commandNames, commandIDs } = global;
      


      // Create an array of strings containing command name and ID in the desired format
      const commandList = commandNames.map((name, index) => `</${name}:${commandIDs[index]}>`).join('\n');

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTitle("List Of Commands: ")
        .setDescription(`${commandList}`)
        .setColor(accentColor);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error in help command:', error);
    }
  },
};
