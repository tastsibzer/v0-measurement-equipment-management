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
  Database,
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Settings,
  QrCode,
  Edit,
  UserMinus,
  RotateCcw,
  History,
  MoreHorizontal,
  Menu,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Palette,
  Type,
  AlertCircle,
  Clock,
} from "lucide-react"

// ============================================
// TYPE DEFINITIONS
// ============================================

// Navigation item type for sidebar navigation
type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

// Authentication state types
type AuthState = "login" | "register" | "pending" | "authenticated"

// Theme settings types
type ThemeMode = "light" | "dark"
type FontFamily = "sans" | "serif" | "mono"
type AccentColor = "agh-green" | "blue" | "purple" | "orange"

// Settings context type for global state management
type SettingsContextType = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  font: FontFamily
  setFont: (font: FontFamily) => void
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
}

// ============================================
// CONSTANTS & MOCK DATA
// ============================================

// Color definitions for accent colors (hex values for display)
const ACCENT_COLORS: Record<AccentColor, { hex: string; name: string; ring: string }> = {
  "agh-green": { hex: "#00693C", name: "AGH Green (Default)", ring: "ring-[#00693C]" },
  "blue": { hex: "#2563eb", name: "Blue", ring: "ring-blue-500" },
  "purple": { hex: "#7c3aed", name: "Purple", ring: "ring-purple-500" },
  "orange": { hex: "#ea580c", name: "Orange", ring: "ring-orange-500" },
}

// Mock data for pending user registrations
const pendingUsers = [
  { id: "1", name: "Maria Nowak", email: "maria.nowak@agh.edu.pl", requestedRole: "Borrower", date: "2024-01-15" },
  { id: "2", name: "Piotr Kowalczyk", email: "piotr.kowalczyk@agh.edu.pl", requestedRole: "Owner", date: "2024-01-14" },
  { id: "3", name: "Anna Wiśniewska", email: "anna.wisniewska@agh.edu.pl", requestedRole: "Observer", date: "2024-01-13" },
  { id: "4", name: "Tomasz Zieliński", email: "tomasz.zielinski@agh.edu.pl", requestedRole: "Borrower", date: "2024-01-12" },
]

// Mock data for global equipment view
const allEquipment = [
  { id: "AGH-001", name: "Electron Microscope TEM-2000", category: "Optics > Microscopes", location: "Building B1 > Room 204", owner: "Dr. Jan Kowalski", status: "Available" as const },
  { id: "AGH-002", name: "Digital Oscilloscope DS-4000", category: "Electronics > Oscilloscopes", location: "Building C3 > Room 112", owner: "Dr. Anna Nowak", status: "Borrowed" as const },
  { id: "AGH-003", name: "Spectrum Analyzer SA-500", category: "Electronics > Analyzers", location: "Building B1 > Room 105", owner: "Prof. Maria Wiśniewska", status: "Delayed" as const },
  { id: "AGH-004", name: "Laser Interferometer LI-100", category: "Optics > Lasers", location: "Building A2 > Room 301", owner: "Dr. Piotr Zieliński", status: "Available" as const },
  { id: "AGH-005", name: "X-Ray Diffractometer XRD-7000", category: "Material Science", location: "Building D1 > Room 401", owner: "Prof. Ewa Kowalczyk", status: "Borrowed" as const },
  { id: "AGH-006", name: "Thermal Camera TC-PRO", category: "Electronics > Imaging", location: "Building B1 > Room 204", owner: "Dr. Jan Kowalski", status: "Delayed" as const },
]

// Navigation items for sidebar
const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Statistics, delays, returns" },
  { id: "equipment", label: "Equipment Management", icon: <Package className="h-5 w-5" />, description: "CRUD, QR codes, Photos" },
  { id: "locations", label: "Location Management", icon: <MapPin className="h-5 w-5" />, description: "Building > Room > Cabinet" },
  { id: "users", label: "User & Role Management", icon: <Users className="h-5 w-5" />, description: "Registrations, roles" },
  { id: "categories", label: "Categories", icon: <Settings className="h-5 w-5" />, description: "Equipment category tree" },
]

// ============================================
// CONTEXT FOR GLOBAL SETTINGS
// ============================================

// Create context for theme/font/color settings with default values
const SettingsContext = createContext<SettingsContextType>({
  theme: "dark",
  setTheme: () => {},
  font: "sans",
  setFont: () => {},
  accentColor: "agh-green",
  setAccentColor: () => {},
})

// Hook to access settings context
const useSettings = () => useContext(SettingsContext)

// ============================================
// UTILITY COMPONENTS
// ============================================

// Status badge with color-coded variants based on equipment status
function StatusBadge({ status }: { status: "Available" | "Borrowed" | "Delayed" }) {
  const variants = {
    Available: "bg-green-600/20 text-green-400 border-green-600/30",
    Borrowed: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    Delayed: "bg-red-600/20 text-red-400 border-red-600/30",
  }
  return (
    <Badge variant="outline" className={`${variants[status]} font-medium`}>
      {status}
    </Badge>
  )
}

// ============================================
// AUTHENTICATION VIEWS
// ============================================

// Login view component with Google SSO and email/password options
function LoginView({ 
  onGoogleLogin, 
  onSwitchToRegister 
}: { 
  onGoogleLogin: () => void
  onSwitchToRegister: () => void 
}) {
  const { accentColor } = useSettings()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Get dynamic button styles based on accent color
  const primaryButtonClass = accentColor === "agh-green" 
    ? "bg-[#00693C] hover:bg-[#005530] focus:ring-[#00693C]"
    : accentColor === "blue"
    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    : accentColor === "purple"
    ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
    : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1E1E1E]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-[#00693C] flex items-center justify-center mb-2">
            <Package className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Equipment Manager</CardTitle>
          <CardDescription>Sign in to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Google SSO button */}
          <Button 
            onClick={onGoogleLogin}
            className={`w-full h-12 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${primaryButtonClass}`}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google (AGH Institution)
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Secondary email/password inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@agh.edu.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-[#00693C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
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
              Sign in with Email
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <button 
              onClick={onSwitchToRegister}
              className="text-[#00693C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00693C] rounded"
            >
              Register here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Registration view for new users
function RegisterView({ 
  onRegister, 
  onSwitchToLogin 
}: { 
  onRegister: () => void
  onSwitchToLogin: () => void 
}) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [requestedRole, setRequestedRole] = useState("")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1E1E1E]">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-lg bg-[#00693C] flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Register for equipment management access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
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
              <Label htmlFor="regEmail">Institutional Email</Label>
              <Input
                id="regEmail"
                type="email"
                placeholder="name@agh.edu.pl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-[#00693C]"
              />
              <p className="text-xs text-muted-foreground">Must be an @agh.edu.pl email address</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Requested Role</Label>
              <Select value={requestedRole} onValueChange={setRequestedRole}>
                <SelectTrigger id="role" className="focus:ring-2 focus:ring-[#00693C]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrower">Borrower - Can borrow equipment</SelectItem>
                  <SelectItem value="owner">Owner - Can manage own equipment</SelectItem>
                  <SelectItem value="observer">Observer - Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={onRegister}
              className="w-full bg-[#00693C] hover:bg-[#005530] text-white focus:ring-2 focus:ring-[#00693C]"
              disabled={!fullName || !email || !requestedRole}
            >
              Submit Registration
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={onSwitchToLogin}
              className="text-[#00693C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#00693C] rounded"
            >
              Sign in
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
          <CardTitle className="text-2xl font-bold">Registration Submitted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert component for pending status */}
          <Alert className="border-yellow-600/30 bg-yellow-600/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-500">Pending Manual Approval</AlertTitle>
            <AlertDescription className="text-yellow-400/80">
              Your registration request has been submitted and is awaiting approval from an administrator. 
              You will receive an email notification once your account has been reviewed.
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>This process typically takes 1-2 business days.</p>
            <p>For urgent requests, please contact your department administrator.</p>
          </div>

          <Button 
            variant="outline" 
            onClick={onBackToLogin}
            className="w-full focus:ring-2 focus:ring-[#00693C]"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// SETTINGS PANEL COMPONENT
// ============================================

function SettingsPanel({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const { theme, setTheme, font, setFont, accentColor, setAccentColor } = useSettings()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize the appearance and behavior of the admin panel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Toggle Section */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Theme
            </Label>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="focus:ring-2 focus:ring-[#00693C]"
                aria-label="Toggle dark mode"
              />
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Family
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

          {/* Interface Color Selector */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Primary Accent Color
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setAccentColor(key)}
                  className={`relative h-12 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background ${
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
              Current: {ACCENT_COLORS[accentColor].name}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// MAIN ADMIN DASHBOARD COMPONENT
// ============================================

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { accentColor, font } = useSettings()
  
  // State management for navigation, search, and UI interactions
  const [activeNav, setActiveNav] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof allEquipment>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get dynamic styles based on accent color
  const accentStyles = {
    button: accentColor === "agh-green" 
      ? "bg-[#00693C] hover:bg-[#005530]"
      : accentColor === "blue"
      ? "bg-blue-600 hover:bg-blue-700"
      : accentColor === "purple"
      ? "bg-purple-600 hover:bg-purple-700"
      : "bg-orange-600 hover:bg-orange-700",
    ring: ACCENT_COLORS[accentColor].ring,
    text: accentColor === "agh-green"
      ? "text-[#00693C]"
      : accentColor === "blue"
      ? "text-blue-500"
      : accentColor === "purple"
      ? "text-purple-500"
      : "text-orange-500",
  }

  // Simulated fast search with debounce (<100ms response)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        const filtered = allEquipment.filter(
          item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.id.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        )
        setSearchResults(filtered)
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 50) // <100ms simulated response
  }, [])

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

  // Navigation button component with dynamic focus states
  const NavButton = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <button
      onClick={() => {
        setActiveNav(item.id)
        setMobileMenuOpen(false)
      }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
        focus:outline-none focus:ring-2 ${accentStyles.ring} focus:ring-offset-2 focus:ring-offset-background
        ${isActive 
          ? `${accentStyles.button} text-white` 
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

  // Apply font family class based on settings
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans"

  return (
    <div className={`min-h-screen bg-background ${fontClass}`}>
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden focus:ring-2 ${accentStyles.ring}`}
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-left">Navigation</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <nav className="p-4 space-y-1" aria-label="Admin navigation">
                  {navItems.map((item) => (
                    <NavButton key={item.id} item={item} isActive={activeNav === item.id} />
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Title with dynamic accent color */}
          <div className="flex items-center gap-2">
            <LayoutDashboard className={`h-6 w-6 ${accentStyles.text}`} />
            <h1 className="text-lg font-semibold hidden sm:block">Admin Panel</h1>
            <h1 className="text-lg font-semibold sm:hidden">Admin</h1>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search equipment... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className={`pl-10 pr-4 focus:ring-2 ${accentStyles.ring}`}
                aria-label="Search equipment globally"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
                <CardContent className="p-2">
                  <ul role="listbox" aria-label="Search results">
                    {searchResults.slice(0, 5).map((item) => (
                      <li key={item.id}>
                        <button
                          className={`w-full flex items-center justify-between p-2 hover:bg-muted rounded-md text-left focus:outline-none focus:ring-2 ${accentStyles.ring}`}
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery("")
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

          {/* Global Actions */}
          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`gap-2 focus:ring-2 ${accentStyles.ring}`}>
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden lg:inline">Export Data</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as .xlsx
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Export as .pdf
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" className={`gap-2 focus:ring-2 ${accentStyles.ring}`}>
              <Database className="h-4 w-4" />
              <span className="hidden lg:inline">Import SQL</span>
            </Button>
          </div>

          {/* Admin Profile Dropdown with Logout and Settings */}
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center gap-3 rounded-lg p-1 hover:bg-muted focus:outline-none focus:ring-2 ${accentStyles.ring}`}>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium">Jan Kowalski</div>
                  <div className="text-xs text-muted-foreground">via Google SSO (AGH)</div>
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Jan Kowalski" />
                  <AvatarFallback className={`${accentStyles.button} text-white`}>JK</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => setSettingsOpen(true)}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Prominent Log Out action */}
              <DropdownMenuItem 
                onClick={onLogout}
                className="cursor-pointer text-[#A71930] focus:text-[#A71930] focus:bg-red-100/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 border-r bg-card shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <ScrollArea className="h-full">
            <nav className="p-4 space-y-1" aria-label="Admin navigation">
              {navItems.map((item) => (
                <NavButton key={item.id} item={item} isActive={activeNav === item.id} />
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 min-w-0">
          {/* Pending User Registrations Table */}
          <section aria-labelledby="pending-users-heading">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle id="pending-users-heading" className="text-lg flex items-center gap-2">
                  <Users className={`h-5 w-5 ${accentStyles.text}`} />
                  Pending Registrations
                </CardTitle>
                <CardDescription>
                  New users requiring admin approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Requested Role</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow key={user.id} className="focus-within:bg-muted/30" tabIndex={0}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Select defaultValue={user.requestedRole.toLowerCase()}>
                              <SelectTrigger className={`w-32 h-8 focus:ring-2 ${accentStyles.ring}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="borrower">Borrower</SelectItem>
                                <SelectItem value="observer">Observer</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                className={`${accentStyles.button} text-white focus:ring-2 ${accentStyles.ring}`}
                                aria-label={`Approve ${user.name}`}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className={`bg-[#A71930] hover:bg-[#8a1528] focus:ring-2 ${accentStyles.ring}`}
                                aria-label={`Reject ${user.name}`}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Global Equipment View Table */}
          <section aria-labelledby="equipment-heading">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle id="equipment-heading" className="text-lg flex items-center gap-2">
                  <Package className={`h-5 w-5 ${accentStyles.text}`} />
                  Global Equipment View
                </CardTitle>
                <CardDescription>
                  Complete inventory with admin capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold min-w-[80px]">ID</TableHead>
                          <TableHead className="font-semibold min-w-[180px]">Name</TableHead>
                          <TableHead className="font-semibold min-w-[140px]">Category</TableHead>
                          <TableHead className="font-semibold min-w-[160px]">Location</TableHead>
                          <TableHead className="font-semibold min-w-[140px]">Owner</TableHead>
                          <TableHead className="font-semibold min-w-[90px]">Status</TableHead>
                          <TableHead className="font-semibold text-right min-w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allEquipment.map((item) => (
                          <TableRow key={item.id} className="focus-within:bg-muted/30" tabIndex={0}>
                            <TableCell className="font-mono text-sm">{item.id}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.category}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.location}</TableCell>
                            <TableCell className="text-sm">{item.owner}</TableCell>
                            <TableCell><StatusBadge status={item.status} /></TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 focus:ring-2 ${accentStyles.ring}`}
                                    aria-label={`Actions for ${item.name}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Any Field
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Reassign Owner
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Force Return
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Generate QR PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <History className="mr-2 h-4 w-4" />
                                    View Full History
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>

      {/* Settings Panel Modal */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}

// ============================================
// MAIN EXPORTED COMPONENT WITH GLOBAL STATE
// ============================================

export function AdminView() {
  // Authentication state management
  const [authState, setAuthState] = useState<AuthState>("login")
  
  // Global settings state with defaults per requirements
  const [theme, setTheme] = useState<ThemeMode>("dark")
  const [font, setFont] = useState<FontFamily>("sans")
  const [accentColor, setAccentColor] = useState<AccentColor>("agh-green")

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  // Apply font family to body when font changes
  useEffect(() => {
    document.body.classList.remove("font-sans", "font-serif", "font-mono")
    document.body.classList.add(`font-${font}`)
  }, [font])

  // Handler for Google SSO login - transitions to authenticated state
  const handleGoogleLogin = () => {
    setAuthState("authenticated")
  }

  // Handler for registration submission - transitions to pending state
  const handleRegister = () => {
    setAuthState("pending")
  }

  // Handler for logout - resets to login state
  const handleLogout = () => {
    setAuthState("login")
  }

  // Render appropriate view based on authentication state
  const renderAuthView = () => {
    switch (authState) {
      case "login":
        return (
          <LoginView 
            onGoogleLogin={handleGoogleLogin} 
            onSwitchToRegister={() => setAuthState("register")} 
          />
        )
      case "register":
        return (
          <RegisterView 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setAuthState("login")} 
          />
        )
      case "pending":
        return (
          <PendingApprovalView onBackToLogin={() => setAuthState("login")} />
        )
      case "authenticated":
        return <AdminDashboard onLogout={handleLogout} />
      default:
        return null
    }
  }

  return (
    // Provide settings context to all child components
    <SettingsContext.Provider 
      value={{ 
        theme, setTheme, 
        font, setFont, 
        accentColor, setAccentColor 
      }}
    >
      {renderAuthView()}
    </SettingsContext.Provider>
  )
}
