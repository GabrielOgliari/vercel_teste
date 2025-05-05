"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LogIn,
  Menu,
  PiggyBank,
  Upload,
  Wallet,
  LineChart,
  Settings,
  Tags,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  // Don't show sidebar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Análise Financeira",
      icon: LineChart,
      href: "/analytics",
    },
    {
      title: "Contas a Receber",
      icon: Wallet,
      href: "/accounts-receivable",
    },
    {
      title: "Contas a Pagar",
      icon: CreditCard,
      href: "/accounts-payable",
    },
    {
      title: "Importar Extrato",
      icon: Upload,
      href: "/bank-statement",
    },
    {
      title: "De Para",
      icon: BarChart3,
      href: "/budget-comparison",
    },
    {
      title: "Investimentos",
      icon: PiggyBank,
      href: "/investments",
    },
    {
      title: "Categorias",
      icon: Tags,
      href: "/categories",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">NexMoney</h1>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
            <span className="sr-only">Minimizar</span>
          </Button>
        </div>
        <p className="text-xs text-sidebar-foreground/70">A nova geração de controle financeiro</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/login" className="flex items-center">
                <LogIn className="h-5 w-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
