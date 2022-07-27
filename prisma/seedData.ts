import type { Prisma } from "@prisma/client";
import { prisma } from "../src/db";
import { AttributeEnum, ItemTypeEnum, LocationEnum } from "../src/enums";

export const seedAttributes = async () => {
    console.time("seedAttributes");
    await prisma.attributes.createMany({
        data: [
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
        ],
    });
    console.timeEnd("seedAttributes");
};

export const seedLocations = async () => {
    console.time("seedLocations");
    await prisma.locations.createMany({
        data: [
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
        ],
    });
    console.timeEnd("seedLocations");
};

export const seedEntities = () => {
    console.time("seedEntities");
    const entityData: Prisma.entitiesCreateInput[] = [
        {
            name: "Spider",
            entity_locations: {
                createMany: {
                    data: [
                        {
                            location_id: LocationEnum.Hometown,
                        },
                    ],
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

    entityData.forEach(async (entity) => {
        await prisma.entities.create({ data: entity });
    });
    console.timeEnd("seedEntities");
};

export const seedItemTypes = async () => {
    console.time("seedItemTypes");
    await prisma.item_types.createMany({
        data: [
            {
                id: ItemTypeEnum.Raw,
                name: "Raw",
            },
            {
                id: ItemTypeEnum.Consumable,
                name: "Consumable",
            },
            {
                id: ItemTypeEnum.Equipment,
                name: "Equipment",
            },
        ],
    });
    console.timeEnd("seedItemTypes");
};

export const seedItems = async () => {
    console.time("seedItems");
    await prisma.items.createMany({
        data: [
            {
                name: "Stone",
                item_type_id: ItemTypeEnum.Raw,
            },
            {
                name: "Wood",
                item_type_id: ItemTypeEnum.Raw,
            },
            {
                name: "Iron",
                item_type_id: ItemTypeEnum.Raw,
            },
            {
                name: "Gold",
                item_type_id: ItemTypeEnum.Raw,
            },
            {
                name: "Spider Web",
                item_type_id: ItemTypeEnum.Raw,
            },
        ],
    });
    console.timeEnd("seedItems");
};
