require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const command = new SlashCommandBuilder()
    .setName('termchat')
    .setDescription('Sends a message in a clean embed with your avatar')
    .addStringOption(option => 
        option.setName('message')
            .setDescription('Enter the message you want to send')
            .setRequired(true)
    )
	
    .setContexts([0, 1, 2]);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log('Registering /termchat command...');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: [command.toJSON()] }
        );
        console.log('Successfully registered /termchat command!');
    } catch (error) {
        console.error('Error registering command:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'termchat') {
        const messageOption = interaction.options.getString('message');
        const user = interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });

        const embed = new EmbedBuilder()
            .setColor('#7289DA')
            .setAuthor({ 
                name: user.username, 
                iconURL: avatarURL 
            })
            .setDescription(messageOption)
            .setThumbnail(avatarURL)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
});

client.login(TOKEN);