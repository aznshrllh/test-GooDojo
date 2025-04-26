"use client";

import * as React from "react";
import { LogOut, UserCircle, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { navigationItems } from "@/config/navigation";

// User data
const userData = {
  name: "HR Admin",
  email: "admin@goodojo.com",
};

export function HRSidebar() {
  const pathname = usePathname();

  // Check if a path is active (exact match or starts with the path)
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/" className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    GD
                  </AvatarFallback>
                </Avatar>
                <div className="font-semibold text-lg">GooDojo HR</div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.description || item.title}
                  isActive={isActive(item.path)}
                >
                  <Link href={item.path}>
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full gap-2 p-2 rounded-md transition-colors hover:bg-sidebar-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      HA
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">{userData.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {userData.email}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserCircle className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
