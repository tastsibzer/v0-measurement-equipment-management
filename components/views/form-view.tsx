"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Plus, Trash2 } from "lucide-react"

interface FormViewProps {
  deviceId: string | null
  onCancel: () => void
  onSave: () => void
}

interface TechnicalParameter {
  id: number
  name: string
  value: string
}

const categories = [
  {
    id: "optyka",
    name: "Optyka",
    children: [
      { id: "mikroskopy", name: "Mikroskopy" },
      { id: "spektrometry", name: "Spektrometry" },
      { id: "lasery", name: "Lasery" },
    ],
  },
  {
    id: "elektronika",
    name: "Elektronika",
    children: [
      { id: "oscyloskopy", name: "Oscyloskopy" },
      { id: "analizatory", name: "Analizatory widma" },
      { id: "generatory", name: "Generatory sygnałów" },
    ],
  },
  {
    id: "mechanika",
    name: "Mechanika",
    children: [
      { id: "czujniki", name: "Czujniki siły" },
      { id: "tensometry", name: "Tensometry" },
    ],
  },
  {
    id: "chemia",
    name: "Chemia",
    children: [
      { id: "phmetry", name: "pH-metry" },
      { id: "chromatografy", name: "Chromatografy" },
    ],
  },
]

const owners = [
  { id: "none", name: "Brak właściciela / Usuń przypisanie" },
  { id: "1", name: "dr hab. inż. Maria Kowalska" },
  { id: "2", name: "prof. dr hab. Jan Nowak" },
  { id: "3", name: "dr inż. Anna Wiśniewska" },
  { id: "4", name: "mgr inż. Piotr Zieliński" },
]

export function FormView({ deviceId, onCancel, onSave }: FormViewProps) {
  const isEditing = deviceId !== null
  const [formData, setFormData] = useState({
    name: isEditing ? "Mikroskop optyczny Zeiss Axio Imager.A2" : "",
    historicalId: isEditing ? "AGH-FIZ-2019-0042" : "",
    owner: isEditing ? "1" : "",
    category: isEditing ? "mikroskopy" : "",
    building: isEditing ? "b1" : "",
    room: isEditing ? "102" : "",
    preciseLocation: isEditing ? "Szafa A" : "",
    description: isEditing
      ? "Mikroskop optyczny przeznaczony do obserwacji preparatów biologicznych i materiałoznawczych."
      : "",
  })

  const [technicalParameters, setTechnicalParameters] = useState<TechnicalParameter[]>(
    isEditing
      ? [
          { id: 1, name: "Producent", value: "Zeiss" },
          { id: 2, name: "Model", value: "Axio Imager.A2" },
          { id: 3, name: "Powiększenie", value: "40x - 1000x" },
        ]
      : [{ id: 1, name: "", value: "" }]
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addParameter = () => {
    setTechnicalParameters((prev) => [
      ...prev,
      { id: Date.now(), name: "", value: "" },
    ])
  }

  const removeParameter = (id: number) => {
    setTechnicalParameters((prev) => prev.filter((p) => p.id !== id))
  }

  const updateParameter = (id: number, field: "name" | "value", newValue: string) => {
    setTechnicalParameters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: newValue } : p))
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edytuj urządzenie" : "Dodaj nowe urządzenie"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="device-name">
                Nazwa urządzenia <span className="text-red-500">*</span>
              </Label>
              <Input
                id="device-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="np. Mikroskop optyczny Zeiss"
                className="focus-visible:ring-2 focus-visible:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="historical-id">Oznaczenie historyczne</Label>
              <Input
                id="historical-id"
                value={formData.historicalId}
                onChange={(e) => handleInputChange("historicalId", e.target.value)}
                placeholder="np. AGH-FIZ-2019-0042"
                className="focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label htmlFor="owner">Właściciel</Label>
            <Select
              value={formData.owner}
              onValueChange={(value) => handleInputChange("owner", value)}
            >
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                <SelectValue placeholder="Wybierz właściciela" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Tree */}
          <div className="space-y-2">
            <Label>Kategoria</Label>
            <Card className="p-4">
              <RadioGroup
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                className="space-y-3"
              >
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="ml-4 space-y-2">
                      {category.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={child.id}
                            id={child.id}
                            className="focus-visible:ring-2 focus-visible:ring-blue-500"
                          />
                          <Label
                            htmlFor={child.id}
                            className="font-normal cursor-pointer"
                          >
                            {child.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Lokalizacja</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={formData.building}
                onValueChange={(value) => handleInputChange("building", value)}
              >
                <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Budynek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a1">Budynek A1</SelectItem>
                  <SelectItem value="a2">Budynek A2</SelectItem>
                  <SelectItem value="b1">Budynek B1</SelectItem>
                  <SelectItem value="c3">Budynek C3</SelectItem>
                  <SelectItem value="d1">Budynek D1</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={formData.room}
                onValueChange={(value) => handleInputChange("room", value)}
              >
                <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">Sala 101</SelectItem>
                  <SelectItem value="102">Sala 102</SelectItem>
                  <SelectItem value="103">Sala 103</SelectItem>
                  <SelectItem value="201">Sala 201</SelectItem>
                  <SelectItem value="205">Lab. 205</SelectItem>
                  <SelectItem value="305">Lab. 305</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={formData.preciseLocation}
                onChange={(e) =>
                  handleInputChange("preciseLocation", e.target.value)
                }
                placeholder="Precyzyjne miejsce (np. Szafa A)"
                className="focus-visible:ring-2 focus-visible:ring-blue-500"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Dodaj nową lokalizację"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Technical Parameters */}
          <div className="space-y-2">
            <Label>Parametry techniczne</Label>
            <Card className="p-4">
              <div className="space-y-3">
                {technicalParameters.map((param) => (
                  <div key={param.id} className="flex items-center gap-3">
                    <Input
                      placeholder="Nazwa parametru"
                      value={param.name}
                      onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                      className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Input
                      placeholder="Wartość"
                      value={param.value}
                      onChange={(e) => updateParameter(param.id, "value", e.target.value)}
                      className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    {technicalParameters.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParameter(param.id)}
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label="Usuń parametr"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addParameter}
                  className="w-full focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj parametr
                </Button>
              </div>
            </Card>
          </div>

          {/* Technical Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Opis techniczny</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Wprowadź szczegółowy opis techniczny urządzenia..."
              rows={5}
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Zdjęcia</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">Przeciągnij i upuść pliki tutaj</p>
                  <p className="text-sm text-muted-foreground">
                    lub kliknij, aby wybrać pliki
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Wybierz pliki
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={onSave}
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Zapisz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
