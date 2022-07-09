import { LogLevel, SapphireClient } from '@sapphire/framework';
import config from './config';

const client = new SapphireClient({
    defaultPrefix: config.BOT_PREFIX,
    regexPrefix: /^(hey +)?bot[,! ]/i,
    caseInsensitiveCommands: true,
    logger: {
        level: LogLevel.Debug
    },
    shards: 'auto',
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
    ]
});

const main = async () => {
    try {
        client.logger.info('Logging in');
        await client.login(config.BOT_TOKEN);
        client.logger.info('Logged in');
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main();
