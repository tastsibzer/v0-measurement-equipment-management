"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Trash2, Plus } from "lucide-react"

const pendingRequests = [
  {
    id: 1,
    device: "Mikroskop optyczny Zeiss Axio",
    deviceId: "OPT-001",
    user: "mgr inż. Anna Wiśniewska",
    email: "anna.wisniewska@agh.edu.pl",
    date: "2024-01-20",
  },
  {
    id: 2,
    device: "Oscyloskop Tektronix MDO3024",
    deviceId: "ELE-015",
    user: "dr Tomasz Kowalczyk",
    email: "tomasz.kowalczyk@agh.edu.pl",
    date: "2024-01-19",
  },
  {
    id: 3,
    device: "Spektrometr UV-VIS Shimadzu",
    deviceId: "OPT-023",
    user: "mgr Katarzyna Nowak",
    email: "katarzyna.nowak@agh.edu.pl",
    date: "2024-01-18",
  },
]

const pendingReturns = [
  {
    id: 1,
    device: "Analizator widma Rohde & Schwarz",
    deviceId: "ELE-089",
    user: "Tomasz Kowalczyk",
    borrowDate: "2024-01-05",
    returnDate: "2024-01-20",
  },
  {
    id: 2,
    device: "pH-metr laboratoryjny Mettler Toledo",
    deviceId: "CHE-012",
    user: "Katarzyna Zielińska",
    borrowDate: "2023-12-15",
    returnDate: "2024-01-19",
  },
]

const trustedUsers = [
  { id: 1, email: "jan.kowalski@agh.edu.pl", name: "Jan Kowalski" },
  { id: 2, email: "maria.nowak@agh.edu.pl", name: "Maria Nowak" },
  { id: 3, email: "piotr.wisniewski@agh.edu.pl", name: "Piotr Wiśniewski" },
]

export function BorrowingsView() {
  const [newTrustedEmail, setNewTrustedEmail] = useState("")
  const [conditionSelects, setConditionSelects] = useState<Record<number, string>>({})

  const handleConditionChange = (returnId: number, value: string) => {
    setConditionSelects((prev) => ({ ...prev, [returnId]: value }))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wypożyczenia i zwroty</h1>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger
            value="pending"
            className="focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Oczekujące wnioski
          </TabsTrigger>
          <TabsTrigger
            value="returns"
            className="focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Potwierdzanie zwrotów
          </TabsTrigger>
          <TabsTrigger
            value="trusted"
            className="focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Użytkownicy zaufani
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pending Requests */}
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Oczekujące wnioski o wypożyczenie</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Urządzenie</TableHead>
                      <TableHead>Użytkownik</TableHead>
                      <TableHead>Data wniosku</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.device}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.deviceId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.user}</div>
                            <div className="text-sm text-muted-foreground">
                              {request.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Akceptuj
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              <X className="mr-1 h-4 w-4" />
                              Odrzuć
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <div className="font-medium">{request.device}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.deviceId}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div>{request.user}</div>
                        <div className="text-muted-foreground">{request.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Data: {request.date}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Akceptuj
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Odrzuć
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pendingRequests.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Brak oczekujących wniosków.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Returns Confirmation */}
        <TabsContent value="returns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Potwierdzanie zwrotów</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Urządzenie</TableHead>
                      <TableHead>Użytkownik</TableHead>
                      <TableHead>Data wypożyczenia</TableHead>
                      <TableHead>Data zwrotu</TableHead>
                      <TableHead>Stan sprzętu</TableHead>
                      <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReturns.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.device}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.deviceId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell>{item.borrowDate}</TableCell>
                        <TableCell>{item.returnDate}</TableCell>
                        <TableCell>
                          <Select
                            value={conditionSelects[item.id] || ""}
                            onValueChange={(value) =>
                              handleConditionChange(item.id, value)
                            }
                          >
                            <SelectTrigger className="w-36 focus-visible:ring-2 focus-visible:ring-blue-500">
                              <SelectValue placeholder="Wybierz stan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zgodny">Zgodny</SelectItem>
                              <SelectItem value="uszkodzony">Uszkodzony</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            className="focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            Zatwierdź zwrot
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {pendingReturns.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div>
                        <div className="font-medium">{item.device}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.deviceId}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div>Użytkownik: {item.user}</div>
                        <div className="text-muted-foreground">
                          Wypożyczono: {item.borrowDate}
                        </div>
                        <div className="text-muted-foreground">
                          Zwrot: {item.returnDate}
                        </div>
                      </div>
                      <Select
                        value={conditionSelects[item.id] || ""}
                        onValueChange={(value) =>
                          handleConditionChange(item.id, value)
                        }
                      >
                        <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                          <SelectValue placeholder="Stan sprzętu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zgodny">Zgodny</SelectItem>
                          <SelectItem value="uszkodzony">Uszkodzony</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full focus-visible:ring-2 focus-visible:ring-blue-500">
                        Zatwierdź zwrot
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pendingReturns.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Brak zwrotów do potwierdzenia.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Trusted Users */}
        <TabsContent value="trusted" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Użytkownicy zaufani</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new trusted user */}
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Wprowadź adres e-mail..."
                  value={newTrustedEmail}
                  onChange={(e) => setNewTrustedEmail(e.target.value)}
                  className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <Button className="focus-visible:ring-2 focus-visible:ring-blue-500">
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj
                </Button>
              </div>

              {/* List of trusted users */}
              <div className="space-y-2">
                {trustedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={`Usuń ${user.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {trustedUsers.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Brak zaufanych użytkowników.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
