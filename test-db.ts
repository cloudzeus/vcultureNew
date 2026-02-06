
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
