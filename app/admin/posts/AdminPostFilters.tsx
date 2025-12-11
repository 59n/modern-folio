'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/config/site'

interface FilterPost {
    tags?: string[]
    date: string
}

interface AdminPostFiltersProps {
    allPosts: FilterPost[] // This should be ALL posts derived metadata for dropdowns
    initialSearch?: string
    initialTag?: string
    initialYear?: string
    initialHasFiles?: string
}

export default function AdminPostFilters({ allPosts, initialSearch = '', initialTag = '', initialYear = '', initialHasFiles = '' }: AdminPostFiltersProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [selectedTag, setSelectedTag] = useState(initialTag)
    const [selectedYear, setSelectedYear] = useState(initialYear)
    const [hasFiles, setHasFiles] = useState(initialHasFiles)
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)

    // Sync state with URL params when they change
    useEffect(() => {
        setSearchQuery(initialSearch)
        setSelectedTag(initialTag)
        setSelectedYear(initialYear)
        setHasFiles(initialHasFiles)
    }, [initialSearch, initialTag, initialYear, initialHasFiles])

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
            }
        }
    }, [])

    // Get unique tags and years from ALL posts
    // Note: If post.tags is undefined in DB schema, this will handle it gracefully if mapped correctly.
    const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags || []))).sort()
    const allYears = Array.from(new Set(allPosts.map(post => new Date(post.date).getFullYear().toString()))).sort((a, b) => parseInt(b) - parseInt(a))

    const buildQueryString = (updates: { page?: number; search?: string; tag?: string; year?: string; hasFiles?: string }) => {
        const params = new URLSearchParams()
        if (updates.search) params.set('search', updates.search)
        if (updates.tag) params.set('tag', updates.tag)
        if (updates.year) params.set('year', updates.year)
        if (updates.hasFiles) params.set('hasFiles', updates.hasFiles)
        // Removed page logic as we typically reset to page 1 on filter, but preserved if useful.
        // Ideally admin table might use paging too, but current PostsTable is one big list?
        // User asked for "filters on post page", "post page" currently has "PostsTable" which lists *all* posts.
        // We will keep it simple.
        return params.toString() ? `?${params.toString()}` : ''
    }

    const updateURL = (search: string, tag: string, year: string, hasFiles: string) => {
        const newQuery = buildQueryString({
            search: search || undefined,
            tag: tag || undefined,
            year: year || undefined,
            hasFiles: hasFiles || undefined,
        })
        router.push(`/admin/posts${newQuery}`)
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => {
                            const value = e.target.value
                            setSearchQuery(value)

                            if (debounceTimer.current) clearTimeout(debounceTimer.current)

                            debounceTimer.current = setTimeout(() => {
                                updateURL(value, selectedTag, selectedYear, hasFiles)
                            }, 500)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (debounceTimer.current) clearTimeout(debounceTimer.current)
                                updateURL(searchQuery, selectedTag, selectedYear, hasFiles)
                            }
                        }}
                        className="w-full rounded-lg border bg-gray-900/40 px-4 py-3 text-sm transition-all duration-300 focus:border-gray-700/50 focus:bg-gray-800/60 focus:outline-none text-white border-gray-800 placeholder-gray-500"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Tag Filter */}
                    {allTags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedTag}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setSelectedTag(value)
                                    updateURL(searchQuery, value, selectedYear, hasFiles)
                                }}
                                className="rounded-lg border bg-gray-900/40 px-3 py-3 text-sm transition-all duration-300 focus:border-gray-700/50 focus:bg-gray-800/60 focus:outline-none text-white border-gray-800"
                            >
                                <option value="">All Tags</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Year Filter */}
                    {allYears.length > 0 && (
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setSelectedYear(value)
                                    updateURL(searchQuery, selectedTag, value, hasFiles)
                                }}
                                className="rounded-lg border bg-gray-900/40 px-3 py-3 text-sm transition-all duration-300 focus:border-gray-700/50 focus:bg-gray-800/60 focus:outline-none text-white border-gray-800"
                            >
                                <option value="">All Years</option>
                                {allYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Has Files Filter */}
                    <div className="flex items-center gap-2">
                        <select
                            value={hasFiles}
                            onChange={(e) => {
                                const value = e.target.value
                                setHasFiles(value)
                                updateURL(searchQuery, selectedTag, selectedYear, value)
                            }}
                            className="rounded-lg border bg-gray-900/40 px-3 py-3 text-sm transition-all duration-300 focus:border-gray-700/50 focus:bg-gray-800/60 focus:outline-none text-white border-gray-800"
                        >
                            <option value="">Has Files?</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {(selectedTag || selectedYear || searchQuery || hasFiles) && (
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedTag('')
                                setSelectedYear('')
                                setHasFiles('')
                                if (debounceTimer.current) clearTimeout(debounceTimer.current)
                                router.push('/admin/posts')
                            }}
                            className="rounded-lg border border-gray-800 px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 text-gray-400 hover:text-white"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}
