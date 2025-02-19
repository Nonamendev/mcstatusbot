'use strict';
import mongoose from 'mongoose';
import { logError } from './consoleLogging.js';

const server = mongoose.Schema({
	ip: { type: String, required: true },
	categoryId: { type: String, required: true },
	statusId: { type: String, required: true },
	playersId: { type: String, required: true },
	nickname: { type: String, required: false, default: null },
	default: { type: Boolean, required: false, default: false },
	platform: { type: String, required: false, default: 'java' }
});

const guild = mongoose.Schema({
	guildId: { type: String, required: true },
	servers: [server]
});

const Guild = mongoose.model('Guild', guild);

function databaseError(err) {
	logError('Database error!', { Error: err });
}

function createGuild(key, servers) {
	const guild = new Guild({
		guildId: key,
		servers: servers
	});
	guild.save();
}

export async function getServers(key) {
	return Guild.findOne({ guildId: key })
		.exec()
		.then((guild) => {
			if (guild) {
				return guild.servers;
			}
			return [];
		})
		.catch(databaseError);
}

export async function addServer(key, server) {
	Guild.findOne({ guildId: key })
		.exec()
		.then((guild) => {
			if (!guild) {
				createGuild(key, [server]);
			} else {
				guild?.servers ? guild.servers.push(server) : (guild.servers = [server]);
				guild.save();
			}
		})
		.catch(databaseError);
}

export async function deleteServer(key, server) {
	Guild.findOne({ guildId: key })
		.exec()
		.then((guild) => {
			if (guild) {
				guild.servers = guild.servers.filter((s) => s.ip != server.ip);
				guild.save();
			}
		})
		.catch(databaseError);
}

export async function deleteServers(key, servers) {
	const serverIPs = servers.map((s) => s.ip);

	Guild.findOne({ guildId: key })
		.exec()
		.then((guild) => {
			if (guild) {
				guild.servers = guild.servers.filter((s) => !serverIPs.includes(s.ip));
				guild.save();
			}
		})
		.catch(databaseError);
}

export async function setServers(key, servers) {
	Guild.findOne({ guildId: key })
		.exec()
		.then((guild) => {
			if (!guild) {
				createGuild(key, servers);
			} else {
				guild.servers = servers;
				guild.save();
			}
		})
		.catch(databaseError);
}

export async function numberOfServers(key) {
	return Guild.findOne({ guildId: key })
		.exec()
		.then((guild) => {
			if (guild) {
				return guild.servers.length;
			}
			return 0;
		})
		.catch(databaseError);
}

export async function deleteGuild(key) {
	Guild.findOneAndDelete({ guildId: key }).exec().catch(databaseError);
}
