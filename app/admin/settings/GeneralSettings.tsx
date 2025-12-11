'use client';

import { updateSiteConfig, deleteFavicon } from '@/app/lib/actions';
import { SiteConfig } from '@/lib/settings';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Switch } from '@/components/ui/Switch';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

export default function GeneralSettings({ config }: { config: SiteConfig }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiValue, setEmojiValue] = useState<string>(config.footer.emojis);
    const [faviconVersion, setFaviconVersion] = useState(config.favicon?.version || 0);

    const onEmojiClick = (emojiData: any) => {
        setEmojiValue((prev) => prev + emojiData.emoji);
    };

    const handleDeleteFavicon = async () => {
        if (confirm('Are you sure you want to remove the custom favicon?')) {
            await deleteFavicon();
            setFaviconVersion(Date.now());
        }
    };

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    return (
        <form key={JSON.stringify(config)} action={async (formData) => {
            setStatus('loading');
            try {
                await updateSiteConfig(formData);
                setFaviconVersion(config.favicon?.version || 0);

                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } catch (error) {
                console.error(error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        }} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* ... form content ... */}

            {/* ... (keep existing sections) ... */}


            <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-secondary/20">
                    <h3 className="text-lg font-semibold text-foreground">Identity & Assets</h3>
                    <p className="text-sm text-muted-foreground">Basic site information and global assets.</p>
                </div>
                <div className="p-6 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Site Name (Logo Text)</label>
                            <input name="name" defaultValue={config.name} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Site Title (Browser Tab)</label>
                            <input name="title" defaultValue={config.title} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Site Description</label>
                        <textarea name="description" defaultValue={config.description} rows={3} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Keywords (comma separated)</label>
                        <input name="meta_keywords" defaultValue={config.meta?.keywords?.join(', ')} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" placeholder="react, nextjs, portfolio" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Author Name</label>
                            <input name="author_name" defaultValue={config.author.name} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Author Email</label>
                            <input name="author_email" defaultValue={config.author.email} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-2 border-t border-border/50 pt-4">
                        <label className="text-sm font-medium text-muted-foreground">Favicon / Site Icon (.ico, .png)</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {config.favicon?.enabled && (
                                <img
                                    src={`/favicon.ico?v=${faviconVersion}`}
                                    alt="Current Favicon"
                                    className="w-10 h-10 rounded border border-border object-contain bg-white/10"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M2 12h20'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E";
                                    }}
                                />
                            )}
                            <div className="flex flex-col gap-2">
                                <input type="file" name="favicon" accept=".ico,.png" className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all cursor-pointer" />
                                <button type="button" onClick={handleDeleteFavicon} className="text-xs text-red-400 hover:text-red-300 transition-colors text-left flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                    Remove Icon (Reset to Default)
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Upload a new file to replace the existing one.</p>
                    </div>
                </div>
            </div>


            <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-secondary/20">
                    <h3 className="text-lg font-semibold text-foreground">Header & Hero</h3>
                    <p className="text-sm text-muted-foreground">Customize the top section of your homepage.</p>
                </div>
                <div className="p-6 space-y-8">

                    <div className="flex flex-wrap gap-6 p-4 bg-secondary/10 rounded-lg border border-border/30">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                            <Switch name="header_show_social" defaultChecked={config.header.showSocialIcons} />
                            <span className="group-hover:text-foreground transition-colors">Show Social Icons</span>
                        </label>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Title Size</label>
                            <select name="header_title_size" defaultValue={config.header.titleSize || 'large'} className="w-full bg-secondary/50 border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary outline-none">
                                <option value="tiny">Tiny</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="extra-large">Extra Large</option>
                                <option value="huge">Huge</option>
                                <option value="gigantic">Gigantic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Subtitle Size</label>
                            <select name="header_subtitle_size" defaultValue={config.header.subtitleSize || 'medium'} className="w-full bg-secondary/50 border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary outline-none">
                                <option value="tiny">Tiny</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="extra-large">Extra Large</option>
                                <option value="huge">Huge</option>
                                <option value="gigantic">Gigantic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Description Size</label>
                            <select name="header_description_size" defaultValue={config.header.descriptionSize || 'small'} className="w-full bg-secondary/50 border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary outline-none">
                                <option value="tiny">Tiny</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="extra-large">Extra Large</option>
                                <option value="huge">Huge</option>
                                <option value="gigantic">Gigantic</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Icon Size</label>
                            <select name="header_icon_size" defaultValue={config.header.iconSize || 'medium'} className="w-full bg-secondary/50 border border-border rounded px-2 py-1.5 text-sm text-foreground focus:border-primary outline-none">
                                <option value="tiny">Tiny</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                                <option value="extra-large">Extra Large</option>
                                <option value="huge">Huge</option>
                                <option value="gigantic">Gigantic</option>
                            </select>
                        </div>
                    </div>


                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Hero Title</label>
                                <input name="header_title" defaultValue={config.header.title} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Hero Subtitle</label>
                                <input name="header_subtitle" defaultValue={config.header.subtitle} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Hero Description (Bio)</label>
                            <textarea
                                name="header_description"
                                defaultValue={Array.isArray(config.header.description) ? (config.header.description as string[]).join('\n') : config.header.description}
                                rows={3}
                                className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-secondary/20">
                    <h3 className="text-lg font-semibold text-foreground">Navigation Bar</h3>
                    <p className="text-sm text-muted-foreground">Manage the main navigation buttons.</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="p-4 rounded-lg border border-border/40 bg-background/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Blog Button</span>
                                <Switch name="nav_show_blog" defaultChecked={config.navigation.showBlogButton} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted-foreground font-bold">Label</label>
                                <input name="nav_blog_label" defaultValue={config.navigation.blogLabel} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground text-sm focus:border-primary outline-none" placeholder="e.g. Blog" />
                            </div>
                        </div>


                        <div className="p-4 rounded-lg border border-border/40 bg-background/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Projects Button</span>
                                <Switch name="nav_show_projects" defaultChecked={config.navigation.showProjectsButton} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase text-muted-foreground font-bold">Label</label>
                                <input name="nav_projects_label" defaultValue={config.navigation.projectsLabel} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground text-sm focus:border-primary outline-none" placeholder="e.g. Projects" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-secondary/20">
                    <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
                    <p className="text-sm text-muted-foreground">Your social media profiles.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">GitHub URL</label>
                        <input name="social_github" defaultValue={config.social.github} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Solo.to URL</label>
                        <input name="social_solo" defaultValue={config.social.solo} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                        <input name="social_email" defaultValue={config.social.email} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/50 bg-secondary/20 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-foreground">Blog Settings</h3>
                        <Switch name="blog_enabled" defaultChecked={config.blog.enabled} />
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                                <Switch name="blog_show_excerpt" defaultChecked={config.blog.showExcerpt} className="scale-75 origin-left" />
                                <span className="group-hover:text-foreground transition-colors">Show Excerpts on List</span>
                            </label>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Posts Per Page</label>
                                <input type="number" name="blog_posts_per_page" defaultValue={config.blog.postsPerPage} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border/50 bg-secondary/20 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-foreground">Projects Settings</h3>
                        <Switch name="projects_enabled" defaultChecked={config.projects.enabled} />
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-wrap gap-4">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                                <Switch name="projects_show_stars" defaultChecked={config.projects.showStars} className="scale-75 origin-left" />
                                <span className="group-hover:text-foreground transition-colors">Show Stars</span>
                            </label>
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                                <Switch name="projects_show_language" defaultChecked={config.projects.showLanguage} className="scale-75 origin-left" />
                                <span className="group-hover:text-foreground transition-colors">Show Language</span>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">GitHub User</label>
                                <input name="projects_github_user" defaultValue={config.projects.githubUser} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Projects Per Page</label>
                                <input type="number" name="projects_per_page" defaultValue={config.projects.perPage} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Sort By</label>
                            <select name="projects_sort_by" defaultValue={config.projects.sortBy} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none">
                                <option value="updated">Recently Updated</option>
                                <option value="created">Recently Created</option>
                                <option value="stars">Most Stars</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>



            <div className="bg-card/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-secondary/20 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Footer</h3>
                    <Switch name="footer_enabled" defaultChecked={config.footer.enabled} />
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex flex-wrap gap-6">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                            <Switch name="footer_show_logo" defaultChecked={config.footer.showLogo} className="scale-75 origin-left" />
                            <span className="group-hover:text-foreground transition-colors">Show Logo</span>
                        </label>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                            <Switch name="footer_show_copyright" defaultChecked={config.footer.showCopyright} className="scale-75 origin-left" />
                            <span className="group-hover:text-foreground transition-colors">Show Copyright</span>
                        </label>
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 cursor-pointer group">
                            <Switch name="footer_show_emojis" defaultChecked={config.footer.showEmojis} className="scale-75 origin-left" />
                            <span className="group-hover:text-foreground transition-colors">Show Emojis</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Copyright Text</label>
                            <input name="footer_text" defaultValue={config.footer.copyright.text} className="w-full bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground block">Footer Emojis</label>
                            <div className="flex gap-2">
                                <input
                                    name="footer_emojis"
                                    value={emojiValue}
                                    onChange={(e) => setEmojiValue(e.target.value)}
                                    className="flex-1 bg-secondary/50 border border-border rounded px-3 py-2 text-foreground focus:border-primary outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded border border-border text-lg"
                                >
                                    😀
                                </button>
                            </div>
                            {showEmojiPicker && (
                                <div className="absolute z-50 mt-2">
                                    <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                                    <div className="relative z-10">
                                        <EmojiPicker onEmojiClick={onEmojiClick} theme={'dark' as any} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-40 flex items-center justify-end md:pr-8 gap-4">
                {status === 'success' && (
                    <span className="text-green-500 font-medium animate-in fade-in slide-in-from-right-4">
                        Settings saved successfully!
                    </span>
                )}
                {status === 'error' && (
                    <span className="text-red-500 font-medium animate-in fade-in slide-in-from-right-4">
                        Failed to save settings.
                    </span>
                )}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                    {status === 'loading' ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>
        </form>
    );
}
