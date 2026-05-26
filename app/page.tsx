"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { LoginView } from "@/components/views/login-view"
import { DashboardView } from "@/components/views/dashboard-view"
import { DetailsView } from "@/components/views/details-view"
import { FormView } from "@/components/views/form-view"
import { BorrowingsView } from "@/components/views/borrowings-view"
import { StatisticsView } from "@/components/views/statistics-view"
import { AdminView } from "@/components/views/admin-view"

export type ViewType = "login" | "dashboard" | "details" | "form" | "borrowings" | "statistics" | "admin"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentView("login")
  }

  const handleViewDetails = (deviceId: string) => {
    setSelectedDeviceId(deviceId)
    setCurrentView("details")
  }

  const handleEditDevice = (deviceId: string | null) => {
    setEditingDeviceId(deviceId)
    setCurrentView("form")
  }

  const handleAddDevice = () => {
    setEditingDeviceId(null)
    setCurrentView("form")
  }

  const renderView = () => {
    if (!isLoggedIn && currentView !== "login") {
      return <LoginView onLogin={handleLogin} />
    }

    switch (currentView) {
      case "login":
        return <LoginView onLogin={handleLogin} />
      case "dashboard":
        return (
          <DashboardView
            onViewDetails={handleViewDetails}
            onAddDevice={handleAddDevice}
          />
        )
      case "details":
        return (
          <DetailsView
            deviceId={selectedDeviceId}
            onBack={() => setCurrentView("dashboard")}
            onEdit={() => handleEditDevice(selectedDeviceId)}
          />
        )
      case "form":
        return (
          <FormView
            deviceId={editingDeviceId}
            onCancel={() => setCurrentView(editingDeviceId ? "details" : "dashboard")}
            onSave={() => setCurrentView("dashboard")}
          />
        )
      case "borrowings":
        return <BorrowingsView />
      case "statistics":
        return <StatisticsView />
      case "admin":
        return <AdminView />
      default:
        return <DashboardView onViewDetails={handleViewDetails} onAddDevice={handleAddDevice} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-6">
        {renderView()}
      </main>
    </div>
  )
}
