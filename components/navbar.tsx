"use client"

import { Microscope, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import type { ViewType } from "@/app/page"

interface NavbarProps {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  isLoggedIn: boolean
  onLogout: () => void
}

const navItems: { label: string; view: ViewType }[] = [
  { label: "Baza Urządzeń", view: "dashboard" },
  { label: "Wypożyczenia", view: "borrowings" },
  { label: "Statystyki", view: "statistics" },
  { label: "Administracja", view: "admin" },
]

export function Navbar({ currentView, setCurrentView, isLoggedIn, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center gap-2 font-semibold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1"
          >
            <Microscope className="h-6 w-6 text-primary" />
            <span>Aparatura AGH</span>
          </button>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.view}
                  variant={currentView === item.view ? "secondary" : "ghost"}
                  onClick={() => handleNavClick(item.view)}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Jan Kowalski (Admin)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Wyloguj"
                >
                  <LogOut className="h-5 w-5" />
                </Button>

                {/* Mobile Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col gap-2 mt-8">
                      {navItems.map((item) => (
                        <Button
                          key={item.view}
                          variant={currentView === item.view ? "secondary" : "ghost"}
                          onClick={() => handleNavClick(item.view)}
                          className="justify-start focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
