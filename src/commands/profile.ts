import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { prisma } from "../db";
import { attributeValueToString } from "../services/userService";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A profile command",
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const character = await prisma.characters.findUnique({
            where: {
                discord_id: message.author.id,
            },
            include: {
                locations: true,
                character_attributes: {
                    include: {
                        attributes: true,
                    },
                    orderBy: {
                        attribute_id: "asc",
                    },
                },
            },
        });

        if (character === null) {
            return message.reply("You have no character!");
        }

        const embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s profile`)
            .setColor("#0099ff")
            .setThumbnail(
                message.author.avatarURL() || message.author.defaultAvatarURL
            );

        embed
            .addField("Level", `${character.level}`, true)
            .addField("Money", character.money!.toString(), true)
            .addField("Exp", `${character.exp} / 200`)
            .addField("Current location", character.locations!.name);

        const attributesValue = character.character_attributes
            .map((characterAttribute) => {
                return `${
                    characterAttribute.attributes!.name
                }: ${attributeValueToString(
                    characterAttribute.value,
                    characterAttribute.attributes!.is_percentage
                )}`;
            })
            .join("\n");

        embed.addField("Attributes", attributesValue);

        return message.channel.send({
            embeds: [embed],
        });
    }
}
