import { ApplyOptions } from "@sapphire/decorators";
import {
    SubCommandPluginCommand,
    SubCommandPluginCommandOptions,
} from "@sapphire/plugin-subcommands";
import type { Message } from "discord.js";
import { getFields, getShape } from "postgrest-js-tools";
import supabase from "../supabase";
import type { definitions } from "../types/supabase";

type TCharacter = definitions["characters"] & {
    location: definitions["locations"];
};

type TEntityAttribute = definitions["entity_attributes"] & {
    attribute: definitions["attributes"];
};

type TEntityLocation = definitions["entity_locations"] & {
    entity: definitions["entities"] & {
        entity_attributes: TEntityAttribute | TEntityAttribute[];
    };
};

type TLocation = definitions["locations"] & {
    entity_locations: TEntityLocation | TEntityLocation[];
};

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: "A basic command",
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const characterShape = getShape<TCharacter>()({
            discord_id: true,
            location_id: true,
        });

        const locationShape = getShape<TLocation>()({
            id: true,
            entity_locations: {
                _: "entity_locations",
                entity: {
                    _: "entity_id",
                    name: true,
                    id: true,
                    entity_attributes: {
                        _: "entity_attributes",
                        value: true,
                        attribute: {
                            _: "attribute_id",
                            name: true,
                            id: true,
                        },
                    },
                },
            },
        });

        const { body: character } = await supabase
            .from<typeof characterShape>("characters")
            .select(getFields(characterShape))
            .eq("discord_id", message.author.id)
            .single();

        const { body: location } = await supabase
            .from<typeof locationShape>("locations")
            .select(getFields(locationShape))
            .eq("id", character!.location_id!)
            .single();

        return message.channel.send(
            JSON.stringify(location?.entity_locations, null, 2)
        );
    }
}
