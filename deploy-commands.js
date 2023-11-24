const {REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const comandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(comandsPath).filter(file => file.endsWith('.js'));
    for (constfile of commandFiles) {
        const filePath = path.join(comandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            command.push(command.data.toJSON());
        } else { 
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
     }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

          const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();