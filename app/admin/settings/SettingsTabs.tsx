'use client';

import { useState } from 'react';
import { SiteConfig } from '@/lib/settings';
import { ThemeInfo } from '@/lib/themes';
import GeneralSettings from './GeneralSettings';
import LinkItemsSettings from './LinkItemsSettings';


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
    const [activeTab, setActiveTab] = useState<'general' | 'links'>('general');

    const tabs = [
        { id: 'general', label: 'General & SEO', icon: '⚙️' },
        { id: 'links', label: 'Custom Links', icon: '🔗' },
    ] as const;

    return (
        <div className="max-w-6xl mx-auto">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your portfolio configuration.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="w-full lg:w-64 shrink-0">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto bg-card backdrop-blur rounded-xl p-4 border border-border">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap w-full text-left flex-1 lg:flex-none ${activeTab === tab.id
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                <span className="text-lg w-6 flex justify-center shrink-0">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>


                <div className="flex-1 bg-card backdrop-blur-md border border-border rounded-2xl p-8 min-h-[500px]">
                    {activeTab === 'general' && <GeneralSettings config={config} />}
                    {activeTab === 'links' && <LinkItemsSettings links={links} />}
                </div>
            </div>
        </div>
    );
}
