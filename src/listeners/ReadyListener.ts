import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({
    event: "ready",
})
export class UserEvent extends Listener {
    public run(client: Client) {
        const { username, id } = client.user!;
        this.container.logger.info(`Logged in as ${username} (${id})`);
    }
}
