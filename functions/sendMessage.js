'use strict';
import { EmbedBuilder } from 'discord.js';

export const embedColor = '#8080ff';

export async function sendMessage(interaction, message, title) {
	const responseEmbed = new EmbedBuilder().setDescription(message).setColor(embedColor);
	if (title) responseEmbed.setTitle(title);
	await interaction.editReply({ embeds: [responseEmbed], ephemeral: true });
}
