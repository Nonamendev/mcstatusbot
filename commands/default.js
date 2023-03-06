const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const sendMessage = require('../functions/sendMessage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default')
		.setDescription('Set a server to be the default for all commands')
		.addStringOption((option) => option.setName('server').setDescription('Server IP address or nickname').setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setDMPermission(false),
	async execute(interaction) {
		// Check if there are any servers to make the default
		const monitoredServers = (await serverDB.get(interaction.guildId)) || [];
		if (!monitoredServers.length) {
			await sendMessage.newBasicMessage(interaction, 'There are no monitored servers!');
			return;
		}

		// List the default server if no server is specified
		let defaultServerIndex = await monitoredServers.findIndex((server) => server.default);
		let oldDefaultServer = defaultServerIndex != -1 ? monitoredServers[defaultServerIndex] : monitoredServers[0];
		if (!interaction.options.getString('server')) {
			await sendMessage.newMessageWithTitle(interaction, 'Default Server:', oldDefaultServer.nickname || oldDefaultServer.ip);
            console.log(`${oldDefaultServer.ip} was listed as the default for guild ${interaction.guildId}`);
			return;
		}

		let server;

		// Find the server to make the default
		let serverIndex = await monitoredServers.findIndex((server) => server.nickname == interaction.options.getString('server'));
		serverIndex == -1 ? (serverIndex = await monitoredServers.findIndex((server) => server.ip == interaction.options.getString('server'))) : null;
		server = serverIndex != -1 ? monitoredServers[serverIndex] : null;

		// Check if the server is being monitored
		if (!server) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified was not already being monitored!');
			return;
		}

		//Check if the server is already the default server
		if (server.default) {
			await sendMessage.newBasicMessage(interaction, 'The server you have specified is already the default server!');
			return;
		}

		// Change the default server
		oldDefaultServer.default = false;
		server.default = true;
		await serverDB.set(interaction.guildId, monitoredServers);

        console.log(`${server.ip} was set as the default for guild ${interaction.guildId}`);

		await sendMessage.newBasicMessage(interaction, 'The server has successfully been made the default for all commands.');
	}
};
