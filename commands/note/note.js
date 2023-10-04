const { SlashCommandBuilder, ModalBuilder, Events, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('Prenez ou regarder vos notes'),
		async execute(interaction) {
			
		},
};
