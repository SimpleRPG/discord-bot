import { AttributeEnum, LocationEnum } from "../enums";
import supabase from "../supabase";
import type { definitions } from "../types/supabase";

export const registerUser = async (discordId: string): Promise<boolean> => {
    // check if character with discord id matches a character in the database
    let res = await supabase
        .from<definitions['characters']>('characters')
        .select('*')
        .eq('discord_id', discordId);

    if (res.body![0]) {
        // if character exists, return false
        return false;
    }

    const { body: characters } = await supabase
        .from<definitions['characters']>('characters')
        .insert({
            discord_id: discordId,
            level: 1,
            exp: 0,
            money: 200,
            location_id: LocationEnum.Hometown,
        });

    const character = characters![0];

    // get all attributes from the database
    const { body: attributes } = await supabase
        .from<definitions['attributes']>('attributes')
        .select();

    // insert attributes with values into character_attributes
    attributes?.forEach(async (attribute) => {
        let value = 0;

        switch (attribute.id) {
            case AttributeEnum.HP:
                value = 50;
                break;
            case AttributeEnum.Strength:
                value = 15;
                break;
            case AttributeEnum.Defense:
                value = 5;
                break;
            case AttributeEnum.CriticalChance:
                value = 0;
                break;
            case AttributeEnum.CriticalDamage:
                value = 0;
                break;
            case AttributeEnum.EvadeChance:
                value = 0;
                break;
            case AttributeEnum.EscapeChance:
                value = 0;
        }

        await supabase
            .from<definitions['character_attributes']>('character_attributes')
            .insert({
                character_id: character.id,
                attribute_id: attribute.id,
                value: value,
            });
    });

    return true;
}
