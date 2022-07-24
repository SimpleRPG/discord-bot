import { Precondition } from "@sapphire/framework";
import type { Message } from "discord.js";
import { characterExists } from "../services/userService";

export class UserPrecondition extends Precondition {
    public run(message: Message) {
        return this.checkUserHasCharacter(message.author.id);
    }

    private async checkUserHasCharacter(discordId: string) {
        return (await characterExists(discordId))
            ? this.ok()
            : this.error({
                  message: "You don't have a character!",
              });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        RegisteredUser: never;
    }
}
