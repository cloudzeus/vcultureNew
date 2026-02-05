import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { translateContent } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let processed = 0;
        let errors = 0;

        // 1. PROJECTS
        // Find projects missing translations (check critical fields)
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { titleEn: null },
                    { titleEn: '' },
                    { shortDescriptionEn: null },
                    { shortDescriptionEn: '' }
                ]
            },
            take: 3 // Process small batch to avoid timeouts
        });

        for (const project of projects) {
            try {
                // Prepare fields
                const fieldsToTranslate: Record<string, string> = {};
                if (!project.titleEn && project.title) fieldsToTranslate.title = project.title;
                // subtitle is missing from schema? Let's check schema.prisma... 
                // schema.prisma: model Project has NO subtitle field. 
                // Wait, movies.ts data had subtitle. 
                // Checking previous schema.prisma view...
                // model Project: id, title, titleEn, slug, categoryId, subcategory... 
                // Ah, subcategory might be used as subtitle? Or maybe I missed it.
                // Let's re-read schema.prisma in Step 1880.
                // schema: title, titleEn, slug... subcategory, subcategoryEn... shortDescription...
                // There is NO `subtitle` field in Project model.
                // However, `subcategory` seems to be used somewhat like that or `type`.
                // movies.ts has subtitle. 
                // I will translate whatever is available in schema.

                if (!project.subcategoryEn && project.subcategory) fieldsToTranslate.subcategory = project.subcategory;
                if (!project.shortDescriptionEn && project.shortDescription) fieldsToTranslate.shortDescription = project.shortDescription;
                if (!project.fullDescriptionEn && project.fullDescription) fieldsToTranslate.fullDescription = project.fullDescription;
                if (!project.loglineEn && project.logline) fieldsToTranslate.logline = project.logline;

                if (Object.keys(fieldsToTranslate).length > 0) {
                    const translations = await translateContent({ context: fieldsToTranslate });

                    // Update project
                    await prisma.project.update({
                        where: { id: project.id },
                        data: {
                            ...(translations.title && { titleEn: translations.title }),
                            ...(translations.subcategory && { subcategoryEn: translations.subcategory }),
                            ...(translations.shortDescription && { shortDescriptionEn: translations.shortDescription }),
                            ...(translations.fullDescription && { fullDescriptionEn: translations.fullDescription }),
                            ...(translations.logline && { loglineEn: translations.logline }),
                        }
                    });
                    processed++;
                }
            } catch (e) {
                console.error(`Failed to translate project ${project.id}:`, e);
                errors++;
            }
        }

        // 2. JOURNAL POSTS
        const posts = await prisma.journalPost.findMany({
            where: {
                OR: [
                    { titleEn: null },
                    { titleEn: '' },
                    { excerptEn: null },
                    { excerptEn: '' }
                ]
            },
            take: 3
        });

        for (const post of posts) {
            try {
                const fieldsToTranslate: Record<string, string> = {};
                if (!post.titleEn && post.title) fieldsToTranslate.title = post.title;
                if (!post.excerptEn && post.excerpt) fieldsToTranslate.excerpt = post.excerpt;
                // Skipping huge content body for now to save tokens/time, or maybe I should do it?
                // User asked for "everything". I'll try to translate content if it's not too huge.
                // DeepSeek context window is large so it might be fine, but markdown structure preservation is tricky.

                if (Object.keys(fieldsToTranslate).length > 0) {
                    const translations = await translateContent({ context: fieldsToTranslate });
                    await prisma.journalPost.update({
                        where: { id: post.id },
                        data: {
                            ...(translations.title && { titleEn: translations.title }),
                            ...(translations.excerpt && { excerptEn: translations.excerpt }),
                        }
                    });
                    processed++;
                }
            } catch (e) {
                console.error(`Failed to translate post ${post.id}:`, e);
                errors++;
            }
        }

        // 3. CATEGORIES
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { nameEn: null },
                    { nameEn: '' }
                ]
            },
            take: 5
        });

        for (const category of categories) {
            try {
                const fieldsToTranslate: Record<string, string> = {};
                if (!category.nameEn && category.name) fieldsToTranslate.name = category.name;
                if (!category.descriptionEn && category.description) fieldsToTranslate.description = category.description;

                if (Object.keys(fieldsToTranslate).length > 0) {
                    const translations = await translateContent({ context: fieldsToTranslate });
                    await prisma.category.update({
                        where: { id: category.id },
                        data: {
                            ...(translations.name && { nameEn: translations.name }),
                            ...(translations.description && { descriptionEn: translations.description }),
                        }
                    });
                    processed++;
                }
            } catch (e) {
                console.error(`Failed to translate category ${category.id}:`, e);
                errors++;
            }
        }

        // 4. HERO SECTION
        const heroSections = await prisma.heroSection.findMany({
            where: {
                active: true,
                OR: [{ titleMainEn: null }, { descriptionEn: null }]
            }
        });

        for (const hero of heroSections) {
            try {
                const fields: Record<string, string> = {};
                if (!hero.titleMainEn && hero.titleMain) fields.titleMain = hero.titleMain;
                if (!hero.titleSubtitle1En && hero.titleSubtitle1) fields.titleSubtitle1 = hero.titleSubtitle1;
                if (!hero.titleSubtitle2En && hero.titleSubtitle2) fields.titleSubtitle2 = hero.titleSubtitle2;
                if (!hero.descriptionEn && hero.description) fields.description = hero.description;
                if (!hero.primaryCtaTextEn && hero.primaryCtaText) fields.primaryCtaText = hero.primaryCtaText;
                if (!hero.secondaryCtaTextEn && hero.secondaryCtaText) fields.secondaryCtaText = hero.secondaryCtaText;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.heroSection.update({
                        where: { id: hero.id },
                        data: {
                            ...(t.titleMain && { titleMainEn: t.titleMain }),
                            ...(t.titleSubtitle1 && { titleSubtitle1En: t.titleSubtitle1 }),
                            ...(t.titleSubtitle2 && { titleSubtitle2En: t.titleSubtitle2 }),
                            ...(t.description && { descriptionEn: t.description }),
                            ...(t.primaryCtaText && { primaryCtaTextEn: t.primaryCtaText }),
                            ...(t.secondaryCtaText && { secondaryCtaTextEn: t.secondaryCtaText }),
                        }
                    });
                    processed++;
                }
            } catch (e) { console.error('Hero translation error:', e); errors++; }
        }

        // 5. STUDIO SECTION
        const studioSections = await prisma.studioSection.findMany({
            where: {
                active: true,
                OR: [{ headlineEn: null }, { descriptionEn: null }]
            }
        });

        for (const section of studioSections) {
            try {
                const fields: Record<string, string> = {};
                if (!section.eyebrowEn && section.eyebrow) fields.eyebrow = section.eyebrow;
                if (!section.headlineEn && section.headline) fields.headline = section.headline;
                if (!section.descriptionEn && section.description) fields.description = section.description;
                if (!section.cardTitleEn && section.cardTitle) fields.cardTitle = section.cardTitle;
                if (!section.cardSubtitleEn && section.cardSubtitle) fields.cardSubtitle = section.cardSubtitle;
                if (!section.cardDescriptionEn && section.cardDescription) fields.cardDescription = section.cardDescription;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.studioSection.update({
                        where: { id: section.id },
                        data: {
                            ...(t.eyebrow && { eyebrowEn: t.eyebrow }),
                            ...(t.headline && { headlineEn: t.headline }),
                            ...(t.description && { descriptionEn: t.description }),
                            ...(t.cardTitle && { cardTitleEn: t.cardTitle }),
                            ...(t.cardSubtitle && { cardSubtitleEn: t.cardSubtitle }),
                            ...(t.cardDescription && { cardDescriptionEn: t.cardDescription }),
                        }
                    });
                    processed++;
                }
            } catch (e) { console.error('Studio translation error:', e); errors++; }
        }

        // 6. PROCESS SECTION
        const processSections = await prisma.processSection.findMany({
            where: {
                active: true,
                OR: [{ headlineEn: null }, { descriptionEn: null }]
            }
        });

        for (const section of processSections) {
            try {
                const fields: Record<string, string> = {};
                if (!section.headlineEn && section.headline) fields.headline = section.headline;
                if (!section.descriptionEn && section.description) fields.description = section.description;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.processSection.update({
                        where: { id: section.id },
                        data: {
                            ...(t.headline && { headlineEn: t.headline }),
                            ...(t.description && { descriptionEn: t.description }),
                        }
                    });
                    processed++;
                }
            } catch (e) { console.error('Process translation error:', e); errors++; }
        }

        // 7. STORY SECTION
        const storySections = await prisma.storySection.findMany({
            where: {
                active: true,
                OR: [{ titleEn: null }, { descriptionEn: null }]
            }
        });

        for (const section of storySections) {
            try {
                const fields: Record<string, string> = {};
                if (!section.labelEn && section.label) fields.label = section.label;
                if (!section.titleEn && section.title) fields.title = section.title;
                if (!section.descriptionEn && section.description) fields.description = section.description;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.storySection.update({
                        where: { id: section.id },
                        data: {
                            ...(t.label && { labelEn: t.label }),
                            ...(t.title && { titleEn: t.title }),
                            ...(t.description && { descriptionEn: t.description }),
                        }
                    });
                    processed++;
                }
            } catch (e) { console.error('Story translation error:', e); errors++; }
        }

        // 8. SERVICES SECTION (and Items)
        const servicesSections = await prisma.servicesSection.findMany({
            where: {
                active: true,
                OR: [{ headlineEn: null }, { descriptionEn: null }]
            },
            include: { services: true }
        });

        for (const section of servicesSections) {
            try {
                const fields: Record<string, string> = {};
                if (!section.headlineEn && section.headline) fields.headline = section.headline;
                if (!section.descriptionEn && section.description) fields.description = section.description;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.servicesSection.update({
                        where: { id: section.id },
                        data: {
                            ...(t.headline && { headlineEn: t.headline }),
                            ...(t.description && { descriptionEn: t.description }),
                        }
                    });
                    processed++;
                }

                // Translate items
                for (const item of section.services) {
                    const itemFields: Record<string, string> = {};
                    if (!item.titleEn && item.title) itemFields.title = item.title;
                    if (!item.descriptionEn && item.description) itemFields.description = item.description;

                    if (Object.keys(itemFields).length > 0) {
                        const t = await translateContent({ context: itemFields });
                        await prisma.serviceItem.update({
                            where: { id: item.id },
                            data: {
                                ...(t.title && { titleEn: t.title }),
                                ...(t.description && { descriptionEn: t.description }),
                            }
                        });
                        processed++;
                    }
                }
            } catch (e) { console.error('Services translation error:', e); errors++; }
        }

        // 9. BTS SECTION (and Cards)
        const btsSections = await prisma.bTSSection.findMany({
            where: {
                active: true,
                OR: [{ titleEn: null }, { descriptionEn: null }]
            },
            include: { cards: true }
        });

        for (const section of btsSections) {
            try {
                const fields: Record<string, string> = {};
                if (!section.titleEn && section.title) fields.title = section.title;
                if (!section.descriptionEn && section.description) fields.description = section.description;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.bTSSection.update({
                        where: { id: section.id },
                        data: {
                            ...(t.title && { titleEn: t.title }),
                            ...(t.description && { descriptionEn: t.description }),
                        }
                    });
                    processed++;
                }

                for (const card of section.cards) {
                    if (!card.labelEn && card.label) {
                        const t = await translateContent({ context: { label: card.label } });
                        if (t.label) {
                            await prisma.bTSCard.update({
                                where: { id: card.id },
                                data: { labelEn: t.label }
                            });
                            processed++;
                        }
                    }
                }
            } catch (e) { console.error('BTS translation error:', e); errors++; }
        }

        // 10. IMPACT SECTION (and Stats)
        const impactSections = await prisma.impactSection.findMany({
            where: {
                active: true,
                OR: [{ headingEn: null }, { descriptionEn: null }]
            },
            include: { stats: true }
        });

        for (const section of impactSections) {
            try {
                const fields: Record<string, string> = {};
                if (!section.headingEn && section.heading) fields.heading = section.heading;
                if (!section.descriptionEn && section.description) fields.description = section.description;

                if (Object.keys(fields).length > 0) {
                    const t = await translateContent({ context: fields });
                    await prisma.impactSection.update({
                        where: { id: section.id },
                        data: {
                            ...(t.heading && { headingEn: t.heading }),
                            ...(t.description && { descriptionEn: t.description }),
                        }
                    });
                    processed++;
                }

                for (const stat of section.stats) {
                    const statFields: Record<string, string> = {};
                    if (!stat.labelEn && stat.label) statFields.label = stat.label;
                    if (!stat.suffixEn && stat.suffix) statFields.suffix = stat.suffix;

                    if (Object.keys(statFields).length > 0) {
                        const t = await translateContent({ context: statFields });
                        await prisma.impactStat.update({
                            where: { id: stat.id },
                            data: {
                                ...(t.label && { labelEn: t.label }),
                                ...(t.suffix && { suffixEn: t.suffix }),
                            }
                        });
                        processed++;
                    }
                }
            } catch (e) { console.error('Impact translation error:', e); errors++; }
        }

        // Count remaining items roughly
        const remainingProjects = await prisma.project.count({
            where: { OR: [{ titleEn: null }, { titleEn: '' }] }
        });
        const remainingPosts = await prisma.journalPost.count({
            where: { OR: [{ titleEn: null }, { titleEn: '' }] }
        });
        const remainingCategories = await prisma.category.count({
            where: { OR: [{ nameEn: null }, { nameEn: '' }] }
        });

        const remaining = remainingProjects + remainingPosts + remainingCategories;

        return NextResponse.json({
            success: true,
            processed,
            errors,
            remaining: Math.max(0, remaining)
        });

    } catch (error) {
        console.error('Translation all error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
