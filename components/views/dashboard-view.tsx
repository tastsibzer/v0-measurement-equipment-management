"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileSpreadsheet, FileText, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface DashboardViewProps {
  onViewDetails: (deviceId: string) => void
  onAddDevice: () => void
}

interface ParameterFilter {
  id: number
  key: string
  value: string
}

const mockDevices = [
  {
    id: "OPT-001",
    name: "Mikroskop optyczny Zeiss Axio",
    category: "Optyka",
    location: "Bud. B1, Sala 102",
    status: "available",
    statusLabel: "Dostępny",
  },
  {
    id: "ELE-015",
    name: "Oscyloskop Tektronix MDO3024",
    category: "Elektronika",
    location: "Bud. C3, Lab. 205",
    status: "borrowed",
    statusLabel: "Wypożyczony",
    borrower: "Anna Nowak",
  },
  {
    id: "MEC-042",
    name: "Czujnik siły tensometryczny HBM",
    category: "Mechanika",
    location: "Bud. A2, Sala 010",
    status: "overdue",
    statusLabel: "Wypożyczony (Spóźniony!)",
    borrower: "Piotr Wiśniewski",
    daysOverdue: 5,
  },
  {
    id: "OPT-023",
    name: "Spektrometr UV-VIS Shimadzu",
    category: "Optyka",
    location: "Bud. B1, Lab. 305",
    status: "available",
    statusLabel: "Dostępny",
  },
  {
    id: "ELE-089",
    name: "Analizator widma Rohde & Schwarz",
    category: "Elektronika",
    location: "Bud. C3, Sala 101",
    status: "borrowed",
    statusLabel: "Wypożyczony",
    borrower: "Tomasz Kowalczyk",
  },
  {
    id: "CHE-012",
    name: "pH-metr laboratoryjny Mettler Toledo",
    category: "Chemia",
    location: "Bud. D1, Lab. 402",
    status: "overdue",
    statusLabel: "Wypożyczony (Spóźniony!)",
    borrower: "Katarzyna Zielińska",
    daysOverdue: 12,
  },
]

export function DashboardView({ onViewDetails, onAddDevice }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("all")
  const [sortBy, setSortBy] = useState("az")
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)
  const [parameterFilters, setParameterFilters] = useState<ParameterFilter[]>([
    { id: 1, key: "", value: "" }
  ])

  const addParameterFilter = () => {
    setParameterFilters(prev => [
      ...prev,
      { id: Date.now(), key: "", value: "" }
    ])
  }

  const removeParameterFilter = (id: number) => {
    setParameterFilters(prev => prev.filter(f => f.id !== id))
  }

  const updateParameterFilter = (id: number, field: "key" | "value", newValue: string) => {
    setParameterFilters(prev =>
      prev.map(f => (f.id === id ? { ...f, [field]: newValue } : f))
    )
  }

  const clearAdvancedFilters = () => {
    setParameterFilters([{ id: 1, key: "", value: "" }])
  }

  const activeAdvancedFiltersCount = parameterFilters.filter(f => f.key && f.value).length

  const filteredDevices = mockDevices.filter((device) => {
    if (showOverdueOnly && device.status !== "overdue") return false
    if (category !== "all" && device.category !== category) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        device.name.toLowerCase().includes(query) ||
        device.id.toLowerCase().includes(query) ||
        device.category.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getStatusBadge = (device: typeof mockDevices[0]) => {
    switch (device.status) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">Dostępny</Badge>
      case "borrowed":
        return <Badge variant="secondary">Wypożyczony</Badge>
      case "overdue":
        return <Badge variant="destructive">Spóźniony</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Eksport .xlsx
          </Button>
          <Button
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <FileText className="mr-2 h-4 w-4" />
            Eksport .pdf
          </Button>
        </div>
        <Button
          onClick={onAddDevice}
          className="focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Dodaj sprzęt
        </Button>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj urządzenia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* Category */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie kategorie</SelectItem>
                <SelectItem value="Optyka">Optyka</SelectItem>
                <SelectItem value="Elektronika">Elektronika</SelectItem>
                <SelectItem value="Mechanika">Mechanika</SelectItem>
                <SelectItem value="Chemia">Chemia</SelectItem>
              </SelectContent>
            </Select>

            {/* Location */}
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                <SelectValue placeholder="Lokalizacja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie lokalizacje</SelectItem>
                <SelectItem value="b1">Budynek B1</SelectItem>
                <SelectItem value="c3">Budynek C3</SelectItem>
                <SelectItem value="a2">Budynek A2</SelectItem>
                <SelectItem value="d1">Budynek D1</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                <SelectValue placeholder="Sortuj" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="az">A-Z</SelectItem>
                <SelectItem value="za">Z-A</SelectItem>
                <SelectItem value="newest">Najnowsze</SelectItem>
                <SelectItem value="longest">Najdłużej przetrzymywane</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtry zaawansowane
                  {activeAdvancedFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeAdvancedFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filtry parametrów technicznych</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAdvancedFilters}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Wyczyść
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Wyszukaj urządzenia po konkretnych parametrach technicznych.
                  </p>
                  <div className="space-y-3">
                    {parameterFilters.map((filter, index) => (
                      <div key={filter.id} className="flex items-center gap-2">
                        <Input
                          placeholder="Parametr"
                          value={filter.key}
                          onChange={(e) => updateParameterFilter(filter.id, "key", e.target.value)}
                          className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                        <Input
                          placeholder="Wartość"
                          value={filter.value}
                          onChange={(e) => updateParameterFilter(filter.id, "value", e.target.value)}
                          className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                        />
                        {parameterFilters.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeParameterFilter(filter.id)}
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-blue-500"
                            aria-label="Usuń filtr"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParameterFilter}
                    className="w-full focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj filtr
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Overdue Checkbox */}
          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              id="overdue-only"
              checked={showOverdueOnly}
              onCheckedChange={(checked) => setShowOverdueOnly(checked === true)}
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            />
            <Label
              htmlFor="overdue-only"
              className="text-sm font-medium text-red-600 cursor-pointer"
            >
              Pokaż tylko opóźnienia
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Data Table - Desktop */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID / Nazwa</TableHead>
                <TableHead>Kategoria</TableHead>
                <TableHead>Lokalizacja</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-muted-foreground">{device.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{device.category}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(device)}
                      {device.borrower && (
                        <div className="text-xs text-muted-foreground">
                          {device.borrower}
                          {device.daysOverdue && (
                            <span className="text-red-600 ml-1">
                              ({device.daysOverdue} dni)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(device.id)}
                      className="focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      Szczegóły
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Card List - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredDevices.map((device) => (
          <Card key={device.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-sm text-muted-foreground">{device.id}</div>
                </div>
                {getStatusBadge(device)}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                <div>{device.category}</div>
                <div>{device.location}</div>
                {device.borrower && (
                  <div className="mt-1">
                    {device.borrower}
                    {device.daysOverdue && (
                      <span className="text-red-600 ml-1">
                        ({device.daysOverdue} dni spóźnienia)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(device.id)}
                className="w-full focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Szczegóły
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nie znaleziono urządzeń spełniających kryteria wyszukiwania.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
