import { Prisma } from "@prisma/client";

export const characterWithLocationAndAttributes =
    Prisma.validator<Prisma.charactersArgs>()({
        include: {
            locations: true,
            character_attributes: {
                include: {
                    attributes: true,
                },
                orderBy: {
                    attribute_id: "asc",
                },
            },
        },
    });

export type CharacterWithLocationAndAttributes = Prisma.charactersGetPayload<
    typeof characterWithLocationAndAttributes
>;
