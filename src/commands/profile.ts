import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { getFields, getShape } from "postgrest-js-tools";
import { attributeValueToString } from "../services/userService";
import supabase from "../supabase";
import type { definitions } from "../types/supabase";

type TCharacterAttributes = definitions["character_attributes"] & {
    attribute: definitions["attributes"];
};

// character include location
type TCharacter = definitions["characters"] & {
    location: definitions["locations"];
    character_attributes: TCharacterAttributes | TCharacterAttributes[];
};

const characterShape = getShape<TCharacter>()({
    "*": true,
    location: {
        _: "location_id",
        name: true,
    },
    character_attributes: {
        _: "character_attributes",
        "*": true,
        attribute: {
            _: "attribute_id",
            "*": true,
        },
    },
});

const characterFields = getFields(characterShape);

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A profile command",
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const { body: character } = await supabase
            .from<typeof characterShape>("characters")
            .select(characterFields)
            .eq("discord_id", message.author.id)
            .single();

        if (character === null) {
            return message.reply("You have no character!");
        }

        const characterAttributes =
            character.character_attributes as Array<TCharacterAttributes>;

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
            .addField("Current location", character.location.name);

        const attributesValue = characterAttributes
            .sort((a, b) => a.attribute.id - b.attribute.id)
            .map((characterAttribute) => {
                return `${
                    characterAttribute.attribute.name
                }: ${attributeValueToString(
                    characterAttribute.value,
                    characterAttribute.attribute.is_percentage
                )}`;
            })
            .join("\n");

        embed.addField("Attributes", attributesValue);

        return message.channel.send({
            embeds: [embed],
        });
    }
}
