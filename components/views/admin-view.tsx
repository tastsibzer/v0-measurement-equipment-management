"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Check, X, Trash2, Plus, Upload, QrCode } from "lucide-react"

// Poprawiona struktura drzewiasta dla kategorii
const initialCategories = [
  { id: "1", name: "Optyka", parentId: null, depth: 0 },
  { id: "2", name: "Mikroskopy", parentId: "1", depth: 1 },
  { id: "3", name: "Mikroskopy Elektronowe", parentId: "2", depth: 2 },
  { id: "4", name: "Elektronika", parentId: null, depth: 0 },
  { id: "5", name: "Oscyloskopy", parentId: "4", depth: 1 },
]

export function AdminView() {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedParentId, setSelectedParentId] = useState<string>("none")
  
  // Stan dla edytora etykiety
  const [labelPrefix, setLabelPrefix] = useState("Akademia Górniczo-Hutnicza\nWydział Fizyki")
  const [logoUploaded, setLogoUploaded] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administracja</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Karta 1: Akceptacja kont (Bez zmian) */}
        <Card>
          <CardHeader>
            <CardTitle>Akceptacja nowych kont</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Wybierz rolę i zaakceptuj konta logujące się przez domenę AGH.</p>
            <div className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-medium">Jan Kowalski</div>
                <div className="text-sm text-muted-foreground">jan.kowalski@agh.edu.pl</div>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="aktywny">
                  <SelectTrigger className="w-32 focus-visible:ring-2 focus-visible:ring-blue-500">
                    <SelectValue placeholder="Rola" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktywny">Aktywny</SelectItem>
                    <SelectItem value="podglad">Tylko Podgląd</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" className="bg-green-600 hover:bg-green-700"><Check className="h-4 w-4" /></Button>
                <Button size="icon" variant="destructive"><X className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Karta 2: Wielopoziomowe Drzewo Kategorii */}
        <Card>
          <CardHeader>
            <CardTitle>Zarządzanie drzewem kategorii</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
              <Label>Dodaj nową kategorię</Label>
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Nazwa kategorii..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <div className="flex gap-2">
                  <Select value={selectedParentId} onValueChange={setSelectedParentId}>
                    <SelectTrigger className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500">
                      <SelectValue placeholder="Kategoria nadrzędna (Rodzic)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Brak (Kategoria główna) --</SelectItem>
                      {initialCategories.map(cat => (
                         <SelectItem key={cat.id} value={cat.id}>
                           {"\u00A0\u00A0".repeat(cat.depth)} {cat.name}
                         </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="focus-visible:ring-2 focus-visible:ring-blue-500">
                    <Plus className="h-4 w-4 mr-2" /> Dodaj
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1 bg-background border rounded-lg p-2 max-h-64 overflow-y-auto">
              {initialCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md group"
                  style={{ paddingLeft: `${(category.depth * 1.5) + 0.5}rem` }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Karta 3: NOWOŚĆ - Edytor Etykiety */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edytor szablonu etykiety (PDF)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo / Grafika nagłówka</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 cursor-pointer transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">Kliknij, aby wgrać logo (PNG/JPG)</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Domyślny tekst nad kodem QR</Label>
                  <Input 
                    value={labelPrefix}
                    onChange={(e) => setLabelPrefix(e.target.value)}
                    className="focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
                <Button className="w-full focus-visible:ring-2 focus-visible:ring-blue-500">Zapisz szablon</Button>
              </div>

              {/* Podgląd na żywo */}
              <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg border p-6">
                <Label className="mb-4 text-muted-foreground uppercase text-xs font-bold tracking-wider">Podgląd na żywo (Live Preview)</Label>
                <div className="bg-white border-2 border-gray-200 shadow-sm w-64 p-4 flex flex-col items-center text-center gap-3">
                  {/* Mock Logo */}
                  <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs">
                    LOGO
                  </div>
                  {/* Dynamic Text */}
                  <div className="text-xs font-semibold text-black whitespace-pre-wrap leading-tight">
                    {labelPrefix}
                  </div>
                  <div className="text-[10px] text-gray-500 border-b border-t py-1 w-full">
                    ID: AGH-001 (Automatyczne)
                  </div>
                  {/* Mock QR */}
                  <QrCode className="w-24 h-24 text-black" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}