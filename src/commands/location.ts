import { ApplyOptions } from "@sapphire/decorators";
import type { Args } from "@sapphire/framework";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import { Message, MessageEmbed } from "discord.js";
import { getFields, getShape } from "postgrest-js-tools";
import supabase from "../supabase";
import type { definitions } from "../types/supabase";

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A basic command",
    aliases: ["loc"],
    subCommands: [
        "move",
        { input: "all", default: true },
        { input: "mv", output: "move" },
        { input: "go", output: "move" },
    ],
})
export class UserCommand extends SubCommandPluginCommand {
    public async move(message: Message, args: Args) {
        const locationName = args.next();

        if (!locationName) {
            return message.reply("You must specify a location!");
        }

        const locationsShape = getShape<definitions["locations"]>()({
            id: true,
            name: true,
            level: true,
        });

        const { body: location } = await supabase
            .from<typeof locationsShape>("locations")
            .select(getFields(locationsShape))
            .eq("name", locationName)
            .single();

        if (location === null) {
            return message.reply("That location does not exist!");
        }

        const characterShape = getShape<definitions["characters"]>()({
            location_id: true,
            level: true,
            discord_id: true,
        });

        const { body: character } = await supabase
            .from<typeof characterShape>("characters")
            .select(getFields(characterShape))
            .eq("discord_id", message.author.id)
            .single();

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

        await supabase
            .from<typeof characterShape>("characters")
            .update({
                location_id: location.id,
            })
            .eq("discord_id", message.author.id);

        return message.reply(`You have moved to ${location.name}!`);
    }

    public async all(message: Message) {
        const shape = getShape<definitions["locations"]>()({
            name: true,
            level: true,
        });

        const { data: locations } = await supabase
            .from<typeof shape>("locations")
            .select(getFields(shape));

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
