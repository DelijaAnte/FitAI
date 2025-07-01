"use client";

import * as React from "react";
import { Dumbbell, Flame, Bot, Gauge } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useAuth } from "@/app/context/auth-context";

const data = {
  teams: [
    {
      name: "Ante Delija",
      logo: Dumbbell,
      plan: "Kreator",
    },
  ],
  navMain: [
    {
      title: "Početna",
      url: "/",
      icon: Gauge,
      isActive: true,
      items: [],
    },
    {
      title: "Vježbe",
      url: "/vjezbe",
      icon: Dumbbell,
      items: [],
    },
    {
      title: "AI Trener",
      url: "/aitrener",
      icon: Bot,
      items: [],
    },
    {
      title: "Kalorijski kalkulator",
      url: "/prehrana",
      icon: Flame,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navUser = {
    name: user?.displayName || "Nepoznato ime",
    email: user?.email || "Nepoznata e-pošta",
    avatar: user?.photoURL || "/avatars/default.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
