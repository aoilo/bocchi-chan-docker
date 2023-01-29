const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./app/normal/commands').filter(file => file.endsWith('.js'));
console.log(commandFiles);

for (const file of commandFiles) {
	const command = require(`./app/normal/commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
	try {
		console.log(`${commands.length} 個のアプリケーションコマンドを登録します。`);

		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`${data.length} 個のアプリケーションコマンドを登録しました。`);
	} catch (error) {
		console.error(error);
	}
})();