'use client';

import { updateSiteConfig } from '@/app/lib/actions';
import { SiteConfig } from '@/lib/settings';

export default function GeneralSettings({ config }: { config: SiteConfig }) {
    return (
        <form action={updateSiteConfig} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* General & SEO */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">General & SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Site Name (Logo)</label>
                        <input name="name" defaultValue={config.name} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Site Title (Page Title)</label>
                        <input name="title" defaultValue={config.title} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Site Description</label>
                    <textarea name="description" defaultValue={config.description} rows={3} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Keywords (comma separated)</label>
                    <input name="meta_keywords" defaultValue={config.meta?.keywords?.join(', ')} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="react, nextjs, portfolio" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Author Name</label>
                        <input name="author_name" defaultValue={config.author.name} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Author Email</label>
                        <input name="author_email" defaultValue={config.author.email} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                </div>
            </div>

            {/* Header Configuration */}
            <div className="space-y-6 pt-6">
                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Header Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Header Title</label>
                        <input name="header_title" defaultValue={config.header.title} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Header Subtitle</label>
                        <input name="header_subtitle" defaultValue={config.header.subtitle} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" name="header_show_social" defaultChecked={config.header.showSocialIcons} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                        <span className="group-hover:text-white transition-colors">Show Social Icons in Header</span>
                    </label>
                </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6 pt-6">
                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Social Links & Navigation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">GitHub URL</label>
                        <input name="social_github" defaultValue={config.social.github} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Solo.to URL</label>
                        <input name="social_solo" defaultValue={config.social.solo} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Contact Email</label>
                        <input name="social_email" defaultValue={config.social.email} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3 p-4 border border-gray-800 rounded-lg bg-black/20 hover:border-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300">Nav: Blog Button</label>
                            <input type="checkbox" name="nav_show_blog" defaultChecked={config.navigation.showBlogButton} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                        </div>
                        <input name="nav_blog_label" defaultValue={config.navigation.blogLabel} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none text-sm focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="Label (e.g. Blog)" />
                    </div>
                    <div className="space-y-3 p-4 border border-gray-800 rounded-lg bg-black/20 hover:border-gray-700 transition-colors">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300">Nav: Projects Button</label>
                            <input type="checkbox" name="nav_show_projects" defaultChecked={config.navigation.showProjectsButton} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                        </div>
                        <input name="nav_projects_label" defaultValue={config.navigation.projectsLabel} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none text-sm focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="Label (e.g. Projects)" />
                    </div>
                </div>
            </div>

            {/* Blog Settings */}
            <div className="space-y-6 pt-6">
                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Blog Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="blog_enabled" defaultChecked={config.blog.enabled} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                            <span className="group-hover:text-white transition-colors">Enable Blog Feature</span>
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Posts Per Page</label>
                        <input type="number" name="blog_posts_per_page" defaultValue={config.blog.postsPerPage} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="blog_show_excerpt" defaultChecked={config.blog.showExcerpt} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                            <span className="group-hover:text-white transition-colors">Show Excerpts</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Projects Settings */}
            <div className="space-y-6 pt-6">
                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Projects Settings</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" name="projects_enabled" defaultChecked={config.projects.enabled} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                        <span className="group-hover:text-white transition-colors">Enable Projects Feature</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">GitHub User (for fetch)</label>
                        <input name="projects_github_user" defaultValue={config.projects.githubUser} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Sort By</label>
                        <select name="projects_sort_by" defaultValue={config.projects.sortBy} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                            <option value="updated">Recently Updated</option>
                            <option value="created">Recently Created</option>
                            <option value="stars">Most Stars</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Projects Per Page</label>
                        <input type="number" name="projects_per_page" defaultValue={config.projects.perPage} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="projects_show_stars" defaultChecked={config.projects.showStars} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                            <span className="group-hover:text-white transition-colors">Show Stars</span>
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="projects_show_language" defaultChecked={config.projects.showLanguage} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                            <span className="group-hover:text-white transition-colors">Show Language</span>
                        </label>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <div className="space-y-6 pt-6">
                <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Footer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="footer_enabled" defaultChecked={config.footer.enabled} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                            <span className="group-hover:text-white transition-colors">Enable Footer</span>
                        </label>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" name="footer_show_logo" defaultChecked={config.footer.showLogo} className="w-4 h-4 rounded border-gray-800 bg-black/40 text-blue-600 focus:ring-blue-500 transition-all" />
                            <span className="group-hover:text-white transition-colors">Show Logo in Footer</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Footer Text (Copyright)</label>
                        <input name="footer_text" defaultValue={config.footer.copyright.text} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Footer Emojis</label>
                        <input name="footer_emojis" defaultValue={config.footer.emojis} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                    </div>
                </div>
            </div>


            <div className="pt-4 sticky bottom-6 z-10">
                <button type="submit" className="w-full md:w-auto shadow-lg bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Save All Changes
                </button>
            </div>

        </form>
    );
}
