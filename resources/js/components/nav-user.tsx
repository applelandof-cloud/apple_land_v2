import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { ChevronsUpDown, Monitor, Sun, Moon, LayoutList, LayoutDashboard } from 'lucide-react';
import { useAppearance, Appearance, LayoutStyle } from '@/hooks/use-appearance';


export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const { updateAppearance, updateLayoutStyle } = useAppearance();

    const handleUpdateAppearance = (appearance: Appearance) => {
        updateAppearance(appearance);
    };

    const handleUpdateLayoutStyle = (layoutStyle: LayoutStyle) => {
        updateLayoutStyle(layoutStyle);
        router.visit(window.location.href, { preserveState: true });
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateAppearance('light')}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateAppearance('dark')}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateAppearance('system')}>
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Layout</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleUpdateLayoutStyle('sidebar')}>
                            <LayoutList className="mr-2 h-4 w-4" />
                            <span>Sidebar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateLayoutStyle('header')}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Header</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}