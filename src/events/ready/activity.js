const { ActivityType } = require("discord.js");
const { activity, status, type} = require("../../../config.json");

module.exports = (client) => {
  client.user.setPresence({
    activities: [
      {
        name: activity,
        type: ActivityType[type],
      },
    ],
    status: status
  });
};
