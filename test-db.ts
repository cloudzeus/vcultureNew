
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "mysql://root:Prof%4015%401f1femsk@5.189.130.31:3333/vcultureWebSite?connect_timeout=10"
        }
    }
})

async function main() {
    try {
        console.log('Attempting to connect to DB...')
        await prisma.$connect()
        console.log('Successfully connected to DB')

        const activeHero = await prisma.heroSection.findFirst({
            where: { active: true }
        });

        console.log('Active Hero Section:', JSON.stringify(activeHero, null, 2));

        const allHeroes = await prisma.heroSection.findMany();
        console.log('All Hero Sections:', JSON.stringify(allHeroes, null, 2));

        // Check if there are ANY hero sections
        const count = await prisma.heroSection.count();
        console.log('Total Hero Sections:', count);

        const userCount = await prisma.user.count()
        console.log('User count:', userCount)

        const publishedProjects = await prisma.project.count({
            where: { status: 'PUBLISHED' }
        });
        console.log('Published Projects:', publishedProjects);

        const allProjects = await prisma.project.count();
        console.log('All Projects:', allProjects);

    } catch (e) {
        console.error('Connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
