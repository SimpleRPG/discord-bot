import { MessageEmbed, User } from "discord.js";
import { prisma } from "../db";
import { LocationEnum } from "../enums";
import type { CharacterWithLocationAndAttributes } from "../types";

export const registerUser = async (discordId: string): Promise<boolean> => {
    // check if character with discord id matches a character in the database
    if (await characterExists(discordId)) {
        return false;
    }

    const character = await prisma.characters.create({
        data: {
            level: 1,
            exp: 0,
            money: 200,
            location_id: LocationEnum.Hometown,
            discord_id: discordId,
        },
    });

    if (character === null) {
        return false;
    }

    // set default attribute values
    const attributes = await prisma.attributes.findMany();

    if (attributes === null) {
        return false;
    }

    await prisma.character_attributes.createMany({
        data: attributes.map((attribute) => {
            return {
                character_id: character.id,
                attribute_id: attribute.id,
                value: attribute.character_default_value,
            };
        }),
    });

    return true;
};

export const characterExists = async (discordId: string) => {
    const characterCount = await prisma.characters.count({
        where: {
            discord_id: discordId,
        },
    });

    return characterCount !== 0;
};

export const attributeValueToString = (
    value: number,
    isPercentage: boolean
): string => {
    if (isPercentage) {
        return `${value * 100}%`;
    }
    return `${value}`;
};

export const getProfileEmbed = (
    character: CharacterWithLocationAndAttributes,
    author: User
): MessageEmbed => {
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

    return new MessageEmbed()
        .setTitle(`${author.username}'s profile`)
        .setColor("#0099ff")
        .setThumbnail(author.avatarURL() || author.defaultAvatarURL)
        .addFields([
            {
                name: "Level",
                value: `${character.level}`,
                inline: true,
            },
            {
                name: "Money",
                value: character.money!.toString(),
                inline: true,
            },
            {
                name: "Exp",
                value: `${character.exp} / 200`,
            },
            {
                name: "Current location",
                value: character.locations!.name,
            },
        ])
        .addFields([
            {
                name: "Attributes",
                value: attributesValue,
            },
        ]);
};
