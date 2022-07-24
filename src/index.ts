import { LogLevel, SapphireClient } from "@sapphire/framework";
import { BOT_PREFIX, BOT_TOKEN } from "./config";

const client = new SapphireClient({
    defaultPrefix: BOT_PREFIX,
    regexPrefix: /^(hey +)?bot[,! ]/i,
    caseInsensitiveCommands: true,
    logger: {
        level: LogLevel.Debug,
    },
    shards: "auto",
    intents: ["GUILDS", "GUILD_MESSAGES"],
});

const main = async () => {
    try {
        await client.login(BOT_TOKEN);
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

void main();
