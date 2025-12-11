'use client';

import { updateTheme } from '@/app/lib/actions';
import { ThemeInfo } from '@/lib/themes';

export default function AppearanceSettings({ themes, currentThemeId }: { themes: ThemeInfo[], currentThemeId: string }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-white">Theme Selection</h3>
                <p className="text-gray-400 text-sm mt-1">Choose a visual theme that reflects your personality.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => (
                    <form key={theme.id} action={updateTheme.bind(null, theme.id)}>
                        <button
                            type="submit"
                            className={`w-full text-left rounded-xl border p-5 transition-all group relative overflow-hidden ${currentThemeId === theme.id
                                ? 'border-blue-500 bg-blue-900/20 ring-1 ring-blue-500 shadow-lg shadow-blue-900/20'
                                : 'border-gray-800 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-800/80 hover:shadow-xl'
                                }`}
                        >
                            {/* Theme Preview Gradient/Color */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

                            <div className="mb-4 flex items-center justify-between">
                                <div
                                    className="h-10 w-10 rounded-full border-2 shadow-sm flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        borderColor: theme.colors.foreground,
                                        color: theme.colors.foreground
                                    }}
                                >
                                    Aa
                                </div>
                                {currentThemeId === theme.id && (
                                    <span className="bg-blue-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">Active</span>
                                )}
                            </div>

                            <div>
                                <h3 className={`font-semibold mb-1 ${currentThemeId === theme.id ? 'text-blue-400' : 'text-white group-hover:text-blue-200'}`}>
                                    {theme.name}
                                </h3>
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                    {theme.description}
                                </p>
                            </div>

                            {/* Keywords tags */}
                            <div className="mt-4 flex flex-wrap gap-1">
                                {theme.keywords.slice(0, 2).map(keyword => (
                                    <span key={keyword} className="text-[10px] bg-black/30 text-gray-500 px-2 py-0.5 rounded border border-gray-800">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </button>
                    </form>
                ))}
            </div>
        </div>
    );
}
