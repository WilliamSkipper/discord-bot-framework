const { devs, testServer, errorColor } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { EmbedBuilder} = require('discord.js');
    

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    const errorEmbedTemplate = new EmbedBuilder ()
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setColor(errorColor)

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;
        

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.user.id)) {
                errorEmbedTemplate.setDescription('Only developers are allowed to run this command.');
                interaction.reply({
                    embeds: [errorEmbedTemplate],
                    ephemeral: true,
                });
                return;
            }
        }

        if (commandObject.serverOnly) {
            if (interaction.guild == null) {
                errorEmbedTemplate.setDescription('This command can only be run in servers (guilds).');
                interaction.reply({
                    embeds: [errorEmbedTemplate],
                    ephemeral: true, 
                });
                return; 
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                errorEmbedTemplate.setDescription('This command cannot be ran here.');
                interaction.reply({
                    embeds: [errorEmbedTemplate],
                    ephemeral: true,
                });
                return;
            }
        }
        

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    errorEmbedTemplate.setDescription('Not enough permissions.');
                    interaction.reply({
                        embeds: [errorEmbedTemplate],
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    errorEmbedTemplate.setDescription("I don't have enough permissions.");
                    interaction.reply({
                        embeds: [errorEmbedTemplate],
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running this command: ${error}`);
        errorEmbedTemplate.setDescription(`There was an error running this command: ${error}`);
        interaction.reply({
            embeds: [errorEmbedTemplate],
            ephemeral: true
        });
    }
};
