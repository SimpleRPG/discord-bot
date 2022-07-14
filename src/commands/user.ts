import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import type { Message } from "discord.js";
import { registerUser } from "../services/userService";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A user command",
    subCommands: ["register"],
})
export class UserCommand extends SubCommandPluginCommand {
    public async register(message: Message) {
        const isUserRegistered = await registerUser(message.author.id);

        if (!isUserRegistered) {
            return message.channel.send("You are already registered!");
        }

        return message.channel.send("You have registered!");
    }
}
