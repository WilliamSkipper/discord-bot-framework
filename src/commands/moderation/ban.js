const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const { accentColor, errorColor } = require("../../../config.json")

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  name: 'ban',
  description: 'Bans a member from this server.',
  serverOnly: true,
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban.',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to ban.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || 'No reason provided';

    const errorEmbedTemplate = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .setColor(errorColor)

    const embedTemplate = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
      .setColor(accentColor)

    await interaction.deferReply();

    // Fetch the target user
    const targetUser = await interaction.guild.members.fetch(targetUserId).catch(() => null);

    if (!targetUser) {
      errorEmbedTemplate.setDescription('That user doesn\'t exist in this server.');
      await interaction.editReply({
        embeds: [errorEmbedTemplate],

      });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      errorEmbedTemplate.setDescription('You can\'t ban that user because they\'re the server owner.');
      await interaction.editReply({
        embeds: [errorEmbedTemplate],

      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      errorEmbedTemplate.setDescription("You can't ban that user because they have the same/higher role than you.");
      await interaction.editReply({
        embeds: [errorEmbedTemplate],

      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      errorEmbedTemplate.setDescription("I can't ban that user because they have the same/higher role than me.");
      await interaction.editReply({
        embeds: [errorEmbedTemplate],

      });
      return;
    }

    // Ban the targetUser
    try {
      embedTemplate.setDescription(`You Have Been Banned From **${interaction.guild.name}** By *${interaction.user.username}* For \`\`${reason}\`\``);
      await targetUser.send({
        embeds: [embedTemplate],

      });
      await targetUser.ban({ reason });
      embedTemplate.setDescription(`User ${targetUser} was banned\nReason: ${reason}`);
      await interaction.editReply({
        embeds: [embedTemplate],

      });

    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
    }
  },
};