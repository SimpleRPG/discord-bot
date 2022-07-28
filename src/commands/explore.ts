import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { prisma } from "../db";
import { startAttackEntity } from "../services/battleService";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "An explore command",
    preconditions: ["RegisteredUser"],
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const character = await getCharacter(message.author.id);

        const entity = await getRandomEntityFromLocation(
            character.location_id!
        );

        const winner = startAttackEntity(character!, entity);

        // embed details of the battle
        const embed = battleResultEmbed(
            message.author.username,
            entity.name,
            winner === character
        );

        return message.reply({
            embeds: [embed],
        });
    }
}

function battleResultEmbed(
    characterName: string,
    entityName: string,
    characterIsWinner: boolean
): MessageEmbed {
    const resultMessage = `${
        characterIsWinner ? "You won" : "You lost"
    } against ${entityName}!`;

    return new MessageEmbed()
        .setTitle(`${characterName} vs ${entityName}`)
        .addFields([
            {
                name: "Battle Result",
                value: `${resultMessage}`,
            },
        ]);
}

async function getRandomEntityFromLocation(locationId: bigint) {
    const entities = await prisma.entities.findMany({
        where: {
            entity_locations: {
                some: {
                    location_id: locationId,
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

    return entities[Math.floor(Math.random() * entities.length)];
}

async function getCharacter(discordId: string) {
    return prisma.characters.findUniqueOrThrow({
        where: {
            discord_id: discordId,
        },
        include: {
            character_attributes: {
                include: {
                    attributes: true,
                },
            },
        },
    });
}
