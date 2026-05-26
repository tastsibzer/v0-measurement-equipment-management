"use client"

import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Check,
  X,
  Search,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Settings,
  QrCode,
  Edit,
  MoreHorizontal,
  Menu,
  ChevronRight,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  Palette,
  Type,
  AlertCircle,
  Clock,
  Bell,
  Plus,
  Building,
  DoorOpen,
  Archive,
  Eye,
  UserCheck,
  Shield,
  TrendingUp,
  Calendar,
  FolderTree,
  Trash2,
  Star,
  Camera,
  UserPlus,
  ArrowLeftRight,
  RotateCcw,
  History,
} from "lucide-react"

// ============================================
// TYPE DEFINITIONS
// English comments explain structure and logic
// ============================================

// User role types for role-based access control
type UserRole = "Administrator" | "Właściciel" | "Wypożyczający" | "Obserwator"

// Authentication state machine
type AuthStatus = "LoggedOut" | "LoggedIn" | "PendingApproval"

// Theme settings types
type ThemeMode = "light" | "dark"
type FontFamily = "sans" | "serif" | "mono"
type AccentColor = "agh-green" | "blue" | "purple" | "orange"

// Navigation item structure
type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  roles: UserRole[] // Which roles can see this nav item
}

// Global state context type
type GlobalStateContextType = {
  currentUserRole: UserRole
  setCurrentUserRole: (role: UserRole) => void
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  font: FontFamily
  setFont: (font: FontFamily) => void
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
  authStatus: AuthStatus
  setAuthStatus: (status: AuthStatus) => void
}

// ============================================
// CONSTANTS & MOCK DATA
// ============================================

// Color definitions for accent colors
const ACCENT_COLORS: Record<AccentColor, { hex: string; name: string }> = {
  "agh-green": { hex: "#00693C", name: "AGH Zielony (Domyślny)" },
  "blue": { hex: "#2563eb", name: "Niebieski" },
  "purple": { hex: "#7c3aed", name: "Fioletowy" },
  "orange": { hex: "#ea580c", name: "Pomarańczowy" },
}

// Mock data for pending user registrations
const mockPendingUsers = [
  { id: "1", name: "Maria Nowak", email: "maria.nowak@agh.edu.pl", date: "2024-01-15" },
  { id: "2", name: "Piotr Kowalczyk", email: "piotr.kowalczyk@agh.edu.pl", date: "2024-01-14" },
  { id: "3", name: "Anna Wiśniewska", email: "anna.wisniewska@agh.edu.pl", date: "2024-01-13" },
]

// Mock data for registered users
const mockRegisteredUsers = [
  { id: "u1", name: "Dr. Jan Kowalski", email: "jan.kowalski@agh.edu.pl", role: "Właściciel" as UserRole, trusted: true },
  { id: "u2", name: "Prof. Maria Wiśniewska", email: "maria.wisniewska@agh.edu.pl", role: "Właściciel" as UserRole, trusted: true },
  { id: "u3", name: "Tomasz Zieliński", email: "tomasz.zielinski@agh.edu.pl", role: "Wypożyczający" as UserRole, trusted: false },
  { id: "u4", name: "Agnieszka Krawczyk", email: "agnieszka.krawczyk@agh.edu.pl", role: "Obserwator" as UserRole, trusted: false },
]

// Mock data for equipment inventory
const mockEquipment = [
  { id: "AGH-001", name: "Mikroskop Elektronowy TEM-2000", category: "Optyka > Mikroskopy", location: "B1 > Sala 204 > Szafa A1", owner: "Dr. Jan Kowalski", status: "Dostępny" as const, borrower: null },
  { id: "AGH-002", name: "Oscyloskop Cyfrowy DS-4000", category: "Elektronika > Oscyloskopy", location: "C3 > Sala 112 > Szafa B2", owner: "Dr. Anna Nowak", status: "Wypożyczony" as const, borrower: "Tomasz Zieliński" },
  { id: "AGH-003", name: "Analizator Widma SA-500", category: "Elektronika > Analizatory", location: "B1 > Sala 105 > Szafa A3", owner: "Prof. Maria Wiśniewska", status: "Opóźnienie" as const, borrower: "Piotr Kowalczyk" },
  { id: "AGH-004", name: "Interferometr Laserowy LI-100", category: "Optyka > Lasery", location: "A2 > Sala 301 > Szafa C1", owner: "Dr. Piotr Zieliński", status: "Dostępny" as const, borrower: null },
  { id: "AGH-005", name: "Dyfraktometr Rentgenowski XRD-7000", category: "Materiałoznawstwo", location: "D1 > Sala 401 > Szafa D2", owner: "Prof. Ewa Kowalczyk", status: "Wypożyczony" as const, borrower: "Maria Nowak" },
  { id: "AGH-006", name: "Kamera Termowizyjna TC-PRO", category: "Elektronika > Obrazowanie", location: "B1 > Sala 204 > Szafa A2", owner: "Dr. Jan Kowalski", status: "Opóźnienie" as const, borrower: "Anna Wiśniewska" },
]

// Mock borrowing requests data
const mockBorrowingRequests = [
  { id: "req1", equipmentId: "AGH-001", equipmentName: "Mikroskop Elektronowy TEM-2000", requestedBy: "Tomasz Zieliński", requestDate: "2024-01-18", startDate: "2024-01-20", endDate: "2024-01-25", status: "Oczekujący" as const },
  { id: "req2", equipmentId: "AGH-004", equipmentName: "Interferometr Laserowy LI-100", requestedBy: "Maria Nowak", requestDate: "2024-01-17", startDate: "2024-01-22", endDate: "2024-01-30", status: "Oczekujący" as const },
]

// Mock active borrowings
const mockActiveBorrowings = [
  { id: "bor1", equipmentId: "AGH-002", equipmentName: "Oscyloskop Cyfrowy DS-4000", borrower: "Tomasz Zieliński", startDate: "2024-01-10", endDate: "2024-01-20", owner: "Dr. Anna Nowak", isDelayed: false },
  { id: "bor2", equipmentId: "AGH-003", equipmentName: "Analizator Widma SA-500", borrower: "Piotr Kowalczyk", startDate: "2024-01-05", endDate: "2024-01-15", owner: "Prof. Maria Wiśniewska", isDelayed: true },
  { id: "bor3", equipmentId: "AGH-006", equipmentName: "Kamera Termowizyjna TC-PRO", borrower: "Anna Wiśniewska", startDate: "2024-01-08", endDate: "2024-01-14", owner: "Dr. Jan Kowalski", isDelayed: true },
]

// Mock categories tree structure
const mockCategories = [
  { id: "cat1", name: "Elektronika", children: [
    { id: "cat1-1", name: "Oscyloskopy", children: [] },
    { id: "cat1-2", name: "Analizatory", children: [] },
    { id: "cat1-3", name: "Obrazowanie", children: [] },
  ]},
  { id: "cat2", name: "Optyka", children: [
    { id: "cat2-1", name: "Mikroskopy", children: [] },
    { id: "cat2-2", name: "Lasery", children: [] },
  ]},
  { id: "cat3", name: "Materiałoznawstwo", children: [] },
]

// Mock locations tree structure
const mockLocations = [
  { id: "loc1", name: "Budynek A2", children: [
    { id: "loc1-1", name: "Sala 301", children: [
      { id: "loc1-1-1", name: "Szafa C1", children: [] },
    ]},
  ]},
  { id: "loc2", name: "Budynek B1", children: [
    { id: "loc2-1", name: "Sala 105", children: [
      { id: "loc2-1-1", name: "Szafa A3", children: [] },
    ]},
    { id: "loc2-2", name: "Sala 204", children: [
      { id: "loc2-2-1", name: "Szafa A1", children: [] },
      { id: "loc2-2-2", name: "Szafa A2", children: [] },
    ]},
  ]},
  { id: "loc3", name: "Budynek C3", children: [
    { id: "loc3-1", name: "Sala 112", children: [
      { id: "loc3-1-1", name: "Szafa B2", children: [] },
    ]},
  ]},
  { id: "loc4", name: "Budynek D1", children: [
    { id: "loc4-1", name: "Sala 401", children: [
      { id: "loc4-1-1", name: "Szafa D2", children: [] },
    ]},
  ]},
]

// Mock notifications
const mockNotifications = [
  { id: "n1", message: "Nowy wniosek o wypożyczenie: Mikroskop Elektronowy TEM-2000", time: "5 min temu", read: false },
  { id: "n2", message: "Opóźniony zwrot: Analizator Widma SA-500", time: "2 godz. temu", read: false },
  { id: "n3", message: "Wniosek o rejestrację: Maria Nowak", time: "1 dzień temu", read: true },
]

// Navigation items with role-based visibility
const navItems: NavItem[] = [
  { id: "dashboard", label: "Panel główny", icon: <LayoutDashboard className="h-5 w-5" />, description: "Statystyki", roles: ["Administrator", "Właściciel"] },
  { id: "equipment", label: "Inwentarz sprzętu", icon: <Package className="h-5 w-5" />, description: "Lista urządzeń", roles: ["Administrator", "Właściciel", "Wypożyczający", "Obserwator"] },
  { id: "borrowings", label: "Centrum wypożyczeń", icon: <ArrowLeftRight className="h-5 w-5" />, description: "Wnioski i zwroty", roles: ["Administrator", "Właściciel", "Wypożyczający"] },
  { id: "locations", label: "Lokalizacje i Kategorie", icon: <MapPin className="h-5 w-5" />, description: "Drzewo lokalizacji", roles: ["Administrator", "Właściciel"] },
  { id: "users", label: "Zarządzanie użytkownikami", icon: <Users className="h-5 w-5" />, description: "Role i rejestracje", roles: ["Administrator"] },
]

// ============================================
// GLOBAL STATE CONTEXT
// ============================================

// Create context with default values
const GlobalStateContext = createContext<GlobalStateContextType>({
  currentUserRole: "Administrator",
  setCurrentUserRole: () => {},
  theme: "dark",
  setTheme: () => {},
  font: "sans",
  setFont: () => {},
  accentColor: "agh-green",
  setAccentColor: () => {},
  authStatus: "LoggedOut",
  setAuthStatus: () => {},
})

// Hook to access global state
const useGlobalState = () => useContext(GlobalStateContext)

// ============================================
// UTILITY COMPONENTS
// ============================================

// Status badge with Polish labels and color variants
function StatusBadge({ status }: { status: "Dostępny" | "Wypożyczony" | "Opóźnienie" }) {
  const variants = {
    "Dostępny": "bg-green-600/20 text-green-400 border-green-600/30",
    "Wypożyczony": "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    "Opóźnienie": "bg-red-600/20 text-red-400 border-red-600/30",
  }
  return (
    <Badge variant="outline" className={`${variants[status]} font-medium`}>
      {status}
    </Badge>
  )
}

// Tree node component for categories and locations
function TreeNode({ 
  node, 
  level = 0,
  onAdd,
  type 
}: { 
  node: { id: string; name: string; children: { id: string; name: string; children: unknown[] }[] }
  level?: number
  onAdd: (parentId: string) => void
  type: "category" | "location"
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  
  // Determine icon based on level for locations
  const getLocationIcon = () => {
    if (type === "category") return <FolderTree className="h-4 w-4 text-muted-foreground" />
    if (level === 0) return <Building className="h-4 w-4 text-muted-foreground" />
    if (level === 1) return <DoorOpen className="h-4 w-4 text-muted-foreground" />
    return <Archive className="h-4 w-4 text-muted-foreground" />
  }
  
  // Determine add button label based on level
  const getAddLabel = () => {
    if (type === "category") return "Dodaj podkategorię"
    if (level === 0) return "Dodaj salę"
    if (level === 1) return "Dodaj szafę"
    return null
  }

  return (
    <div className="select-none">
      <div 
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 hover:bg-muted rounded focus:outline-none focus:ring-2 focus:ring-[#00693C]"
          aria-label={expanded ? "Zwiń" : "Rozwiń"}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="w-4" />
          )}
        </button>
        {getLocationIcon()}
        <span className="flex-1 text-sm">{node.name}</span>
        {getAddLabel() && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-[#00693C]"
            onClick={() => onAdd(node.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            {getAddLabel()}
          </Button>
        )}
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child as { id: string; name: string; children: { id: string; name: string; children: unknown[] }[] }} 
              level={level + 1} 
              onAdd={onAdd}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// AUTHENTICATION VIEWS
// ============================================

// Login view with Polish text
function LoginView({ 
  onGoogleLogin, 
  onSwitchToRegister 
}: { 
  onGoogleLogin: () => void
  onSwitchToRegister: () => void 
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1E1E1E]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-[#00693C] flex items-center justify-center mb-2">
            <Package className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">System Zarządzania Aparaturą</CardTitle>
          <CardDescription>Zaloguj się, aby uzyskać dostęp do systemu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Google SSO button */}
          <Button 
            onClick={onGoogleLogin}
            className="w-full h-12 text-white font-medium bg-[#00693C] hover:bg-[#005530] focus:outline-none focus:ring-2 focus:ring-[#00693C] focus:ring-offset-2 focus:ring-offset-background"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Zaloguj się przez Google (Konto AGH)
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Lub kontynuuj z e-mailem</span>
            </div>
          </div>

          {/* Secondary email/password inputs for mockup */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="imie.nazwisko@agh.edu.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-[#00693C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-2 focus:ring-[#00693C]"
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full focus:ring-2 focus:ring-[#00693C]"
              onClick={onGoogleLogin}
            >
              Zaloguj się e-mailem
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <button 
              onClick={onSwitchToRegister}
              className="text-[#00693C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00693C] rounded"
            >
              Zarejestruj się
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Registration view - no role selection as per requirements
function RegisterView({ 
  onRegister, 
  onSwitchToLogin 
}: { 
  onRegister: () => void
  onSwitchToLogin: () => void 
}) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  // Validate email domain
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value && !value.endsWith("@agh.edu.pl")) {
      setEmailError("E-mail musi być w domenie @agh.edu.pl")
    } else {
      setEmailError("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1E1E1E]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-[#00693C] flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Wniosek o dostęp do systemu</CardTitle>
          <CardDescription>Wypełnij formularz rejestracyjny</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Imię i Nazwisko</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jan Kowalski"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="focus:ring-2 focus:ring-[#00693C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regEmail">E-mail instytucjonalny</Label>
              <Input
                id="regEmail"
                type="email"
                placeholder="imie.nazwisko@agh.edu.pl"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`focus:ring-2 focus:ring-[#00693C] ${emailError ? "border-red-500" : ""}`}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError ? (
                <p id="email-error" className="text-xs text-red-500">{emailError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Wymagany adres w domenie @agh.edu.pl</p>
              )}
            </div>
            {/* No role selection - admin assigns role during approval */}
            <Button 
              onClick={onRegister}
              className="w-full bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]"
              disabled={!fullName || !email || !!emailError}
            >
              Zarejestruj konto
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Masz już konto?{" "}
            <button 
              onClick={onSwitchToLogin}
              className="text-[#00693C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00693C] rounded"
            >
              Zaloguj się
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Pending approval view shown after registration
function PendingApprovalView({ onBackToLogin }: { onBackToLogin: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1E1E1E]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-yellow-600/20 flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Wniosek złożony</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success alert with pending status */}
          <Alert className="border-yellow-600/30 bg-yellow-600/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-500">Rejestracja zakończona pomyślnie</AlertTitle>
            <AlertDescription className="text-yellow-400/80">
              Twoje konto oczekuje na weryfikację i przypisanie roli przez Administratora.
              Otrzymasz powiadomienie e-mail po rozpatrzeniu wniosku.
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Proces weryfikacji trwa zazwyczaj 1-2 dni robocze.</p>
            <p>W pilnych sprawach skontaktuj się z administratorem wydziału.</p>
          </div>

          <Button 
            variant="outline" 
            onClick={onBackToLogin}
            className="w-full focus:ring-2 focus:ring-[#00693C]"
          >
            Powrót do logowania
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// SETTINGS MODAL COMPONENT
// ============================================

function SettingsModal({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const { theme, setTheme, font, setFont, accentColor, setAccentColor } = useGlobalState()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ustawienia
          </DialogTitle>
          <DialogDescription>
            Dostosuj wygląd i zachowanie panelu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Motyw
            </Label>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Tryb ciemny</p>
                <p className="text-xs text-muted-foreground">
                  Przełącz między jasnym a ciemnym motywem
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="focus:ring-2 focus:ring-[#00693C]"
                aria-label="Przełącz tryb ciemny"
              />
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Type className="h-4 w-4" />
              Czcionka
            </Label>
            <RadioGroup 
              value={font} 
              onValueChange={(value) => setFont(value as FontFamily)}
              className="grid grid-cols-3 gap-2"
            >
              <Label
                htmlFor="font-sans"
                className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent focus-within:ring-2 focus-within:ring-[#00693C] ${
                  font === "sans" ? "border-[#00693C] bg-[#00693C]/10" : "border-muted"
                }`}
              >
                <RadioGroupItem value="sans" id="font-sans" className="sr-only" />
                <span className="font-sans text-lg">Aa</span>
                <span className="text-xs text-muted-foreground mt-1">Sans</span>
              </Label>
              <Label
                htmlFor="font-serif"
                className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent focus-within:ring-2 focus-within:ring-[#00693C] ${
                  font === "serif" ? "border-[#00693C] bg-[#00693C]/10" : "border-muted"
                }`}
              >
                <RadioGroupItem value="serif" id="font-serif" className="sr-only" />
                <span className="font-serif text-lg">Aa</span>
                <span className="text-xs text-muted-foreground mt-1">Serif</span>
              </Label>
              <Label
                htmlFor="font-mono"
                className={`flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent focus-within:ring-2 focus-within:ring-[#00693C] ${
                  font === "mono" ? "border-[#00693C] bg-[#00693C]/10" : "border-muted"
                }`}
              >
                <RadioGroupItem value="mono" id="font-mono" className="sr-only" />
                <span className="font-mono text-lg">Aa</span>
                <span className="text-xs text-muted-foreground mt-1">Mono</span>
              </Label>
            </RadioGroup>
          </div>

          {/* Accent Color Selector */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Kolor akcentu
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setAccentColor(key)}
                  className={`relative h-12 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-[#00693C] ${
                    accentColor === key 
                      ? "border-white ring-2 ring-white/50" 
                      : "border-transparent hover:border-white/30"
                  }`}
                  style={{ backgroundColor: value.hex }}
                  aria-label={value.name}
                  title={value.name}
                >
                  {accentColor === key && (
                    <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Aktualny: {ACCENT_COLORS[accentColor].name}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// EQUIPMENT DETAILS MODAL
// ============================================

function EquipmentDetailsModal({
  open,
  onOpenChange,
  equipment
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: typeof mockEquipment[0] | null
}) {
  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Szczegóły i zdjęcia
          </DialogTitle>
          <DialogDescription>
            {equipment.id} - {equipment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Mock image gallery */}
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

          {/* Equipment details */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Kategoria</Label>
                <p className="font-medium">{equipment.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Lokalizacja</Label>
                <p className="font-medium">{equipment.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Właściciel</Label>
                <p className="font-medium">{equipment.owner}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Status</Label>
                <div className="mt-1">
                  <StatusBadge status={equipment.status} />
                </div>
              </div>
            </div>
            {equipment.borrower && (
              <div>
                <Label className="text-muted-foreground text-xs">Aktualnie wypożyczony przez</Label>
                <p className="font-medium">{equipment.borrower}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="focus:ring-2 focus:ring-[#00693C]">
            Zamknij
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// MAIN CONTENT VIEWS
// ============================================

// Dashboard view with statistics cards
function DashboardContent() {
  const totalEquipment = mockEquipment.length
  const delayedReturns = mockEquipment.filter(e => e.status === "Opóźnienie").length
  const pendingRequests = mockBorrowingRequests.length

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Całkowity sprzęt</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipment}</div>
            <p className="text-xs text-muted-foreground">urządzeń w systemie</p>
          </CardContent>
        </Card>
        <Card className="border-red-600/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-400">Opóźnione zwroty</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{delayedReturns}</div>
            <p className="text-xs text-muted-foreground">wymaga uwagi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Oczekujące wnioski</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">do rozpatrzenia</p>
          </CardContent>
        </Card>
      </div>

      {/* Mock Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Wykorzystanie sprzętu
          </CardTitle>
          <CardDescription>Statystyki wypożyczeń w ostatnich 6 miesiącach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {[65, 45, 80, 55, 70, 90].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-[#00693C] rounded-t-sm transition-all hover:bg-[#005530]"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze"][i]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Equipment Inventory view
function EquipmentContent({ userRole }: { userRole: UserRole }) {
  const [selectedEquipment, setSelectedEquipment] = useState<typeof mockEquipment[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const canEdit = userRole === "Administrator" || userRole === "Właściciel"
  const isObserver = userRole === "Obserwator"

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Button className="bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]">
            <Plus className="h-4 w-4 mr-2" />
            Dodaj nowy sprzęt
          </Button>
        )}
        <Button variant="outline" className="focus:ring-2 focus:ring-[#00693C]">
          <UserPlus className="h-4 w-4 mr-2" />
          Szybkie wypożyczenie (Gość)
        </Button>
      </div>

      {/* Equipment Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nazwa</TableHead>
                    <TableHead className="font-semibold">Kategoria</TableHead>
                    <TableHead className="font-semibold">Lokalizacja</TableHead>
                    <TableHead className="font-semibold">Właściciel</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    {!isObserver && <TableHead className="font-semibold text-right">Akcje</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEquipment.map((item) => (
                    <TableRow key={item.id} className="focus-within:bg-muted/30" tabIndex={0}>
                      <TableCell className="font-mono text-sm">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.category}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.location}</TableCell>
                      <TableCell className="text-sm">{item.owner}</TableCell>
                      <TableCell><StatusBadge status={item.status} /></TableCell>
                      {!isObserver && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 focus:ring-2 focus:ring-[#00693C]"
                                aria-label={`Akcje dla ${item.name}`}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => { setSelectedEquipment(item); setDetailsOpen(true); }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Szczegóły i zdjęcia
                              </DropdownMenuItem>
                              {canEdit && (
                                <>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edytuj
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Generuj kod QR PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Deleguj uprawnienia
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <EquipmentDetailsModal 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        equipment={selectedEquipment} 
      />
    </div>
  )
}

// Borrowing Center view with tabs
function BorrowingContent({ userRole }: { userRole: UserRole }) {
  const isOwnerOrAdmin = userRole === "Administrator" || userRole === "Właściciel"
  
  return (
    <Tabs defaultValue="my-requests" className="space-y-4">
      <TabsList>
        <TabsTrigger value="my-requests" className="focus:ring-2 focus:ring-[#00693C]">Moje wnioski</TabsTrigger>
        {isOwnerOrAdmin && (
          <TabsTrigger value="to-approve" className="focus:ring-2 focus:ring-[#00693C]">Do zatwierdzenia</TabsTrigger>
        )}
        <TabsTrigger value="active" className="focus:ring-2 focus:ring-[#00693C]">Aktywne wypożyczenia</TabsTrigger>
      </TabsList>

      {/* My Requests Tab */}
      <TabsContent value="my-requests" className="space-y-4">
        <Button className="bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]">
          <Plus className="h-4 w-4 mr-2" />
          Złóż wniosek o wypożyczenie
        </Button>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Sprzęt</TableHead>
                  <TableHead>Data złożenia</TableHead>
                  <TableHead>Okres wypożyczenia</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBorrowingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.equipmentName}</TableCell>
                    <TableCell>{req.requestDate}</TableCell>
                    <TableCell>{req.startDate} - {req.endDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* To Approve Tab (Owner/Admin only) */}
      {isOwnerOrAdmin && (
        <TabsContent value="to-approve" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Sprzęt</TableHead>
                    <TableHead>Wnioskodawca</TableHead>
                    <TableHead>Okres</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBorrowingRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.equipmentName}</TableCell>
                      <TableCell>{req.requestedBy}</TableCell>
                      <TableCell>{req.startDate} - {req.endDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]">
                            <Check className="h-4 w-4 mr-1" />
                            Zatwierdź
                          </Button>
                          <Button size="sm" variant="destructive" className="bg-[#A71930] hover:bg-[#8a1528] focus:ring-2 focus:ring-[#00693C]">
                            <X className="h-4 w-4 mr-1" />
                            Odrzuć
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {/* Active Borrowings Tab */}
      <TabsContent value="active" className="space-y-4">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Sprzęt</TableHead>
                  <TableHead>Wypożyczający</TableHead>
                  <TableHead>Data zwrotu</TableHead>
                  <TableHead>Status</TableHead>
                  {isOwnerOrAdmin && <TableHead className="text-right">Akcje</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockActiveBorrowings.map((bor) => (
                  <TableRow key={bor.id} className={bor.isDelayed ? "bg-red-600/5" : ""}>
                    <TableCell className="font-medium">{bor.equipmentName}</TableCell>
                    <TableCell>{bor.borrower}</TableCell>
                    <TableCell>{bor.endDate}</TableCell>
                    <TableCell>
                      {bor.isDelayed ? (
                        <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-600/30">
                          Opóźniony
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">
                          W terminie
                        </Badge>
                      )}
                    </TableCell>
                    {isOwnerOrAdmin && (
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="focus:ring-2 focus:ring-[#00693C]">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Potwierdź zwrot
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Locations & Categories view with tree structures
function LocationsContent() {
  const handleAddCategory = (parentId: string) => {
    // Mock action - in real app would open dialog
    console.log("Add category to:", parentId)
  }

  const handleAddLocation = (parentId: string) => {
    // Mock action - in real app would open dialog
    console.log("Add location to:", parentId)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Kategorie
            </CardTitle>
            <Button size="sm" className="bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj kategorię
            </Button>
          </div>
          <CardDescription>Hierarchia kategorii sprzętu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-2">
            {mockCategories.map((cat) => (
              <TreeNode 
                key={cat.id} 
                node={cat as { id: string; name: string; children: { id: string; name: string; children: unknown[] }[] }} 
                onAdd={handleAddCategory}
                type="category"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Locations Tree */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Lokalizacje
            </CardTitle>
            <Button size="sm" className="bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj budynek
            </Button>
          </div>
          <CardDescription>Budynek → Sala → Szafa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-2">
            {mockLocations.map((loc) => (
              <TreeNode 
                key={loc.id} 
                node={loc as { id: string; name: string; children: { id: string; name: string; children: unknown[] }[] }}
                onAdd={handleAddLocation}
                type="location"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// User Management view (Admin only)
function UsersContent() {
  const [roleAssignments, setRoleAssignments] = useState<Record<string, UserRole>>({})

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Oczekujące wnioski o rejestrację
          </CardTitle>
          <CardDescription>Przypisz rolę i zaakceptuj lub odrzuć wniosek</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Imię i Nazwisko</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Data wniosku</TableHead>
                <TableHead>Przypisz rolę</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.date}</TableCell>
                  <TableCell>
                    <Select 
                      value={roleAssignments[user.id] || ""} 
                      onValueChange={(value) => setRoleAssignments(prev => ({ ...prev, [user.id]: value as UserRole }))}
                    >
                      <SelectTrigger className="w-40 focus:ring-2 focus:ring-[#00693C]">
                        <SelectValue placeholder="Wybierz rolę" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Właściciel">Właściciel</SelectItem>
                        <SelectItem value="Wypożyczający">Wypożyczający</SelectItem>
                        <SelectItem value="Obserwator">Obserwator</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]"
                        disabled={!roleAssignments[user.id]}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Akceptuj
                      </Button>
                      <Button size="sm" variant="destructive" className="bg-[#A71930] hover:bg-[#8a1528] focus:ring-2 focus:ring-[#00693C]">
                        <X className="h-4 w-4 mr-1" />
                        Odrzuć
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Registered Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Zarejestrowani użytkownicy
          </CardTitle>
          <CardDescription>Zarządzaj rolami i statusem zaufania użytkowników</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Imię i Nazwisko</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Zaufany</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRegisteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id={`trusted-${user.id}`}
                        defaultChecked={user.trusted}
                        className="focus:ring-2 focus:ring-[#00693C]"
                      />
                      <Label htmlFor={`trusted-${user.id}`} className="text-sm cursor-pointer">
                        {user.trusted && <Star className="h-4 w-4 text-yellow-500 inline ml-1" />}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 focus:ring-2 focus:ring-[#00693C]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edytuj
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <History className="mr-2 h-4 w-4" />
                          Historia wypożyczeń
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-500">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Usuń użytkownika
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

function MainDashboard({ onLogout }: { onLogout: () => void }) {
  const { currentUserRole, setCurrentUserRole, accentColor, font } = useGlobalState()
  
  // UI State
  const [activeNav, setActiveNav] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockEquipment>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchFilter, setSearchFilter] = useState<"name" | "params" | "borrower">("name")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Filter nav items based on current user role
  const visibleNavItems = navItems.filter(item => item.roles.includes(currentUserRole))

  // Set initial nav based on role
  useEffect(() => {
    const firstAvailable = visibleNavItems[0]
    if (firstAvailable && !visibleNavItems.find(item => item.id === activeNav)) {
      setActiveNav(firstAvailable.id)
    }
  }, [currentUserRole, activeNav, visibleNavItems])

  // Simulated fast search with <100ms response
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        const filtered = mockEquipment.filter(item => {
          const q = query.toLowerCase()
          switch (searchFilter) {
            case "name":
              return item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
            case "params":
              return item.category.toLowerCase().includes(q)
            case "borrower":
              return item.borrower?.toLowerCase().includes(q)
            default:
              return item.name.toLowerCase().includes(q)
          }
        })
        setSearchResults(filtered)
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 50)
  }, [searchFilter])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Navigation button component
  const NavButton = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <button
      onClick={() => {
        setActiveNav(item.id)
        setMobileMenuOpen(false)
      }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
        focus:outline-none focus:ring-2 focus:ring-[#00693C] focus:ring-offset-2 focus:ring-offset-background
        ${isActive 
          ? "bg-[#00693C] text-white" 
          : "hover:bg-muted text-foreground"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      {item.icon}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{item.label}</div>
        <div className={`text-xs truncate ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
          {item.description}
        </div>
      </div>
      {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
    </button>
  )

  // Apply font family
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans"

  // Render main content based on active nav
  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardContent />
      case "equipment":
        return <EquipmentContent userRole={currentUserRole} />
      case "borrowings":
        return <BorrowingContent userRole={currentUserRole} />
      case "locations":
        return <LocationsContent />
      case "users":
        return <UsersContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className={`min-h-screen bg-background ${fontClass}`}>
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden focus:ring-2 focus:ring-[#00693C]"
                aria-label="Menu nawigacji"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left">Nawigacja</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <nav className="p-4 space-y-1" aria-label="Nawigacja główna">
                  {visibleNavItems.map((item) => (
                    <NavButton key={item.id} item={item} isActive={activeNav === item.id} />
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-[#00693C]" />
            <h1 className="text-lg font-semibold hidden sm:block">Aparatura Pomiarowa</h1>
            <h1 className="text-lg font-semibold sm:hidden">AGH</h1>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-md mx-4 relative">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Szukaj sprzętu... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="pl-10 pr-4 focus:ring-2 focus:ring-[#00693C]"
                  aria-label="Szukaj sprzętu"
                />
              </div>
              <Select value={searchFilter} onValueChange={(v) => setSearchFilter(v as typeof searchFilter)}>
                <SelectTrigger className="w-36 hidden md:flex focus:ring-2 focus:ring-[#00693C]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Po nazwie</SelectItem>
                  <SelectItem value="params">Po parametrach</SelectItem>
                  <SelectItem value="borrower">Po wypożyczającym</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
                <CardContent className="p-2">
                  <ul role="listbox" aria-label="Wyniki wyszukiwania">
                    {searchResults.slice(0, 5).map((item) => (
                      <li key={item.id}>
                        <button
                          className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#00693C]"
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery("")
                            setActiveNav("equipment")
                          }}
                        >
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.id} • {item.category}</div>
                          </div>
                          <StatusBadge status={item.status} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notifications Bell */}
          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative focus:ring-2 focus:ring-[#00693C]">
                <Bell className="h-5 w-5" />
                {mockNotifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#A71930] text-[10px] text-white flex items-center justify-center">
                    {mockNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Powiadomienia</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockNotifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className={`flex flex-col items-start gap-1 py-3 ${!notif.read ? "bg-muted/50" : ""}`}>
                  <span className="text-sm">{notif.message}</span>
                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Switcher (for testing) */}
          <Select value={currentUserRole} onValueChange={(v) => setCurrentUserRole(v as UserRole)}>
            <SelectTrigger className="w-40 hidden lg:flex focus:ring-2 focus:ring-[#00693C]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrator">Administrator</SelectItem>
              <SelectItem value="Właściciel">Właściciel</SelectItem>
              <SelectItem value="Wypożyczający">Wypożyczający</SelectItem>
              <SelectItem value="Obserwator">Obserwator</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-8 hidden md:block" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-lg p-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-[#00693C]">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium">Jan Kowalski</div>
                  <div className="text-xs text-muted-foreground">{currentUserRole}</div>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-[#00693C] text-white">JK</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Ustawienia
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Eksport (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                Eksport (.pdf)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onLogout}
                className="cursor-pointer text-[#A71930] focus:text-[#A71930] focus:bg-red-100/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj się
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 border-r bg-card shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <ScrollArea className="h-full">
            <nav className="p-4 space-y-1" aria-label="Nawigacja główna">
              {visibleNavItems.map((item) => (
                <NavButton key={item.id} item={item} isActive={activeNav === item.id} />
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{visibleNavItems.find(i => i.id === activeNav)?.label}</h2>
            <p className="text-muted-foreground">{visibleNavItems.find(i => i.id === activeNav)?.description}</p>
          </div>
          {renderContent()}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}

// ============================================
// MAIN EXPORT COMPONENT
// ============================================

export function AdminView() {
  // Global state management
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("Administrator")
  const [theme, setTheme] = useState<ThemeMode>("dark")
  const [font, setFont] = useState<FontFamily>("sans")
  const [accentColor, setAccentColor] = useState<AccentColor>("agh-green")
  const [authStatus, setAuthStatus] = useState<AuthStatus>("LoggedOut")
  const [authView, setAuthView] = useState<"login" | "register">("login")

  // Apply theme class to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // Auth handlers
  const handleGoogleLogin = () => {
    setAuthStatus("LoggedIn")
  }

  const handleRegister = () => {
    setAuthStatus("PendingApproval")
  }

  const handleLogout = () => {
    setAuthStatus("LoggedOut")
    setAuthView("login")
  }

  // Render based on auth status
  const renderAuthView = () => {
    if (authStatus === "PendingApproval") {
      return <PendingApprovalView onBackToLogin={() => { setAuthStatus("LoggedOut"); setAuthView("login"); }} />
    }

    if (authView === "register") {
      return (
        <RegisterView 
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView("login")}
        />
      )
    }

    return (
      <LoginView 
        onGoogleLogin={handleGoogleLogin}
        onSwitchToRegister={() => setAuthView("register")}
      />
    )
  }

  return (
    <GlobalStateContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        theme,
        setTheme,
        font,
        setFont,
        accentColor,
        setAccentColor,
        authStatus,
        setAuthStatus,
      }}
    >
      {authStatus === "LoggedIn" ? (
        <MainDashboard onLogout={handleLogout} />
      ) : (
        renderAuthView()
      )}
    </GlobalStateContext.Provider>
  )
}
