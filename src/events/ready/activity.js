const { ActivityType } = require('discord.js');
const { activity } = require('../../../config.json')

module.exports = (client) => {
    client.user.setPresence({
        activities: [{ name: activity, type: ActivityType.Custom }],
    });
    client.user.setStatus('online')
}