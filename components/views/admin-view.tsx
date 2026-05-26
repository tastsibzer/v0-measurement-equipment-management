"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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
} from "lucide-react"

// Navigation item type definition for sidebar
type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

// Mock data for pending user registrations
const pendingUsers = [
  { id: "1", name: "Maria Nowak", email: "maria.nowak@agh.edu.pl", requestedRole: "Borrower", date: "2024-01-15" },
  { id: "2", name: "Piotr Kowalczyk", email: "piotr.kowalczyk@agh.edu.pl", requestedRole: "Owner", date: "2024-01-14" },
  { id: "3", name: "Anna Wiśniewska", email: "anna.wisniewska@agh.edu.pl", requestedRole: "Observer", date: "2024-01-13" },
  { id: "4", name: "Tomasz Zieliński", email: "tomasz.zielinski@agh.edu.pl", requestedRole: "Borrower", date: "2024-01-12" },
]

// Mock data for global equipment view with various statuses
const allEquipment = [
  { 
    id: "AGH-001", 
    name: "Electron Microscope TEM-2000", 
    category: "Optics > Microscopes > Electron", 
    location: "Building B1 > Room 204 > Cabinet A1", 
    owner: "Dr. Jan Kowalski",
    status: "Available" as const 
  },
  { 
    id: "AGH-002", 
    name: "Digital Oscilloscope DS-4000", 
    category: "Electronics > Oscilloscopes", 
    location: "Building C3 > Room 112 > Cabinet B2", 
    owner: "Dr. Anna Nowak",
    status: "Borrowed" as const 
  },
  { 
    id: "AGH-003", 
    name: "Spectrum Analyzer SA-500", 
    category: "Electronics > Analyzers", 
    location: "Building B1 > Room 105 > Cabinet C1", 
    owner: "Prof. Maria Wiśniewska",
    status: "Delayed" as const 
  },
  { 
    id: "AGH-004", 
    name: "Laser Interferometer LI-100", 
    category: "Optics > Lasers", 
    location: "Building A2 > Room 301 > Cabinet D3", 
    owner: "Dr. Piotr Zieliński",
    status: "Available" as const 
  },
  { 
    id: "AGH-005", 
    name: "X-Ray Diffractometer XRD-7000", 
    category: "Material Science > Diffractometers", 
    location: "Building D1 > Room 401 > Cabinet A2", 
    owner: "Prof. Ewa Kowalczyk",
    status: "Borrowed" as const 
  },
  { 
    id: "AGH-006", 
    name: "Thermal Camera TC-PRO", 
    category: "Electronics > Imaging", 
    location: "Building B1 > Room 204 > Cabinet A3", 
    owner: "Dr. Jan Kowalski",
    status: "Delayed" as const 
  },
  { 
    id: "AGH-007", 
    name: "Signal Generator SG-200", 
    category: "Electronics > Generators", 
    location: "Building C3 > Room 115 > Cabinet B1", 
    owner: "Dr. Anna Nowak",
    status: "Available" as const 
  },
  { 
    id: "AGH-008", 
    name: "Atomic Force Microscope AFM-3D", 
    category: "Optics > Microscopes > Atomic", 
    location: "Building A2 > Room 302 > Cabinet D1", 
    owner: "Prof. Maria Wiśniewska",
    status: "Borrowed" as const 
  },
]

// Navigation items for the sidebar
const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Global statistics, delays, missing returns" },
  { id: "equipment", label: "Equipment Management", icon: <Package className="h-5 w-5" />, description: "Full CRUD, QR code generation, Photo documentation" },
  { id: "locations", label: "Location Management", icon: <MapPin className="h-5 w-5" />, description: "Manage hierarchy: Building > Room > Cabinet" },
  { id: "users", label: "User & Role Management", icon: <Users className="h-5 w-5" />, description: "Accept registrations, assign roles" },
  { id: "settings", label: "Categories & Settings", icon: <Settings className="h-5 w-5" />, description: "Manage equipment category tree" },
]

// Status badge component with color-coded variants
function StatusBadge({ status }: { status: "Available" | "Borrowed" | "Delayed" }) {
  const variants = {
    Available: "bg-green-100 text-green-800 border-green-200",
    Borrowed: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Delayed: "bg-red-100 text-red-800 border-red-200",
  }
  
  return (
    <Badge variant="outline" className={`${variants[status]} font-medium`}>
      {status}
    </Badge>
  )
}

export function AdminView() {
  // State management for navigation, search, and interactions
  const [activeNav, setActiveNav] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof allEquipment>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Simulated fast search with debounce (<100ms response simulation)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Simulate fast response time (<100ms)
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
    }, 50) // Simulated <100ms response
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Handle keyboard shortcut for search (Ctrl/Cmd + K)
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

  // Navigation item component with accessible focus states
  const NavButton = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <button
      onClick={() => {
        setActiveNav(item.id)
        setMobileMenuOpen(false)
      }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted text-foreground"
        }
      `}
      aria-current={isActive ? "page" : undefined}
    >
      {item.icon}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{item.label}</div>
        <div className={`text-xs truncate ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {item.description}
        </div>
      </div>
      {isActive && <ChevronRight className="h-4 w-4 shrink-0" />}
    </button>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden focus:ring-2 focus:ring-blue-500"
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

          {/* Title */}
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold hidden sm:block">Equipment Manager - Admin Panel</h1>
            <h1 className="text-lg font-semibold sm:hidden">Admin Panel</h1>
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
                className="pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
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
                          className="w-full flex items-center justify-between p-2 hover:bg-muted rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <Button variant="outline" className="gap-2 focus:ring-2 focus:ring-blue-500">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden lg:inline">Export Data</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="focus:bg-blue-100">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as .xlsx
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-blue-100">
                  <FileText className="mr-2 h-4 w-4" />
                  Export as .pdf
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" className="gap-2 focus:ring-2 focus:ring-blue-500">
              <Database className="h-4 w-4" />
              <span className="hidden lg:inline">Import SQL Dump</span>
            </Button>
          </div>

          {/* Admin Profile Indicator */}
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium">Jan Kowalski</div>
              <div className="text-xs text-muted-foreground">via Google SSO (AGH)</div>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Jan Kowalski" />
              <AvatarFallback className="bg-primary text-primary-foreground">JK</AvatarFallback>
            </Avatar>
          </div>
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
          {/* Pending User Registrations Section */}
          <section aria-labelledby="pending-users-heading">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle id="pending-users-heading" className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pending User Registrations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  New users requiring admin approval. Review and assign appropriate roles.
                </p>
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
                        <TableRow 
                          key={user.id}
                          className="focus-within:bg-muted/30"
                          tabIndex={0}
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Select defaultValue={user.requestedRole.toLowerCase()}>
                              <SelectTrigger className="w-32 h-8 focus:ring-2 focus:ring-blue-500">
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
                                className="bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-blue-500"
                                aria-label={`Approve ${user.name}`}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="focus:ring-2 focus:ring-blue-500"
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

          {/* Global Equipment View Section */}
          <section aria-labelledby="equipment-heading">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle id="equipment-heading" className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Global Equipment View
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Complete inventory with admin override capabilities.
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold min-w-[100px]">ID</TableHead>
                          <TableHead className="font-semibold min-w-[200px]">Name</TableHead>
                          <TableHead className="font-semibold min-w-[180px]">Category</TableHead>
                          <TableHead className="font-semibold min-w-[220px]">Precise Location</TableHead>
                          <TableHead className="font-semibold min-w-[150px]">Assigned Owner</TableHead>
                          <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                          <TableHead className="font-semibold text-right min-w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allEquipment.map((equipment) => (
                          <TableRow 
                            key={equipment.id}
                            className="focus-within:bg-muted/30"
                            tabIndex={0}
                          >
                            <TableCell className="font-mono text-sm font-semibold">
                              {equipment.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {equipment.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {equipment.category}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {equipment.location}
                            </TableCell>
                            <TableCell>
                              {equipment.owner}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={equipment.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 focus:ring-2 focus:ring-blue-500"
                                    aria-label={`Actions for ${equipment.name}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem className="focus:bg-blue-100">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Any Field
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="focus:bg-blue-100">
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Reassign Owner
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="focus:bg-blue-100">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Force Return
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="focus:bg-blue-100">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Generate QR PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="focus:bg-blue-100">
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
    </div>
  )
}
