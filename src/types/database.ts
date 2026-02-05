import { Project as PrismaProject, Category, HeroSection as PrismaHeroSection, ProjectType, JournalPost as PrismaJournalPost, Tag, ImpactSection as PrismaImpactSection, ImpactStat, StudioSection as PrismaStudioSection, ProcessSection as PrismaProcessSection, StorySection as PrismaStorySection, BTSSection as PrismaBTSSection, BTSCard as PrismaBTSCard } from '@prisma/client';

export type ProjectWithCategory = PrismaProject & {
    category: Category;
};

export type JournalPostWithTags = PrismaJournalPost & {
    tags: { tag: Tag }[];
};

export type HeroData = PrismaHeroSection;

export type ImpactData = PrismaImpactSection & {
    stats: ImpactStat[];
    backgroundImageUrl?: string;
};

export type StudioData = PrismaStudioSection;

export type ProcessData = PrismaProcessSection;

export type StoryData = PrismaStorySection;

export type BTSData = PrismaBTSSection & {
    cards: PrismaBTSCard[];
};

export interface ServiceItem {
    id?: string;
    iconName: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    bullets: string[];
    bulletsEn?: string[];
    order: number;
}

export interface ServicesData {
    id?: string;
    headline: string;
    headlineEn?: string;
    description?: string;
    descriptionEn?: string;
    backgroundImageUrl?: string;
    services: ServiceItem[];
}

export interface HomeClientProps {
    initialProjects: ProjectWithCategory[];
    initialHeroData: HeroData | null;
    initialJournalPosts: JournalPostWithTags[];
    initialImpactData: ImpactData | null;
    initialStudioData: StudioData | null;
    initialProcessData: ProcessData | null;
    initialStoryData: StoryData | null;
    initialBTSData: BTSData | null;
    initialServicesData: ServicesData | null;
}
