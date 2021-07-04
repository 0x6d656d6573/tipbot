require('dotenv').config();
const {AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler} = require('discord-akairo');
const {DB} = require('./utils')

class BotClient extends AkairoClient
{
    constructor()
    {
        super({
            ownerID: process.env.OWNER_ID.split(',')
        }, {});

        /* Command handler */
        this.commandHandler = new CommandHandler(this, {
            directory      : './commands/',
            prefix         : '!f',
            defaultCooldown: 10000,
        });

        /* Inhibitor handler */
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        });
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        /* Listener handler */
        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });
        this.listenerHandler.setEmitters({
            commandHandler  : this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler : this.listenerHandler,
        });
        this.commandHandler.useListenerHandler(this.listenerHandler);

        /* Load handlers */
        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();
    }
}

const client = new BotClient();
client.login(process.env.TOKEN);

client.on('ready', () => {
    DB.syncDatabase()
});