"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, Trash2, Plus, Upload, QrCode } from "lucide-react"

const pendingAccounts = [
  {
    id: 1,
    email: "jan.kowalski@student.agh.edu.pl",
    name: "Jan Kowalski",
    date: "2024-01-20",
  },
  {
    id: 2,
    email: "anna.wisniewska@agh.edu.pl",
    name: "Anna Wiśniewska",
    date: "2024-01-19",
  },
  {
    id: 3,
    email: "piotr.nowak@student.agh.edu.pl",
    name: "Piotr Nowak",
    date: "2024-01-18",
  },
]

const categories = [
  { id: 1, name: "Optyka" },
  { id: 2, name: "Elektronika" },
  { id: 3, name: "Mechanika" },
  { id: 4, name: "Chemia" },
  { id: 5, name: "Informatyka" },
]

export function AdminView() {
  const [newCategory, setNewCategory] = useState("")
  const [roleSelects, setRoleSelects] = useState<Record<number, string>>({})
  const [labelText, setLabelText] = useState("Własność AGH\nWydział Fizyki i Informatyki Stosowanej")
  const [labelImage, setLabelImage] = useState<string | null>(null)

  const handleRoleChange = (accountId: number, value: string) => {
    setRoleSelects((prev) => ({ ...prev, [accountId]: value }))
  }

  const handleImageUpload = () => {
    // Simulate image upload - in real app would use file input
    setLabelImage("/placeholder-logo.png")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administracja</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Account Approval */}
        <Card>
          <CardHeader>
            <CardTitle>Akceptacja nowych kont</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{account.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {account.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Zgłoszono: {account.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={roleSelects[account.id] || ""}
                      onValueChange={(value) => handleRoleChange(account.id, value)}
                    >
                      <SelectTrigger className="w-28 focus-visible:ring-2 focus-visible:ring-blue-500">
                        <SelectValue placeholder="Rola" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktywny">Aktywny</SelectItem>
                        <SelectItem value="podglad">Podgląd</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="icon"
                      className="bg-green-600 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={`Akceptuj konto ${account.name}`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      className="focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={`Odrzuć konto ${account.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {pendingAccounts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Brak oczekujących kont do zatwierdzenia.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Category Tree Management */}
        <Card>
          <CardHeader>
            <CardTitle>Zarządzanie drzewem kategorii</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add new category */}
            <div className="flex gap-2">
              <Input
                placeholder="Nazwa nowej kategorii..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              <Button className="focus-visible:ring-2 focus-visible:ring-blue-500">
                <Plus className="mr-2 h-4 w-4" />
                Dodaj
              </Button>
            </div>

            {/* List of categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Usuń kategorię ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Brak kategorii.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Card 3: QR Label Template Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Edytor szablonu etykiety</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Editor Controls */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Grafika na etykiecie</Label>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onClick={handleImageUpload}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Prześlij logo lub grafikę</p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG do 2MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Wybierz plik
                    </Button>
                  </div>
                </div>
              </div>

              {/* Label Text */}
              <div className="space-y-2">
                <Label htmlFor="label-text">Domyślny tekst na etykiecie</Label>
                <Textarea
                  id="label-text"
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  placeholder="Wprowadź tekst, który pojawi się na etykiecie..."
                  rows={3}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <Button className="w-full focus-visible:ring-2 focus-visible:ring-blue-500">
                Zapisz szablon
              </Button>
            </div>

            {/* Live Preview */}
            <div className="space-y-2">
              <Label>Podgląd na żywo</Label>
              <div className="border rounded-lg p-6 bg-white min-h-[300px] flex flex-col items-center justify-center">
                <div className="w-48 border-2 border-gray-300 rounded-lg p-4 bg-white shadow-sm flex flex-col items-center gap-3">
                  {/* Logo placeholder */}
                  <div className="w-full h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-muted-foreground">
                    {labelImage ? (
                      <span className="text-green-600 font-medium">Logo AGH</span>
                    ) : (
                      "Logo"
                    )}
                  </div>

                  {/* Label text */}
                  <div className="text-center text-xs whitespace-pre-line">
                    {labelText || "Tekst etykiety"}
                  </div>

                  {/* QR Code placeholder */}
                  <div className="w-20 h-20 bg-gray-900 rounded flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-white" />
                  </div>

                  {/* Device ID placeholder */}
                  <div className="text-xs font-mono text-muted-foreground">
                    OPT-001
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Wymiary: 50mm x 80mm
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
