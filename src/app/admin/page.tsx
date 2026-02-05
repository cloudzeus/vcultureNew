import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "../_components/admin/AdminDashboard";

export default async function AdminPage() {
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    // Fetch dashboard stats
    const [projectsCount, journalCount, categoriesCount] = await Promise.all([
        prisma.project.count(),
        prisma.journalPost.count(),
        prisma.category.count(),
    ]);

    // Fetch recent projects
    const recentProjectsRaw = await prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
        },
    });

    // Serialize BigInt for the client component
    const recentProjects = recentProjectsRaw.map(project => ({
        ...project,
        totalViews: project.totalViews?.toString() || '0',
        instagramViews: project.instagramViews?.toString() || '0',
        youtubeViews: project.youtubeViews?.toString() || '0',
    }));

    return (
        <AdminDashboard
            stats={{
                projects: projectsCount,
                journal: journalCount,
                categories: categoriesCount,
            }}
            recentProjects={recentProjects}
        />
    );
}
