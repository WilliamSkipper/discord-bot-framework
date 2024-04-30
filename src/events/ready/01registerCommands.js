const getLocalCommands = require("../../utils/getLocalCommands");
const { testServer } = require("../../../config.json");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

// Define a global variable to store command names and IDs
global.commandNames = [];
global.commandIDs = [];

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client);

    // Track existing command names and IDs
    const existingCommands = new Map(
      applicationCommands.cache.map((cmd) => [cmd.name, cmd.id])
    );

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommandId = existingCommands.get(name);

      if (!existingCommandId) {
        const newCommand = await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`👍 Registered command "${name}".`);

        // Push new command's name and ID to the global variables
        global.commandNames.push(name);
        global.commandIDs.push(newCommand.id);
      } else {
        if (
          areCommandsDifferent(
            applicationCommands.cache.find(
              (cmd) => cmd.id === existingCommandId
            ),
            localCommand
          )
        ) {
          await applicationCommands.edit(existingCommandId, {
            description,
            options,
          });

          console.log(`🔁 Edited command "${name}".`);
        }

        // Remove this command name from existing names map
        existingCommands.delete(name);

        // Push existing command's name and ID to the global variables
        global.commandNames.push(name);
        global.commandIDs.push(existingCommandId);
      }
    }

    // Remove commands that exist in application but not locally
    for (const [name, id] of existingCommands) {
      await applicationCommands.delete(id);
      console.log(`🗑 Deleted command "${name}".`);
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
