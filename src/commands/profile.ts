import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import type { Message } from "discord.js";
import { prisma } from "../db";
import { getProfileEmbed } from "../services/userService";
import { characterWithLocationAndAttributes } from "../types";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A profile command",
    preconditions: ["RegisteredUser"],
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const character = await prisma.characters.findUniqueOrThrow({
            where: {
                discord_id: message.author.id,
            },
            include: characterWithLocationAndAttributes.include,
        });

        const profileEmbed = getProfileEmbed(character, message.author);

        return message.channel.send({
            embeds: [profileEmbed],
        });
    }
}
