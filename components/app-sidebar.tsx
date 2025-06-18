"use client";

import * as React from "react";
import { Dumbbell, Flame, Bot, Gauge, Settings2 } from "lucide-react";

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

const data = {
  user: {
    name: "Korisnik",
    email: "korisnik@fitai.com",
    avatar: "/avatars/default.jpg",
  },
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
    {
      title: "Postavke",
      url: "/postavke",
      icon: Settings2,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
