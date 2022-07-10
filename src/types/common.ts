import type { definitions } from "./supabase";


export type CharacterAttributes = {
    hp: CharacterAttribute,
    strength: CharacterAttribute,
    defense: CharacterAttribute,
    criticalChance: CharacterAttribute,
    criticalDamage: CharacterAttribute,
    evadeChance: CharacterAttribute,
    escapeChance: CharacterAttribute,
}

export type CharacterAttribute = definitions['character_attributes'] & {
    attribute: definitions['attributes'];
}
