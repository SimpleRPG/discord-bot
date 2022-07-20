import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { prisma } from "../db";
import { attackEntity } from "../services/battleService";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "An explore command",
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const character = await prisma.characters.findUnique({
            where: {
                discord_id: message.author.id,
            },
            include: {
                character_attributes: {
                    include: {
                        attributes: true,
                    },
                },
            },
        });

        if (character === null) {
            return message.reply("You don't have a character!");
        }

        const entities = await prisma.entities.findMany({
            where: {
                entity_locations: {
                    some: {
                        location_id: character.location_id,
                    },
                },
            },
            include: {
                entity_attributes: {
                    include: {
                        attributes: true,
                    },
                },
            },
        });

        // get random entity
        const entity = entities[Math.floor(Math.random() * entities.length)];

        const winner = attackEntity(character, entity);

        // embed details of the battle
        const embed = new MessageEmbed().setTitle(
            `${message.author.username} vs ${entity.name}`
        );

        const resultMessage = `${
            winner === character ? "You won" : "You lost"
        } against ${entity.name}!`;

        embed.addField("Battle Result", `${resultMessage}`);

        return message.reply({
            embeds: [embed],
        });
    }
}
