'use strict';
import { getMissingPermissions } from './botPermissions.js';
import { logWarning } from './consoleLogging.js';

export async function renameChannels(channels, serverStatus) {
	const channelNames = {
		statusName: serverStatus.online ? '📊〢 Status - Online' : '📊〢 Status - Offline',
		playersName: serverStatus.players ? `📊〢 Players - ${serverStatus.players.online} / ${serverStatus.players.max}` : '📊〢 Players - 0 / 0'
	};

	await Promise.allSettled(
		channels.map(async (channel) => {
			try {
				await channel.object?.setName(channelNames[channel.name]);
				if (channel.name == 'playersName') {
					try {
						await channel.object?.permissionOverwrites.edit(channel.object.guild.roles.everyone, {
							ViewChannel: serverStatus.online
						});
					} catch (error) {
						if (!error.name.includes('RateLimitError')) {
							let permissions = getMissingPermissions('channel', channel.object);
							if (!permissions) {
								logWarning('Error changing channel visibility while updating server status', {
									'Channel ID': channel.object.id,
									'Guild ID': channel.object.guildId,
									'Missing Permissions': permissions || 'None',
									Error: error
								});
							}
						}
					}
				}
			} catch (error) {
				if (!error.name.includes('RateLimitError')) {
					let permissions = getMissingPermissions('channel', channel.object);
					if (!permissions) {
						logWarning('Error renaming channels while updating server status', {
							'Channel ID': channel.object.id,
							'Guild ID': channel.object.guildId,
							'Missing Permissions': permissions || 'None',
							Error: error
						});
					}
				}
			}
		})
	);
}
