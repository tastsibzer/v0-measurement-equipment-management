"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, Send } from "lucide-react"

const debtors = [
  {
    id: 1,
    name: "Piotr Wiśniewski",
    email: "piotr.wisniewski@agh.edu.pl",
    missingDevices: 3,
    maxDelay: 15,
  },
  {
    id: 2,
    name: "Katarzyna Zielińska",
    email: "katarzyna.zielinska@agh.edu.pl",
    missingDevices: 2,
    maxDelay: 12,
  },
  {
    id: 3,
    name: "Tomasz Kowalczyk",
    email: "tomasz.kowalczyk@agh.edu.pl",
    missingDevices: 1,
    maxDelay: 8,
  },
  {
    id: 4,
    name: "Anna Nowak",
    email: "anna.nowak@agh.edu.pl",
    missingDevices: 1,
    maxDelay: 5,
  },
]

export function StatisticsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statystyki</h1>

      {/* Desktop Warning */}
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Monitor className="h-4 w-4" />
        <AlertDescription>
          Widok zoptymalizowany dla Desktopu. Zalecamy przeglądanie na większym
          ekranie.
        </AlertDescription>
      </Alert>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszystkie wypożyczone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">
              aktywnych wypożyczeń
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Braki / Przeterminowane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              urządzeń z opóźnieniem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Średni czas opóźnienia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground mt-1">dni</p>
          </CardContent>
        </Card>
      </div>

      {/* Debtors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Najwięksi dłużnicy sprzętowi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Użytkownik</TableHead>
                <TableHead className="text-center">Brakujące urządzenia</TableHead>
                <TableHead className="text-center">Maks. opóźnienie</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debtors.map((debtor) => (
                <TableRow key={debtor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{debtor.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {debtor.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold text-red-600">
                      {debtor.missingDevices}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold">{debtor.maxDelay} dni</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Wyślij ponaglenie
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {debtors.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Brak użytkowników z opóźnieniami.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
