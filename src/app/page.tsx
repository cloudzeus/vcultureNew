import { prisma, PRISMA_VERSION } from '../lib/prisma';
console.log('>>> PAGE.TSX MODULE LOADED <<<');
import HomeClient from './_components/HomeClient';
import { ProjectWithCategory, HeroData, JournalPostWithTags, ImpactData, StudioData, ProcessData, StoryData, BTSData, ServicesData } from '@/types/database';

export const revalidate = 0; // Dynamic

export default async function Page() {
    let projects: ProjectWithCategory[] = [];
    let heroData: HeroData | null = null;
    let journalPosts: JournalPostWithTags[] = [];
    let impactData: ImpactData | null = null;
    let studioData: StudioData | null = null;
    let processData: ProcessData | null = null;
    let storyData: StoryData | null = null;
    let btsData: BTSData | null = null;
    let servicesData: ServicesData | null = null;

    try {
        const marker = Math.random().toString(36).substring(7);
        const p = prisma as any;
        console.log(`[${marker}] V:${PRISMA_VERSION} MODELS: studio:${!!p.studioSection} impact:${!!p.impactSection}`);

        if (!p) {
            throw new Error('Prisma client is undefined in page.tsx');
        }

        const results = await Promise.all([
            p.project.findMany({
                where: { status: 'PUBLISHED' },
                include: { category: true },
                orderBy: { year: 'desc' },
                take: 3
            }).catch((e: any) => { console.error('Error fetching projects:', e); return []; }),

            p.heroSection.findFirst({
                where: { active: true }
            }).catch((e: any) => { console.error('Error fetching hero:', e); return null; }),

            p.journalPost.findMany({
                where: { status: 'PUBLISHED' },
                include: {
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: { publishedAt: 'desc' },
                take: 4
            }).catch((e: any) => { console.error('Error fetching journal:', e); return []; }),

            p.impactSection.findFirst({
                where: { active: true },
                include: { stats: true }
            }).catch((e: any) => { console.error('Error fetching impact:', e); return null; }),

            p.studioSection?.findFirst ? p.studioSection.findFirst({
                where: { active: true }
            }).catch((e: any) => { console.error('Error fetching studio:', e); return null; }) : Promise.resolve(null),

            p.processSection?.findFirst ? p.processSection.findFirst({
                where: { active: true }
            }).catch((e: any) => { console.error('Error fetching process:', e); return null; }) : Promise.resolve(null),

            p.storySection?.findFirst ? p.storySection.findFirst({
                where: { active: true }
            }).catch((e: any) => { console.error('Error fetching story:', e); return null; }) : Promise.resolve(null),

            p.bTSSection?.findFirst ? p.bTSSection.findFirst({
                where: { active: true },
                include: { cards: { orderBy: { order: 'asc' } } }
            }).catch((e: any) => { console.error('Error fetching bts:', e); return null; }) : Promise.resolve(null),

            p.servicesSection?.findFirst ? p.servicesSection.findFirst({
                where: { active: true },
                include: { services: { orderBy: { order: 'asc' } } }
            }).catch((e: any) => { console.error('Error fetching services:', e); return null; }) : Promise.resolve(null)
        ]);

        console.log(`[${new Date().toISOString()}] Loaded home page sections.`);

        projects = results[0] as ProjectWithCategory[];
        heroData = results[1] as HeroData;
        journalPosts = results[2] as JournalPostWithTags[];
        impactData = results[3] as ImpactData;
        studioData = results[4] as StudioData;
        processData = results[5] as ProcessData;
        storyData = results[6] as StoryData;
        btsData = results[7] as BTSData;
        servicesData = results[8] as ServicesData;

        console.log(`Loaded home page sections from DB.`);
    } catch (e) {
        console.error('Failed to load data:', e);
    }

    return (
        <HomeClient
            initialProjects={projects}
            initialHeroData={heroData}
            initialJournalPosts={journalPosts}
            initialImpactData={impactData}
            initialStudioData={studioData}
            initialProcessData={processData}
            initialStoryData={storyData}
            initialBTSData={btsData}
            initialServicesData={servicesData}
        />
    );
}
