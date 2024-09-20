"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout as logoutAction } from "@/auth/logout";

export const UserButton = () => {
  const logout = useMutation({
    mutationFn: logoutAction,
  });
  const pathname = usePathname().replace("/", "");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="absolute right-5 top-5">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeSwitchMenu />
        <DropdownMenuItem
          disabled={logout.isPending}
          onClick={() => logout.mutate(pathname)}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ThemeSwitchMenu = () => {
  const { setTheme, resolvedTheme: theme } = useTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {theme === "dark" ? (
          <Sun className="mr-2 h-4 w-4" />
        ) : (
          <Moon className="mr-2 h-4 w-4" />
        )}
        <span>Change Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
