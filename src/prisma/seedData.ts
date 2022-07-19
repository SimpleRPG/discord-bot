import type { Prisma } from "@prisma/client";

export const attributeData: Prisma.attributesCreateInput[] = [
    {
        name: "HP",
        is_percentage: false,
        character_default_value: 50,
    },
    {
        name: "Strength",
        is_percentage: false,
        character_default_value: 15,
    },
    {
        name: "Defense",
        is_percentage: false,
        character_default_value: 5,
    },
    {
        name: "Critical Chance",
        is_percentage: true,
        character_default_value: 0,
    },
    {
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
