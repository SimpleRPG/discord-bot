import type { Prisma } from "@prisma/client";
import { AttributeEnum, LocationEnum } from "../src/enums";

export const attributeData: Prisma.attributesCreateInput[] = [
    {
        id: AttributeEnum.HP,
        name: "HP",
        is_percentage: false,
        character_default_value: 50,
    },
    {
        id: AttributeEnum.Strength,
        name: "Strength",
        is_percentage: false,
        character_default_value: 15,
    },
    {
        id: AttributeEnum.Defense,
        name: "Defense",
        is_percentage: false,
        character_default_value: 5,
    },
    {
        id: AttributeEnum.CriticalChance,
        name: "Critical Chance",
        is_percentage: true,
        character_default_value: 0,
    },
    {
        id: AttributeEnum.CriticalDamage,
        name: "Critical Damage",
        is_percentage: true,
        character_default_value: 0,
    },
];

export const locationData: Prisma.locationsCreateInput[] = [
    {
        name: "Hometown",
        level: 1,
    },
    {
        name: "Northern Plain",
        level: 5,
    },
    {
        name: "Dry Lake",
        level: 12,
    },
    {
        name: "Rocky Mountain",
        level: 21,
    },
    {
        name: "Dark Forest",
        level: 32,
    },
    {
        name: "Seaside Shore",
        level: 45,
    },
    {
        name: "Tiny Island",
        level: 60,
    },
    {
        name: "Twin Hill",
        level: 69,
    },
    {
        name: "Forbidden Swamp",
        level: 75,
    },
];

export const entityData: Prisma.entitiesCreateInput[] = [
    {
        name: "Spider",
        entity_locations: {
            connect: {
                id: LocationEnum.Hometown,
            },
        },
        entity_attributes: {
            createMany: {
                data: [
                    {
                        attribute_id: AttributeEnum.HP,
                        value: 30,
                    },
                    {
                        attribute_id: AttributeEnum.Strength,
                        value: 10,
                    },
                    {
                        attribute_id: AttributeEnum.Defense,
                        value: 5,
                    },
                    {
                        attribute_id: AttributeEnum.CriticalChance,
                        value: 0.15,
                    },
                    {
                        attribute_id: AttributeEnum.CriticalDamage,
                        value: 0.2,
                    },
                ],
            },
        },
    },
];
