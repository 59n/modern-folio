'use client';

import { useState } from 'react';
import { SiteConfig } from '@/lib/settings';
import { ThemeInfo } from '@/lib/themes';
import GeneralSettings from './GeneralSettings';
import LinkItemsSettings from './LinkItemsSettings';
import AppearanceSettings from './AppearanceSettings';

// Define Link Item type locally or import if shared
type LinkItem = {
    id: string;
    title: string;
    url: string;
    icon: string;
    type: string;
    active: boolean;
    order: number;
};

type SettingsLayoutProps = {
    config: SiteConfig;
    themes: ThemeInfo[];
    currentThemeId: string;
    links: LinkItem[];
};

export default function SettingsTabs({ config, themes, currentThemeId, links }: SettingsLayoutProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'links' | 'appearance'>('general');

    const tabs = [
        { id: 'general', label: 'General & SEO', icon: '⚙️' },
        { id: 'links', label: 'Custom Links', icon: '🔗' },
        { id: 'appearance', label: 'Appearance', icon: '🎨' },
    ] as const;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Manage your portfolio configuration.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 bg-gray-900/50 backdrop-blur rounded-xl p-2 border border-gray-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 min-h-[500px]">
                    {activeTab === 'general' && <GeneralSettings config={config} />}
                    {activeTab === 'links' && <LinkItemsSettings links={links} />}
                    {activeTab === 'appearance' && <AppearanceSettings themes={themes} currentThemeId={currentThemeId} />}
                </div>
            </div>
        </div>
    );
}
