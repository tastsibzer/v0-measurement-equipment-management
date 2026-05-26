"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileSpreadsheet, FileText, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface DashboardViewProps {
  onViewDetails: (deviceId: string) => void
  onAddDevice: () => void
}

export function DashboardView({ onViewDetails, onAddDevice }: DashboardViewProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [paramFilters, setParamFilters] = useState([{ key: "", value: "" }])

  const addParamFilter = () => setParamFilters([...paramFilters, { key: "", value: "" }])
  const removeParamFilter = (index: number) => setParamFilters(paramFilters.filter((_, i) => i !== index))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Eksport .xlsx
          </Button>
          <Button variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
            <FileText className="mr-2 h-4 w-4" /> Eksport .pdf
          </Button>
        </div>
        <Button onClick={onAddDevice}><Plus className="mr-2 h-4 w-4" /> Dodaj sprzęt</Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2 relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Szukaj urządzenia..." className="pl-10" />
              </div>
              <Button 
                variant={showAdvanced ? "secondary" : "outline"} 
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <SlidersHorizontal className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Zaawansowane</span>
              </Button>
            </div>
            <Select>
              <SelectTrigger><SelectValue placeholder="Kategoria" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Wszystkie</SelectItem></SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Sortuj" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="az">Nazwa (A-Z)</SelectItem>
                <SelectItem value="za">Nazwa (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 pl-2 border-l">
              <Checkbox id="overdue" />
              <Label htmlFor="overdue" className="text-sm font-bold text-red-600 cursor-pointer">Tylko opóźnienia</Label>
            </div>
          </div>

          {/* Sekcja parametrów zaawansowanych */}
          {showAdvanced && (
            <div className="p-4 bg-muted/30 rounded-lg border space-y-3 mt-4">
              <Label className="text-sm font-semibold">Wyszukiwanie po parametrach technicznych</Label>
              {paramFilters.map((param, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input placeholder="Nazwa parametru (np. Producent)" className="flex-1 bg-background" />
                  <Input placeholder="Wartość (np. Rigol)" className="flex-1 bg-background" />
                  <Button variant="ghost" size="icon" onClick={() => removeParamFilter(index)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addParamFilter} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Dodaj kryterium parametru
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mock Table - skrócona dla przejrzystości, bez zmian w wierszach */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID / Nazwa</TableHead>
              <TableHead>Lokalizacja</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell><div className="font-bold">AGH-001</div><div className="text-sm">Mikroskop elektronowy</div></TableCell>
              <TableCell>Bud. B1</TableCell>
              <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => onViewDetails("AGH-001")}>Szczegóły</Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}