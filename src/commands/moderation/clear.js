const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Delete an amount of messages.',
  serverOnly: true,
  options: [
    {
      name: 'amount',
      description: 'Amount of messages to delete (maximum 100).',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const amount = interaction.options.getInteger('amount');
    
    // Check if amount is within bounds
    if (amount <= 0 || amount > 100) {
      return interaction.editReply('You can only delete between 1 and 100 messages at a time.');
    }

    // Fetch messages to delete
    const messages = await interaction.channel.messages.fetch({ limit: amount });
    
    try {
      // Delete fetched messages
      await interaction.channel.bulkDelete(messages);
      
      
      interaction.channel.send(`Successfully deleted ${amount} messages.`);
    } catch (error) {
      console.error('Error deleting messages:', error);
      interaction.channel.send('There was an error deleting the messages.');
    }
  },
};
