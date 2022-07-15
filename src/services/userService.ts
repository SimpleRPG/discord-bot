import { LocationEnum } from "../enums";
import supabase from "../supabase";
import type { definitions } from "../types/supabase";

export const registerUser = async (discordId: string): Promise<boolean> => {
    // check if character with discord id matches a character in the database
    if (await checkCharacterExists(discordId)) {
        return false;
    }

    const { body: character } = await supabase
        .from<definitions["characters"]>("characters")
        .insert({
            discord_id: discordId,
            level: 1,
            exp: 0,
            money: 200,
            location_id: LocationEnum.Hometown,
        })
        .single();

    if (character === null) {
        return false;
    }

    const { data: attributes } = await supabase
        .from<definitions["attributes"]>("attributes")
        .select()
        .order("id");

    await supabase
        .from<definitions["character_attributes"]>("character_attributes")
        .insert(
            attributes!.map((attribute) => ({
                character_id: character.id,
                attribute_id: attribute.id,
                value: attribute.character_default_value,
            }))
        );

    return true;
};

export const getCharacterCurrentLocation = async (
    character: definitions["characters"]
): Promise<definitions["locations"]> => {
    const { body: locations } = await supabase
        .from<definitions["locations"]>("locations")
        .select()
        .eq("id", character.location_id);

    return locations![0];
};

export const checkCharacterExists = async (discordId: string) => {
    const res = await supabase
        .from<definitions["characters"]>("characters")
        .select("discord_id")
        .eq("discord_id", discordId);
    if (res.body![0]) {
        return true;
    }
    return false;
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
