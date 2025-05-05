"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, LogOut, Menu, Settings, User, Check, Trash, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Tipos para notificações
type NotificationStatus = "unread" | "read"

type Notification = {
  id: number
  title: string
  description: string
  time: string
  date: string
  status: NotificationStatus
}

export function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Conta próxima do vencimento",
      description: "Aluguel - vence em 3 dias",
      time: "10:45",
      date: "Hoje",
      status: "unread",
    },
    {
      id: 2,
      title: "Investimento atualizado",
      description: "Tesouro Direto teve rendimento de 0,8%",
      time: "15:30",
      date: "Ontem",
      status: "unread",
    },
    {
      id: 3,
      title: "Orçamento excedido",
      description: "Categoria Alimentação está 15% acima do planejado",
      time: "08:15",
      date: "Ontem",
      status: "read",
    },
  ])
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null)
  const { state, toggleSidebar } = useSidebar()

  // Calcular o número de notificações não lidas
  const unreadCount = notifications.filter((notification) => notification.status === "unread").length

  // Marcar como lida
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, status: "read" } : notification)),
    )
  }

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, status: "read" })))
  }

  // Confirmar exclusão
  const confirmDelete = (id: number) => {
    setNotificationToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  // Excluir notificação
  const deleteNotification = () => {
    if (notificationToDelete !== null) {
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationToDelete))
      setIsDeleteConfirmOpen(false)
      setNotificationToDelete(null)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-gradient-to-r from-primary/5 to-blue-600/5 dark:from-primary/10 dark:to-blue-600/10 px-4 md:px-6">
      {/* Left side - Menu button (only visible when sidebar is collapsed) */}
      <div>
        {state === "collapsed" && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir Menu</span>
          </Button>
        )}
      </div>

      {/* Right side - Theme Toggle, Notifications and User */}
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle>Notificações</SheetTitle>
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              <SheetDescription>Suas notificações e alertas recentes</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-lg border p-4 hover:bg-accent/50 transition-colors relative ${
                      notification.status === "unread" ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.date}, {notification.time}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {notification.status === "unread" && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Marcar como lida
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => confirmDelete(notification.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-40 items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Não há notificações no momento</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Diálogo de confirmação de exclusão */}
        <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir notificação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteNotification} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
