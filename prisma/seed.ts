import { PrismaClient } from "@prisma/client";
import {
    seedAttributes,
    seedEntities,
    seedItems,
    seedItemTypes,
    seedLocations,
} from "./seedData";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");
    await seedAttributes();
    await seedLocations();
    seedEntities();
    await seedItemTypes();
    await seedItems();
    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
