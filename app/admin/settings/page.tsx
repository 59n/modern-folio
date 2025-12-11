import { prisma } from '@/lib/prisma';
import { themes } from '@/lib/themes';
import { updateTheme } from '@/app/lib/actions';

export default async function SettingsPage() {
    const settings = await prisma.settings.findUnique({
        where: { key: 'theme' },
    });
    const currentThemeId = settings?.value || 'default';

    // Fetch existing config for initial values
    const configSettings = await prisma.settings.findUnique({ where: { key: 'site_config' } });
    const savedConfig = configSettings?.value ? JSON.parse(configSettings.value) : {};

    // Helper to get value (fallback to defaults is handled in lib/settings, but we want to show CURRENT DB values in form if they exist, or defaults if not)
    // Actually, it's better to show the "Effective" value.
    const { getSiteConfig } = await import('@/lib/settings');
    const effectiveConfig = await getSiteConfig();

    return (
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-xl space-y-12">

            {/* Theme Section */}
            <section>
                <h2 className="text-3xl font-bold mb-8 text-white">Appearance</h2>
                <p className="text-gray-400 mb-6">Select the active theme for your portfolio.</p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {themes.map((theme) => (
                        <form key={theme.id} action={updateTheme.bind(null, theme.id)}>
                            <button
                                type="submit"
                                className={`w-full text-left rounded-lg border p-6 transition-all ${currentThemeId === theme.id
                                    ? 'border-blue-500 bg-blue-900/20 ring-1 ring-blue-500'
                                    : 'border-gray-800 bg-black/40 hover:border-gray-600 hover:bg-gray-800/60'
                                    }`}
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div
                                        className="h-6 w-6 rounded-full border-2"
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            borderColor: theme.colors.foreground,
                                        }}
                                    />
                                    <h3 className={`font-semibold ${currentThemeId === theme.id ? 'text-blue-400' : 'text-white'}`}>
                                        {theme.name}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-400">{theme.description}</p>
                            </button>
                        </form>
                    ))}
                </div>
            </section>

            {/* General Settings Section */}
            <section className="border-t border-gray-800 pt-12">
                <h2 className="text-2xl font-bold mb-6 text-white">General Settings</h2>
                <form action={async (formData) => {
                    'use server';
                    const { updateSiteConfig } = await import('@/app/lib/actions');
                    await updateSiteConfig(formData);
                }} className="space-y-6 max-w-2xl">

                    {/* General & SEO */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">General & SEO</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Site Name (Logo)</label>
                                <input name="name" defaultValue={effectiveConfig.name} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Site Title (Page Title)</label>
                                <input name="title" defaultValue={effectiveConfig.title} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Site Description</label>
                            <textarea name="description" defaultValue={effectiveConfig.description} rows={3} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Keywords (comma separated)</label>
                            <input name="meta_keywords" defaultValue={effectiveConfig.meta?.keywords?.join(', ')} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" placeholder="react, nextjs, portfolio" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Author Name</label>
                                <input name="author_name" defaultValue={effectiveConfig.author.name} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Author Email</label>
                                <input name="author_email" defaultValue={effectiveConfig.author.email} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Header Configuration */}
                    <div className="space-y-6 pt-6">
                        <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Header Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Header Title</label>
                                <input name="header_title" defaultValue={effectiveConfig.header.title} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Header Subtitle</label>
                                <input name="header_subtitle" defaultValue={effectiveConfig.header.subtitle} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <input type="checkbox" name="header_show_social" defaultChecked={effectiveConfig.header.showSocialIcons} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                Show Social Icons in Header
                            </label>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-6 pt-6">
                        <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Social Links & Navigation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">GitHub URL</label>
                                <input name="social_github" defaultValue={effectiveConfig.social.github} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Solo.to URL</label>
                                <input name="social_solo" defaultValue={effectiveConfig.social.solo} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Contact Email</label>
                                <input name="social_email" defaultValue={effectiveConfig.social.email} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3 p-4 border border-gray-800 rounded-lg bg-black/20">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-300">Nav: Blog Button</label>
                                    <input type="checkbox" name="nav_show_blog" defaultChecked={effectiveConfig.navigation.showBlogButton} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                </div>
                                <input name="nav_blog_label" defaultValue={effectiveConfig.navigation.blogLabel} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none text-sm" placeholder="Label (e.g. Blog)" />
                            </div>
                            <div className="space-y-3 p-4 border border-gray-800 rounded-lg bg-black/20">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-300">Nav: Projects Button</label>
                                    <input type="checkbox" name="nav_show_projects" defaultChecked={effectiveConfig.navigation.showProjectsButton} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                </div>
                                <input name="nav_projects_label" defaultValue={effectiveConfig.navigation.projectsLabel} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none text-sm" placeholder="Label (e.g. Projects)" />
                            </div>
                        </div>
                    </div>

                    {/* Blog Settings */}
                    <div className="space-y-6 pt-6">
                        <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Blog Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" name="blog_enabled" defaultChecked={effectiveConfig.blog.enabled} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                    Enable Blog Feature
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Posts Per Page</label>
                                <input type="number" name="blog_posts_per_page" defaultValue={effectiveConfig.blog.postsPerPage} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" name="blog_show_excerpt" defaultChecked={effectiveConfig.blog.showExcerpt} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                    Show Excerpts
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Projects Settings */}
                    <div className="space-y-6 pt-6">
                        <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Projects Settings</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <input type="checkbox" name="projects_enabled" defaultChecked={effectiveConfig.projects.enabled} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                Enable Projects Feature
                            </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">GitHub User (for fetch)</label>
                                <input name="projects_github_user" defaultValue={effectiveConfig.projects.githubUser} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Sort By</label>
                                <select name="projects_sort_by" defaultValue={effectiveConfig.projects.sortBy} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none">
                                    <option value="updated">Recently Updated</option>
                                    <option value="created">Recently Created</option>
                                    <option value="stars">Most Stars</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Projects Per Page</label>
                                <input type="number" name="projects_per_page" defaultValue={effectiveConfig.projects.perPage} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" name="projects_show_stars" defaultChecked={effectiveConfig.projects.showStars} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                    Show Stars
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" name="projects_show_language" defaultChecked={effectiveConfig.projects.showLanguage} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                    Show Language
                                </label>
                            </div>
                        </div>
                    </div>


                    {/* Footer */}
                    <div className="space-y-6 pt-6">
                        <h3 className="text-xl font-semibold text-gray-200 border-b border-gray-800 pb-2">Footer</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" name="footer_enabled" defaultChecked={effectiveConfig.footer.enabled} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                    Enable Footer
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" name="footer_show_logo" defaultChecked={effectiveConfig.footer.showLogo} className="w-4 h-4 rounded border-gray-800 bg-black/40" />
                                    Show Logo in Footer
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Footer Text (Copyright)</label>
                                <input name="footer_text" defaultValue={effectiveConfig.footer.copyright.text} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Footer Emojis</label>
                                <input name="footer_emojis" defaultValue={effectiveConfig.footer.emojis} className="w-full bg-black/40 border border-gray-800 rounded px-3 py-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>


                    <div className="pt-4">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded transition-colors">
                            Save Changes
                        </button>
                    </div>

                </form>
            </section>
        </div>
    );
}
