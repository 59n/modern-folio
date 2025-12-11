import { createLink, deleteLink, toggleLinkActive, updateLinkOrder } from '@/app/lib/actions';
import { Icon } from '@/components/Icons';
import SubmitButton from '@/components/SubmitButton';
import { useOptimistic, useRef, useTransition } from 'react';

type LinkItem = {
    id: string;
    title: string;
    url: string;
    icon: string;
    type: string; // Added type
    active: boolean;
    order: number;
};

export default function LinkItemsSettings({ links }: { links: LinkItem[] }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === links.length - 1) return;

        const newLinks = [...links];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];

        // Update orders based on new index
        const updates = newLinks.map((link, i) => ({
            id: link.id,
            order: i,
        }));

        startTransition(async () => {
            await updateLinkOrder(updates);
        });
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h3 className="text-xl font-semibold text-white">Custom Links</h3>
                    <p className="text-gray-400 text-sm mt-1">Manage navigation items and social media profiles.</p>
                </div>
            </div>

            {/* Link List */}
            <div className="space-y-3">
                {links.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-lg text-gray-500">
                        No links added yet. Create one below!
                    </div>
                )}

                {links.map((link, index) => (
                    <div key={link.id} className="group bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition-all">
                        <div className="flex items-center gap-4 overflow-hidden">
                            {/* Reordering Buttons */}
                            <div className="flex flex-col gap-1 mr-2">
                                <button
                                    onClick={() => handleMove(index, 'up')}
                                    disabled={index === 0 || isPending}
                                    className="text-gray-600 hover:text-white disabled:opacity-30 disabled:hover:text-gray-600"
                                    aria-label="Move Up"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                </button>
                                <button
                                    onClick={() => handleMove(index, 'down')}
                                    disabled={index === links.length - 1 || isPending}
                                    className="text-gray-600 hover:text-white disabled:opacity-30 disabled:hover:text-gray-600"
                                    aria-label="Move Down"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                            </div>

                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xl shrink-0 ${link.type === 'SOCIAL' ? 'bg-purple-900/50' : 'bg-blue-900/50'}`}>
                                <Icon name={link.icon} className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-white truncate">{link.title}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${link.type === 'SOCIAL' ? 'border-purple-800 bg-purple-900/30 text-purple-400' : 'border-blue-800 bg-blue-900/30 text-blue-400'}`}>
                                        {link.type === 'SOCIAL' ? 'Social' : 'Nav'}
                                    </span>
                                </div>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
                                    {link.url}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${link.active ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                            </div>

                            <form action={deleteLink.bind(null, link.id)}>
                                <button type="submit" className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create New Link Form */}
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <h4 className="font-medium text-gray-200 mb-4 flex items-center gap-2">
                    <span className="bg-blue-600 w-1 h-5 rounded-full inline-block"></span>
                    Add New Link
                </h4>
                <form
                    action={async (formData) => {
                        await createLink(formData);
                        formRef.current?.reset();
                    }}
                    ref={formRef}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
                >
                    <div className="md:col-span-3 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                        <input name="title" required placeholder="e.g. My Twitter" className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm" />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">URL</label>
                        <input name="url" type="url" required placeholder="https://..." className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</label>
                        <select name="type" className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm appearance-none cursor-pointer">
                            <option value="NAV_ITEM">Nav Button</option>
                            <option value="SOCIAL">Social Icon</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Icon</label>
                        <select name="icon" className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none text-sm appearance-none cursor-pointer">
                            <option value="link">🔗 Link</option>
                            <option value="github">🐙 GitHub</option>
                            <option value="twitter">🐦 Twitter/X</option>
                            <option value="instagram">📸 Instagram</option>
                            <option value="linkedin">💼 LinkedIn</option>
                            <option value="youtube">📺 YouTube</option>
                            <option value="mail">✉️ Email</option>
                            <option value="discord">💬 Discord</option>
                            <option value="tiktok">🎵 TikTok</option>
                            <option value="spotify">🎧 Spotify</option>
                            <option value="twitch">👾 Twitch</option>
                            <option value="stackoverflow">💻 StackOverflow</option>
                            <option value="dribbble">🏀 Dribbble</option>
                            <option value="behance">🎨 Behance</option>
                            <option value="facebook">📘 Facebook</option>
                            <option value="home">🏠 Home</option>
                            <option value="user">👤 User</option>
                            <option value="file">📄 File</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 pt-2 flex justify-end">
                        <SubmitButton label="Add" />
                    </div>
                </form>
            </div>
        </div>
    );
}
