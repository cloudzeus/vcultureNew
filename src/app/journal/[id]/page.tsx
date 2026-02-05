import JournalPostClient from '../../_components/JournalPostClient';

export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return <JournalPostClient postId={resolvedParams.id} />;
}
