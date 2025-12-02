import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { switchRole } from '../services/userService';
import { LogOut, Settings, UserCog } from 'lucide-react';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
  };

  const handleRoleChange = (roleId: number) => {
    switchRole(user.id, roleId)
      .then(() => {
        router.reload({
          onFinish: () => {
            cleanup();
          },
        });
      })
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo
            user={user}
            showEmail={true}
            role_name={user.active_role ? user.active_role : undefined}
          />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            href={edit()}
            as="button"
            prefetch
            onClick={cleanup}
          >
            <Settings className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          className="block w-full"
          href={logout()}
          as="button"
          method="post"
          onClick={handleLogout}
          data-test="logout-button"
        >
          <LogOut className="mr-2" />
          Log out
        </Link>
      </DropdownMenuItem>
      {user.roles && user.roles.length >= 2 && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Roles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.roles.map((role) => (
              <DropdownMenuItem
                key={role.id}
                onSelect={() => handleRoleChange(role.id)}
              >
                <UserCog className="mr-2" /> {role.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </>
      )}
    </>
  );
}
