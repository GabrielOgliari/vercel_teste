"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, Lock, User, Bell, Palette, Shield, Database, Server, Key } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [databaseSaved, setDatabaseSaved] = useState(false)
  const { theme, setTheme } = useTheme()

  // State for appearance settings
  const [selectedTheme, setSelectedTheme] = useState("system")
  const [selectedAccentColor, setSelectedAccentColor] = useState("blue")
  const [selectedFontSize, setSelectedFontSize] = useState("medium")
  const [selectedLayout, setSelectedLayout] = useState("default")
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // State for database settings
  const [databaseType, setDatabaseType] = useState("mysql")
  const [databaseHost, setDatabaseHost] = useState("localhost")
  const [databasePort, setDatabasePort] = useState("3306")
  const [databaseName, setDatabaseName] = useState("nexmoney")
  const [databaseUser, setDatabaseUser] = useState("root")
  const [databasePassword, setDatabasePassword] = useState("")
  const [databaseConnectionString, setDatabaseConnectionString] = useState("")
  const [useConnectionString, setUseConnectionString] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | null>(null)

  // Load current theme settings on component mount
  useEffect(() => {
    if (theme) {
      setSelectedTheme(theme)
    }

    // Load other settings from localStorage if available
    const savedAccentColor = localStorage.getItem("accentColor") || "blue"
    const savedFontSize = localStorage.getItem("fontSize") || "medium"
    const savedLayout = localStorage.getItem("layout") || "default"
    const savedAnimations = localStorage.getItem("animations") !== "false"

    setSelectedAccentColor(savedAccentColor)
    setSelectedFontSize(savedFontSize)
    setSelectedLayout(savedLayout)
    setAnimationsEnabled(savedAnimations)

    // Apply saved settings
    applyAccentColor(savedAccentColor)
    applyFontSize(savedFontSize)
    applyLayout(savedLayout)
    applyAnimations(savedAnimations)

    // Load database settings from localStorage if available
    const savedDatabaseType = localStorage.getItem("databaseType") || "mysql"
    const savedDatabaseHost = localStorage.getItem("databaseHost") || "localhost"
    const savedDatabasePort = localStorage.getItem("databasePort") || "3306"
    const savedDatabaseName = localStorage.getItem("databaseName") || "nexmoney"
    const savedDatabaseUser = localStorage.getItem("databaseUser") || "root"
    const savedDatabaseConnectionString = localStorage.getItem("databaseConnectionString") || ""
    const savedUseConnectionString = localStorage.getItem("useConnectionString") === "true"

    setDatabaseType(savedDatabaseType)
    setDatabaseHost(savedDatabaseHost)
    setDatabasePort(savedDatabasePort)
    setDatabaseName(savedDatabaseName)
    setDatabaseUser(savedDatabaseUser)
    setDatabaseConnectionString(savedDatabaseConnectionString)
    setUseConnectionString(savedUseConnectionString)
  }, [theme])

  const handleSaveProfile = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)

      toast({
        title: "Perfil salvo",
        description: "Suas informações pessoais foram atualizadas com sucesso.",
      })
    }, 1000)
  }

  const handleChangePassword = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setPasswordChanged(true)
      setTimeout(() => setPasswordChanged(false), 3000)

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      })
    }, 1000)
  }

  // Apply theme
  const applyTheme = (newTheme) => {
    setTheme(newTheme)
    setSelectedTheme(newTheme)
  }

  // Apply accent color
  const applyAccentColor = (color) => {
    const root = document.documentElement

    // Remove existing color classes
    document.body.classList.remove("accent-blue", "accent-green", "accent-purple", "accent-orange", "accent-pink")

    // Add new color class
    document.body.classList.add(`accent-${color}`)

    // Store in localStorage
    localStorage.setItem("accentColor", color)
  }

  // Apply font size
  const applyFontSize = (size) => {
    const root = document.documentElement

    // Remove existing font size classes
    document.body.classList.remove("text-small", "text-medium", "text-large")

    // Add new font size class
    document.body.classList.add(`text-${size}`)

    // Store in localStorage
    localStorage.setItem("fontSize", size)
  }

  // Apply layout
  const applyLayout = (layout) => {
    const root = document.documentElement

    // Remove existing layout classes
    document.body.classList.remove("layout-default", "layout-compact", "layout-expanded")

    // Add new layout class
    document.body.classList.add(`layout-${layout}`)

    // Store in localStorage
    localStorage.setItem("layout", layout)
  }

  // Apply animations
  const applyAnimations = (enabled) => {
    if (enabled) {
      document.body.classList.remove("reduce-motion")
    } else {
      document.body.classList.add("reduce-motion")
    }

    // Store in localStorage
    localStorage.setItem("animations", enabled.toString())
  }

  // Handle appearance changes
  const handleApplyAppearance = () => {
    setIsLoading(true)

    // Apply all settings
    applyTheme(selectedTheme)
    applyAccentColor(selectedAccentColor)
    applyFontSize(selectedFontSize)
    applyLayout(selectedLayout)
    applyAnimations(animationsEnabled)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Aparência atualizada",
        description: "As configurações de aparência foram aplicadas com sucesso.",
      })
    }, 1000)
  }

  // Handle database settings
  const handleSaveDatabase = () => {
    setIsLoading(true)

    // Store in localStorage
    localStorage.setItem("databaseType", databaseType)
    localStorage.setItem("databaseHost", databaseHost)
    localStorage.setItem("databasePort", databasePort)
    localStorage.setItem("databaseName", databaseName)
    localStorage.setItem("databaseUser", databaseUser)
    localStorage.setItem("databaseConnectionString", databaseConnectionString)
    localStorage.setItem("useConnectionString", useConnectionString.toString())

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setDatabaseSaved(true)
      setTimeout(() => setDatabaseSaved(false), 3000)

      toast({
        title: "Configurações de banco de dados salvas",
        description: "As configurações de banco de dados foram salvas com sucesso.",
      })
    }, 1000)
  }

  // Test database connection
  const handleTestConnection = () => {
    setIsTestingConnection(true)
    setConnectionStatus(null)

    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false)
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3
      setConnectionStatus(success ? "success" : "error")

      toast({
        title: success ? "Conexão bem-sucedida" : "Falha na conexão",
        description: success
          ? "A conexão com o banco de dados foi estabelecida com sucesso."
          : "Não foi possível conectar ao banco de dados. Verifique as configurações.",
        variant: success ? "default" : "destructive",
      })
    }, 2000)
  }

  // Update port based on database type
  useEffect(() => {
    if (databaseType === "mysql") {
      setDatabasePort("3306")
    } else if (databaseType === "postgresql") {
      setDatabasePort("5432")
    } else if (databaseType === "mongodb") {
      setDatabasePort("27017")
    } else if (databaseType === "sqlite") {
      setDatabasePort("")
    }
  }, [databaseType])

  return (
    <div className="h-full w-full overflow-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[800px]">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Banco de Dados
          </TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações pessoais e de contato.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 98765-4321" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Data de Nascimento</Label>
                  <Input id="dob" type="date" defaultValue="1990-01-01" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue="Rua Exemplo, 123 - São Paulo, SP" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Profissão</Label>
                  <Input id="occupation" defaultValue="Engenheiro de Software" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Renda Mensal</Label>
                  <Input id="income" type="number" defaultValue="8000" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>

          {profileSaved && (
            <Alert className="mt-4 bg-success/10 text-success border-success">
              <Check className="h-4 w-4" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>Suas informações foram atualizadas com sucesso.</AlertDescription>
            </Alert>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Preferências Financeiras</CardTitle>
              <CardDescription>Configure suas preferências financeiras e objetivos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda Principal</Label>
                  <Select defaultValue="brl">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brl">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="usd">Dólar Americano ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savingsGoal">Meta de Economia Mensal (%)</Label>
                  <Input id="savingsGoal" type="number" defaultValue="20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="financialGoals">Objetivos Financeiros</Label>
                <Select defaultValue="retirement">
                  <SelectTrigger id="financialGoals">
                    <SelectValue placeholder="Selecione o objetivo principal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Aposentadoria</SelectItem>
                    <SelectItem value="house">Comprar uma casa</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="travel">Viagem</SelectItem>
                    <SelectItem value="emergency">Fundo de emergência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="budgetAlerts" defaultChecked />
                <Label htmlFor="budgetAlerts">Receber alertas quando ultrapassar o orçamento</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleChangePassword} disabled={isLoading}>
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </CardFooter>
          </Card>

          {passwordChanged && (
            <Alert className="mt-4 bg-success/10 text-success border-success">
              <Check className="h-4 w-4" />
              <AlertTitle>Senha alterada!</AlertTitle>
              <AlertDescription>Sua senha foi alterada com sucesso.</AlertDescription>
            </Alert>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
              <CardDescription>Adicione uma camada extra de segurança à sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Autenticação por SMS</p>
                    <p className="text-sm text-muted-foreground">Receba códigos de verificação por SMS</p>
                  </div>
                </div>
                <Switch id="2fa-sms" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Aplicativo Autenticador</p>
                    <p className="text-sm text-muted-foreground">Use um aplicativo como Google Authenticator</p>
                  </div>
                </div>
                <Switch id="2fa-app" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Chave de Segurança Física</p>
                    <p className="text-sm text-muted-foreground">Use uma chave de segurança como YubiKey</p>
                  </div>
                </div>
                <Switch id="2fa-key" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Configurar Autenticação
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>Gerencie os dispositivos conectados à sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Este dispositivo</p>
                    <p className="text-sm text-muted-foreground">Windows • Chrome • São Paulo, Brasil</p>
                    <p className="text-xs text-muted-foreground">Último acesso: Agora</p>
                  </div>
                  <Badge>Atual</Badge>
                </div>
              </div>
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">iPhone 13</p>
                    <p className="text-sm text-muted-foreground">iOS • Safari • São Paulo, Brasil</p>
                    <p className="text-xs text-muted-foreground">Último acesso: Ontem, 18:30</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Encerrar
                  </Button>
                </div>
              </div>
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">MacBook Pro</p>
                    <p className="text-sm text-muted-foreground">macOS • Firefox • Rio de Janeiro, Brasil</p>
                    <p className="text-xs text-muted-foreground">Último acesso: 15/04/2023, 10:15</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Encerrar
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full">
                Encerrar Todas as Outras Sessões
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Escolha como e quando deseja receber notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Notificações por Email</h3>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-transactions" className="flex-1">
                      Transações
                    </Label>
                    <Switch id="email-transactions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-bills" className="flex-1">
                      Contas a pagar próximas do vencimento
                    </Label>
                    <Switch id="email-bills" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-budget" className="flex-1">
                      Alertas de orçamento
                    </Label>
                    <Switch id="email-budget" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-investments" className="flex-1">
                      Atualizações de investimentos
                    </Label>
                    <Switch id="email-investments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-dividends" className="flex-1">
                      Pagamentos de dividendos
                    </Label>
                    <Switch id="email-dividends" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Notificações no Aplicativo</h3>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-transactions" className="flex-1">
                      Transações
                    </Label>
                    <Switch id="app-transactions" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-bills" className="flex-1">
                      Contas a pagar próximas do vencimento
                    </Label>
                    <Switch id="app-bills" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-budget" className="flex-1">
                      Alertas de orçamento
                    </Label>
                    <Switch id="app-budget" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-investments" className="flex-1">
                      Atualizações de investimentos
                    </Label>
                    <Switch id="app-investments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-dividends" className="flex-1">
                      Pagamentos de dividendos
                    </Label>
                    <Switch id="app-dividends" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Frequência de Resumos</h3>
                <div className="space-y-2">
                  <Label htmlFor="summary-frequency">Receber resumos financeiros</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="summary-frequency">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Personalização</CardTitle>
              <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color">Cor de Destaque</Label>
                <Select value={selectedAccentColor} onValueChange={setSelectedAccentColor}>
                  <SelectTrigger id="accent-color">
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Azul</SelectItem>
                    <SelectItem value="green">Verde</SelectItem>
                    <SelectItem value="purple">Roxo</SelectItem>
                    <SelectItem value="orange">Laranja</SelectItem>
                    <SelectItem value="pink">Rosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">Tamanho da Fonte</Label>
                <Select value={selectedFontSize} onValueChange={setSelectedFontSize}>
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeno</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="layout">Layout da Dashboard</Label>
                <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                  <SelectTrigger id="layout">
                    <SelectValue placeholder="Selecione o layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="compact">Compacto</SelectItem>
                    <SelectItem value="expanded">Expandido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                <Label htmlFor="animations">Ativar animações</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleApplyAppearance} disabled={isLoading}>
                {isLoading ? "Aplicando..." : "Aplicar Alterações"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Configurações Regionais</CardTitle>
              <CardDescription>Ajuste as configurações de idioma e formato.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Formato de Data</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="number-format">Formato de Número</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger id="number-format">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">1.000,00</SelectItem>
                    <SelectItem value="en-US">1,000.00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select defaultValue="America/Sao_Paulo">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecione o fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">Nova York (GMT-4)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+1)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Banco de Dados */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Banco de Dados</CardTitle>
              <CardDescription>Configure a conexão com o banco de dados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-connection-string"
                  checked={useConnectionString}
                  onCheckedChange={setUseConnectionString}
                />
                <Label htmlFor="use-connection-string">Usar string de conexão</Label>
              </div>

              {useConnectionString ? (
                <div className="space-y-2">
                  <Label htmlFor="connection-string">String de Conexão</Label>
                  <Input
                    id="connection-string"
                    value={databaseConnectionString}
                    onChange={(e) => setDatabaseConnectionString(e.target.value)}
                    placeholder="mysql://user:password@localhost:3306/database"
                  />
                  <p className="text-sm text-muted-foreground">
                    Exemplo: mysql://user:password@localhost:3306/database
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="database-type">Tipo de Banco de Dados</Label>
                    <Select value={databaseType} onValueChange={setDatabaseType}>
                      <SelectTrigger id="database-type">
                        <SelectValue placeholder="Selecione o tipo de banco de dados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mysql">MySQL</SelectItem>
                        <SelectItem value="postgresql">PostgreSQL</SelectItem>
                        <SelectItem value="mongodb">MongoDB</SelectItem>
                        <SelectItem value="sqlite">SQLite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="database-host">Host</Label>
                      <Input
                        id="database-host"
                        value={databaseHost}
                        onChange={(e) => setDatabaseHost(e.target.value)}
                        placeholder="localhost"
                        disabled={databaseType === "sqlite"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="database-port">Porta</Label>
                      <Input
                        id="database-port"
                        value={databasePort}
                        onChange={(e) => setDatabasePort(e.target.value)}
                        placeholder="3306"
                        disabled={databaseType === "sqlite"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="database-name">Nome do Banco de Dados</Label>
                    <Input
                      id="database-name"
                      value={databaseName}
                      onChange={(e) => setDatabaseName(e.target.value)}
                      placeholder="nexmoney"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="database-user">Usuário</Label>
                      <Input
                        id="database-user"
                        value={databaseUser}
                        onChange={(e) => setDatabaseUser(e.target.value)}
                        placeholder="root"
                        disabled={databaseType === "sqlite"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="database-password">Senha</Label>
                      <Input
                        id="database-password"
                        type="password"
                        value={databasePassword}
                        onChange={(e) => setDatabasePassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={databaseType === "sqlite"}
                      />
                    </div>
                  </div>
                </>
              )}

              {databaseType === "sqlite" && !useConnectionString && (
                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">SQLite</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    O SQLite é um banco de dados embutido que não requer configurações de servidor. O arquivo do banco
                    de dados será armazenado localmente.
                  </p>
                </div>
              )}

              {connectionStatus === "success" && (
                <Alert className="bg-success/10 text-success border-success">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Conexão bem-sucedida</AlertTitle>
                  <AlertDescription>A conexão com o banco de dados foi estabelecida com sucesso.</AlertDescription>
                </Alert>
              )}

              {connectionStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Falha na conexão</AlertTitle>
                  <AlertDescription>
                    Não foi possível conectar ao banco de dados. Verifique as configurações e tente novamente.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="w-full sm:w-auto"
              >
                {isTestingConnection ? "Testando..." : "Testar Conexão"}
              </Button>
              <Button onClick={handleSaveDatabase} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardFooter>
          </Card>

          {databaseSaved && (
            <Alert className="mt-4 bg-success/10 text-success border-success">
              <Check className="h-4 w-4" />
              <AlertTitle>Configurações salvas!</AlertTitle>
              <AlertDescription>As configurações de banco de dados foram salvas com sucesso.</AlertDescription>
            </Alert>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
              <CardDescription>Gerencie backups do seu banco de dados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Backup Automático</p>
                    <p className="text-sm text-muted-foreground">Realize backups automáticos do seu banco de dados</p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Frequência de Backup</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">A cada hora</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="monthly">Mensalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-retention">Retenção de Backup</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="backup-retention">
                    <SelectValue placeholder="Selecione o período de retenção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="365">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Key className="mr-2 h-4 w-4" />
                  Backup Manual
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Server className="mr-2 h-4 w-4" />
                  Restaurar Backup
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Salvar Configurações de Backup</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
