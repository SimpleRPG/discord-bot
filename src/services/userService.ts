import { LocationEnum } from "../enums";
import supabase from "../supabase";
import type { definitions } from "../types/supabase";

const defaultCharacterValues = <definitions["characters"]>{
    level: 1,
    exp: 0,
    money: 200,
    location_id: LocationEnum.Hometown,
};

const getDefaultCharacterAttributeValues = async (characterId: number) => {
    const { data: attributes } = await supabase
        .from<definitions["attributes"]>("attributes")
        .select()
        .order("id");

    return (
        attributes?.map((attribute) => ({
            character_id: characterId,
            attribute_id: attribute.id,
            value: attribute.character_default_value,
        })) || []
    );
};

export const registerUser = async (discordId: string): Promise<boolean> => {
    // check if character with discord id matches a character in the database
    if (await checkCharacterExists(discordId)) {
        return false;
    }

    const { body: character } = await supabase
        .from<definitions["characters"]>("characters")
        .insert({
            ...defaultCharacterValues,
            discord_id: discordId,
        })
        .single();

    if (character === null) {
        return false;
    }

    await supabase
        .from<definitions["character_attributes"]>("character_attributes")
        .insert(await getDefaultCharacterAttributeValues(character.id));

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
