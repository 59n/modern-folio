import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Simple helper to format bytes
function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Simple Stat Card Component
function StatCard({ title, value, subtext }: { title: string, value: string | number, subtext?: string }) {
    return (
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    // 1. Fetch Post Stats
    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({ where: { published: true } });
    const draftPosts = totalPosts - publishedPosts;

    // 2. Fetch Attachment Stats
    const totalAttachments = await prisma.attachment.count();
    const attachmentStats = await prisma.attachment.aggregate({
        _sum: { size: true }
    });
    const totalStorage = attachmentStats._sum.size || 0;

    // 3. Calculate Content Volume (Approximate)
    const allPosts = await prisma.post.findMany({
        select: { content: true }
    });

    let totalWords = 0;
    allPosts.forEach(post => {
        // Simple word count: split by spaces
        if (post.content) {
            totalWords += post.content.trim().split(/\s+/).length;
        }
    });

    const avgWords = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0;

    // 4. Recent Activity (Last valid published post date)
    const lastPost = await prisma.post.findFirst({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
    });

    const lastActive = lastPost
        ? new Date(lastPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Never';


    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Analytics</h2>
                    <p className="text-gray-400 mt-2">Content performance and statistics</p>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Posts"
                    value={totalPosts}
                    subtext={`${publishedPosts} Published · ${draftPosts} Drafts`}
                />
                <StatCard
                    title="Total Words"
                    value={totalWords.toLocaleString()}
                    subtext={`~${avgWords} words per post`}
                />
                <StatCard
                    title="Attachments"
                    value={totalAttachments}
                    subtext={`${formatBytes(totalStorage)} used`}
                />
                <StatCard
                    title="Last Activity"
                    value={lastActive}
                    subtext="Most recent publication"
                />
            </div>

            {/* Deep Dive Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Publishing Status */}
                <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-6">Publishing Status</h3>
                    <div className="space-y-4">
                        {/* Published Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Published</span>
                                <span className="text-gray-400">
                                    {totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Draft Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Drafts</span>
                                <span className="text-gray-400">
                                    {totalPosts > 0 ? Math.round((draftPosts / totalPosts) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full"
                                    style={{ width: `${totalPosts > 0 ? (draftPosts / totalPosts) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Distribution (Placeholder for future) */}
                <div className="p-8 bg-gray-900/50 rounded-xl border border-gray-800 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Traffic Analytics</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                        Page view tracking is not yet enabled.
                        Integration with Vercel Analytics or plausible.io recommended.
                    </p>
                </div>

            </div>
        </div>
    );
}
