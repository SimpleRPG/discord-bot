import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'A ping command'
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const msg = await message.channel.send('Ping?');

        const content = `Pong from JavaScript! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp
            }ms.`;

        return msg.edit(content);
    }
}
