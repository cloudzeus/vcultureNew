import { prisma } from '@/lib/prisma';
import MoviesClient from '../_components/MoviesClient';
import { Movie } from '../../data/movies';

export const revalidate = 0;

export default async function Page() {
    let projects: any[] = [];
    try {
        projects = await prisma.project.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { projectOrder: 'asc' },
            include: { category: true }
        });
    } catch (e) {
        console.error('Error fetching movies:', e);
        // Fallback to empty or could use mock data if desired
    }

    const movies: Movie[] = projects.map(p => ({
        id: p.id,
        title: p.title,
        titleEn: p.titleEn || undefined,
        subtitle: p.subcategory || '',
        subtitleEn: p.subcategoryEn || undefined,
        description: p.shortDescription,
        descriptionEn: p.shortDescriptionEn || undefined,
        category: p.category.name,
        categoryEn: p.category.nameEn || undefined,
        image: p.heroImageUrl || '',
        video: p.trailerUrl || '',
        year: p.year?.toString() || '',
        duration: p.duration || '',
        director: p.director || '',
        synopsis: p.fullDescription || '',
        synopsisEn: p.fullDescriptionEn || undefined,
    }));

    return <MoviesClient movies={movies} />;
}
