'use strict';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { embedColor } from '../functions/sendMessage.js';

export const data = new SlashCommandBuilder().setName('iP').setDescription('IP of SnowMc');

export async function execute(interaction) {
	const helpEmbed = new EmbedBuilder().setTitle('SnowMc IP☄️').setColor(embedColor).addFields(
		{
			name: 'SnowMc ☄️',
			value: 'Name : **Snow Mc**,iP : **play.snowmc.fun**,Port : **19132**'
		},
	await interaction.editReply({ embeds: [ipEmbed], ephemeral: false });
}
