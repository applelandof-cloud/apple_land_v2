import { Appearance, LayoutStyle, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LayoutList, LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance, layoutStyle, updateLayoutStyle } = useAppearance();

    const themeTabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    const layoutTabs: { value: LayoutStyle; icon: LucideIcon; label: string }[] = [
        { value: 'sidebar', icon: LayoutList, label: 'Sidebar' },
        { value: 'header', icon: LayoutDashboard, label: 'Header' },
    ];

    return (
        <div className={cn('space-y-4', className)} {...props}>
            <div>
                <h3 className="mb-2 text-sm font-medium">Theme</h3>
                <div
                    className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800"
                >
                    {themeTabs.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={() => updateAppearance(value)}
                            className={cn(
                                'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                                appearance === value
                                    ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                            )}
                        >
                            <Icon className="-ml-1 h-4 w-4" />
                            <span className="ml-1.5 text-sm">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="mb-2 text-sm font-medium">Layout</h3>
                <div
                    className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800"
                >
                    {layoutTabs.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={() => updateLayoutStyle(value)}
                            className={cn(
                                'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                                layoutStyle === value
                                    ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                            )}
                        >
                            <Icon className="-ml-1 h-4 w-4" />
                            <span className="ml-1.5 text-sm">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
