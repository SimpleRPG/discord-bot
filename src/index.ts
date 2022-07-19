import { LogLevel, SapphireClient } from "@sapphire/framework";
import { BOT_PREFIX, BOT_TOKEN } from "./config";
import { prisma } from "./db";

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
        client.logger.info("Logging in");
        await client.login(BOT_TOKEN);
        await prisma.$connect(); // Connect to the database
        client.logger.info("Logged in");
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

main().finally(async () => {
    await prisma.$disconnect();
});
