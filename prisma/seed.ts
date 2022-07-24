import { PrismaClient } from "@prisma/client";
import { attributeData, locationData, seedEntities } from "./seedData";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");
    console.log("Seeding attributes...");
    await prisma.attributes.createMany({ data: attributeData });
    console.log("Seeding locations...");
    await prisma.locations.createMany({ data: locationData });
    console.log("Seeding entities...");
    seedEntities();
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
