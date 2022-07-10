export type AttributeValue =  {
    name?: string,
    value?: number,
    isPercentage?: boolean,
}

export type CharacterAttributes = {
    hp: AttributeValue,
    strength: AttributeValue,
    defense: AttributeValue,
    criticalChance: AttributeValue,
    criticalDamage: AttributeValue,
    evadeChance: AttributeValue,
    escapeChance: AttributeValue,
}
