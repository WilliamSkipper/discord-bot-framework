const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require('discord.js');
  
  const { accentColor, errorColor } = require("../../../config.json");
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    name: 'unban',
    description: 'Unbans a member from this server.',
    serverOnly: true,
    options: [
      {
        name: 'target-user',
        description: 'The user you want to unban.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('target-user').value;
  
      const errorEmbedTemplate = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setColor(errorColor);
  
      const embedTemplate = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setColor(accentColor);
  
      await interaction.deferReply();
  
      // Fetch the banned user
      const bannedUsers = await interaction.guild.bans.fetch();
      const targetUser = bannedUsers.get(targetUserId);
  
      if (!targetUser) {
        errorEmbedTemplate.setDescription('That user is not banned from this server.');
        await interaction.editReply({
          embeds: [errorEmbedTemplate],
  
        });
        return;
      }
  
      // Unban the targetUser
      try {
        await interaction.guild.members.unban(targetUser);
        
        // Sending DM to the unbanned user
        embedTemplate.setDescription(`You have been unbanned from **${interaction.guild.name}**.`);
        await targetUser.send({
          embeds: [embedTemplate],
        });
  
        embedTemplate.setDescription(`User ${targetUser.tag} has been unbanned from the server.`);
        await interaction.editReply({
          embeds: [embedTemplate],
  
        });
      } catch (error) {
        console.log(`There was an error when unbanning: ${error}`);
      }
    },
  };
  