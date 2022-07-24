import type { Prisma } from "@prisma/client";
import { AttributeEnum } from "../enums";

type character_attributes = Prisma.character_attributesGetPayload<{
    include: {
        attributes: true;
    };
}>;

type entity_attributes = Prisma.entity_attributesGetPayload<{
    include: {
        attributes: true;
    };
}>;

type characters = Prisma.charactersGetPayload<{
    include: {
        character_attributes: {
            include: {
                attributes: true;
            };
        };
    };
}>;

type entities = Prisma.entitiesGetPayload<{
    include: {
        entity_attributes: {
            include: {
                attributes: true;
            };
        };
    };
}>;

interface Attribute {
    hp: number;
    strength: number;
    defense: number;
    criticalChance: number;
    criticalDamage: number;
}

export const attackEntity = (character: characters, entity: entities) => {
    const characterAttributes = convertCharacterAttributes(
        character.character_attributes
    );

    const entityAttributes = convertEntityAttributes(entity.entity_attributes);

    // fight until one of the entities dies
    while (characterAttributes.hp > 0 && entityAttributes.hp > 0) {
        // roll for critical hit
        const criticalHit = Math.random() < characterAttributes.criticalChance;

        // calculate damage
        const damage = criticalHit
            ? characterAttributes.strength * characterAttributes.criticalDamage
            : characterAttributes.strength;

        // apply damage with defense
        entityAttributes.hp -= damage - entityAttributes.defense;
    }

    // return the winner
    return characterAttributes.hp > 0 ? character : entity;
};

export const convertCharacterAttributes = (
    characterAttributes: character_attributes[]
): Attribute => {
    const hp = characterAttributes.find(
        (attribute) => attribute.attribute_id === BigInt(AttributeEnum.HP)
    )!.value;

    const strength = characterAttributes.find(
        (attribute) => attribute.attribute_id === BigInt(AttributeEnum.Strength)
    )!.value;

    const defense = characterAttributes.find(
        (attribute) => attribute.attribute_id === BigInt(AttributeEnum.Defense)
    )!.value;

    const criticalChance = characterAttributes.find(
        (attribute) =>
            attribute.attribute_id === BigInt(AttributeEnum.CriticalChance)
    )!.value;

    const criticalDamage = characterAttributes.find(
        (attribute) =>
            attribute.attribute_id === BigInt(AttributeEnum.CriticalDamage)
    )!.value;

    return {
        hp,
        strength,
        defense,
        criticalChance,
        criticalDamage,
    };
};

export const convertEntityAttributes = (
    entityAttributes: entity_attributes[]
): Attribute => {
    const hp = entityAttributes.find(
        (attribute) => attribute.attribute_id === BigInt(AttributeEnum.HP)
    )!.value;

    const strength = entityAttributes.find(
        (attribute) => attribute.attribute_id === BigInt(AttributeEnum.Strength)
    )!.value;

    const defense = entityAttributes.find(
        (attribute) => attribute.attribute_id === BigInt(AttributeEnum.Defense)
    )!.value;

    const criticalChance = entityAttributes.find(
        (attribute) =>
            attribute.attribute_id === BigInt(AttributeEnum.CriticalChance)
    )!.value;

    const criticalDamage = entityAttributes.find(
        (attribute) =>
            attribute.attribute_id === BigInt(AttributeEnum.CriticalDamage)
    )!.value;

    return {
        hp,
        strength,
        defense,
        criticalChance,
        criticalDamage,
    };
};
