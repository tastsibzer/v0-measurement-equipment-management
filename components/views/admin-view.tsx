"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, Trash2, Plus } from "lucide-react"

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

  const handleRoleChange = (accountId: number, value: string) => {
    setRoleSelects((prev) => ({ ...prev, [accountId]: value }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administracja</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Account Approval */}
        <Card>
          <CardHeader>
            <CardTitle>Akceptacja nowych kont (Konta AGH)</CardTitle>
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
    </div>
  )
}
