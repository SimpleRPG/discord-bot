import { AttributeEnum, LocationEnum } from "../enums";
import supabase from "../supabase";
import type { AttributeValue, CharacterAttributes } from "../types/common";
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

export const getAttributesWithValuesFromCharacter = async (character: definitions['characters']): Promise<CharacterAttributes> => {
    let { body: attributes } = await supabase
        .from<definitions['attributes']>('attributes')
        .select();

    // get character_attributes
    let { body: characterAttributes } = await supabase
        .from<definitions['character_attributes']>('character_attributes')
        .select()
        .eq('character_id', character.id);

    let hp: AttributeValue = {};
    let strength: AttributeValue = {};
    let defense: AttributeValue = {};
    let criticalChance: AttributeValue = {};
    let criticalDamage: AttributeValue = {};
    let evadeChance: AttributeValue = {};
    let escapeChance: AttributeValue = {};

    // loop through character_attributes
    characterAttributes!.forEach((characterAttribute) => {
        // loop through attributes
        attributes!.forEach((attribute) => {
            // if attribute id matches character_attribute id
            if (attribute.id === characterAttribute.attribute_id) {
                // set attribute value
                switch (attribute.id) {
                    case AttributeEnum.HP:
                        hp.value = characterAttribute.value;
                        hp.isPercentage = attribute.is_percentage
                        hp.name = attribute.name;
                        break;
                    case AttributeEnum.Strength:
                        strength.value = characterAttribute.value;
                        strength.isPercentage = attribute.is_percentage
                        strength.name = attribute.name;
                        break;
                    case AttributeEnum.Defense:
                        defense.value = characterAttribute.value;
                        defense.isPercentage = attribute.is_percentage
                        defense.name = attribute.name;
                        break;
                    case AttributeEnum.CriticalChance:
                        criticalChance.value = characterAttribute.value;
                        criticalChance.isPercentage = attribute.is_percentage
                        criticalChance.name = attribute.name;
                        break;
                    case AttributeEnum.CriticalDamage:
                        criticalDamage.value = characterAttribute.value;
                        criticalDamage.isPercentage = attribute.is_percentage
                        criticalDamage.name = attribute.name;
                        break;
                    case AttributeEnum.EvadeChance:
                        evadeChance.value = characterAttribute.value;
                        evadeChance.isPercentage = attribute.is_percentage
                        evadeChance.name = attribute.name;
                        break;
                    case AttributeEnum.EscapeChance:
                        escapeChance.value = characterAttribute.value;
                        escapeChance.isPercentage = attribute.is_percentage
                        escapeChance.name = attribute.name;
                        break;
                }
            }
        }
        );
    });

    return <CharacterAttributes>{
        hp,
        strength,
        defense,
        criticalChance,
        criticalDamage,
        evadeChance,
        escapeChance,
    };
}

export const getCharacterCurrentLocation = async (character: definitions['characters']): Promise<definitions['locations']> => {
    let { body: locations } = await supabase
        .from<definitions['locations']>('locations')
        .select()
        .eq('id', character.location_id);

    return locations![0];
}

export const checkCharacterExists = async (discordId: string): Promise<boolean> => {
    return supabase
        .from<definitions['characters']>('characters')
        .select()
        .eq('discord_id', discordId)
        .then((res) => {
            if (res.body![0]) {
                return true;
            }
            return false;
        });
}

export const attributeValueToString = (attributeValue: AttributeValue): string => {
    if (attributeValue.isPercentage) {
        return `${attributeValue.value! * 100}%`;
    }
    return `${attributeValue.value}`;
}
