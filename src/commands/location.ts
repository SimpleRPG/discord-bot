import { ApplyOptions } from "@sapphire/decorators";
import type { Args } from "@sapphire/framework";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { prisma } from "../db";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A basic command",
    aliases: ["loc"],
    subCommands: [
        "move",
        { input: "all", default: true },
        { input: "mv", output: "move" },
        { input: "go", output: "move" },
        { input: "goto", output: "move" },
    ],
})
export class UserCommand extends SubCommandPluginCommand {
    public async move(message: Message, args: Args) {
        const locationName = await args.rest("string").catch(() => "");

        if (locationName === "") {
            return message.reply("You must specify a location!");
        }

        const location = await prisma.locations.findFirst({
            where: {
                name: {
                    contains: locationName,
                    mode: "insensitive",
                },
            },
        });

        if (location === null) {
            return message.reply("That location does not exist!");
        }

        const character = await prisma.characters.findUnique({
            where: {
                discord_id: message.author.id,
            },
        });

        if (character === null) {
            return message.reply("You have no character!");
        }

        if (character.location_id === location.id) {
            return message.reply("You are already in that location!");
        }

        if (character.level < location.level) {
            return message.reply(
                "You are not strong enough to enter that location!"
            );
        }

        await prisma.characters.update({
            data: {
                location_id: location.id,
            },
            where: {
                discord_id: message.author.id,
            },
        });

        return message.reply(`You have moved to ${location.name}!`);
    }

    public async all(message: Message) {
        const locations = await prisma.locations.findMany();

        const embed = new MessageEmbed()
            .setTitle("Locations")
            .setDescription(
                locations!
                    .map(
                        (location) => `${location.name} - Lvl ${location.level}`
                    )
                    .join("\n")
            );

        return message.channel.send({
            embeds: [embed],
        });
    }
}
