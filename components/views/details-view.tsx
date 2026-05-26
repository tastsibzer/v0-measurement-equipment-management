"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Link2, Pencil, Trash2, Printer, X, ChevronRight } from "lucide-react"

interface DetailsViewProps {
  deviceId: string | null
  onBack: () => void
  onEdit: () => void
}

const mockDevice = {
  id: "OPT-001",
  name: "Mikroskop optyczny Zeiss Axio Imager.A2",
  historicalId: "AGH-FIZ-2019-0042",
  status: "available",
  statusLabel: "Dostępny",
  owner: "dr hab. inż. Maria Kowalska",
  delegatedTo: "mgr inż. Piotr Nowak",
  location: {
    building: "Bud. B1",
    room: "Sala 102",
    precise: "Szafa A",
  },
  description: `Mikroskop optyczny przeznaczony do obserwacji preparatów biologicznych i materiałoznawczych. 
Wyposażony w obiektywy Plan-Apochromat 10x/0.45, 20x/0.8, 40x/0.95 i 100x/1.4 Oil. 
Kamera cyfrowa Axiocam 506 color z rozdzielczością 6 Mpix.
Oprogramowanie ZEN 2.3 (blue edition).
Maksymalne powiększenie: 1000x.`,
  photos: [
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ],
  history: [
    {
      id: 1,
      type: "return",
      text: "Zwrócone przez mgr Annę Wiśniewską",
      date: "2024-01-15",
      status: "normal",
    },
    {
      id: 2,
      type: "borrow",
      text: "Wypożyczone przez mgr Annę Wiśniewską",
      date: "2024-01-02",
      status: "normal",
    },
    {
      id: 3,
      type: "overdue",
      text: "Wypożyczone przez Piotr Wiśniewski, 5 dni spóźnienia",
      date: "2023-12-10",
      status: "overdue",
    },
    {
      id: 4,
      type: "return",
      text: "Zwrócone przez dr Tomasza Kowalczyka",
      date: "2023-11-28",
      status: "normal",
    },
    {
      id: 5,
      type: "created",
      text: "Dodano do systemu",
      date: "2023-06-01",
      status: "normal",
    },
  ],
}

export function DetailsView({ onBack, onEdit }: DetailsViewProps) {
  const handleDeletePhoto = (index: number) => {
    console.log("Delete photo:", index)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-fit focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do listy
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{mockDevice.name}</h1>
              <Badge className="bg-green-500 hover:bg-green-600">
                {mockDevice.statusLabel}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Oznaczenie historyczne: {mockDevice.historicalId}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Link dla gościa
            </Button>
            <Button
              variant="outline"
              onClick={onEdit}
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edytuj
            </Button>
            <Button className="focus-visible:ring-2 focus-visible:ring-blue-500">
              Zgłoś chęć wypożyczenia
            </Button>
            <Button
              variant="destructive"
              className="focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Usuń sprzęt
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner & Delegation */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Właściciel:</span>
                <p className="font-medium">{mockDevice.owner}</p>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Delegacja uprawnień:
                  </span>
                  <p className="font-medium">{mockDevice.delegatedTo}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Zarządzaj
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lokalizacja</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{mockDevice.location.building}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{mockDevice.location.room}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{mockDevice.location.precise}</span>
              </div>
            </CardContent>
          </Card>

          {/* Technical Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Opis techniczny</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{mockDevice.description}</p>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Galeria zdjęć</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockDevice.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Zdjęcie ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border bg-muted"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:opacity-100"
                      onClick={() => handleDeletePhoto(index)}
                      aria-label={`Usuń zdjęcie ${index + 1}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kod QR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="w-40 h-40 bg-muted border rounded-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-32 h-32"
                    fill="currentColor"
                  >
                    <rect x="10" y="10" width="20" height="20" />
                    <rect x="70" y="10" width="20" height="20" />
                    <rect x="10" y="70" width="20" height="20" />
                    <rect x="35" y="10" width="5" height="5" />
                    <rect x="45" y="10" width="5" height="5" />
                    <rect x="55" y="10" width="5" height="5" />
                    <rect x="35" y="20" width="5" height="5" />
                    <rect x="55" y="20" width="5" height="5" />
                    <rect x="10" y="35" width="5" height="5" />
                    <rect x="20" y="35" width="5" height="5" />
                    <rect x="35" y="35" width="5" height="5" />
                    <rect x="45" y="35" width="10" height="10" />
                    <rect x="60" y="35" width="5" height="5" />
                    <rect x="75" y="35" width="5" height="5" />
                    <rect x="85" y="35" width="5" height="5" />
                    <rect x="10" y="45" width="5" height="5" />
                    <rect x="25" y="45" width="5" height="5" />
                    <rect x="35" y="45" width="5" height="5" />
                    <rect x="60" y="45" width="5" height="5" />
                    <rect x="85" y="45" width="5" height="5" />
                    <rect x="10" y="55" width="5" height="5" />
                    <rect x="20" y="55" width="5" height="5" />
                    <rect x="35" y="55" width="5" height="5" />
                    <rect x="45" y="55" width="5" height="5" />
                    <rect x="55" y="55" width="5" height="5" />
                    <rect x="70" y="55" width="5" height="5" />
                    <rect x="80" y="55" width="5" height="5" />
                    <rect x="35" y="70" width="5" height="5" />
                    <rect x="45" y="70" width="5" height="5" />
                    <rect x="60" y="70" width="5" height="5" />
                    <rect x="75" y="70" width="5" height="5" />
                    <rect x="85" y="70" width="5" height="5" />
                    <rect x="35" y="80" width="5" height="5" />
                    <rect x="55" y="80" width="5" height="5" />
                    <rect x="70" y="80" width="5" height="5" />
                    <rect x="85" y="80" width="5" height="5" />
                    <rect x="45" y="85" width="5" height="5" />
                    <rect x="60" y="85" width="5" height="5" />
                    <rect x="75" y="85" width="5" height="5" />
                  </svg>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Printer className="mr-2 h-4 w-4" />
                Drukuj etykietę (.pdf)
              </Button>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDevice.history.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.status === "overdue"
                            ? "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      />
                      {index < mockDevice.history.length - 1 && (
                        <div className="w-px h-full bg-border flex-1 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`text-sm ${
                          event.status === "overdue"
                            ? "text-red-600 font-medium"
                            : ""
                        }`}
                      >
                        {event.text}
                      </p>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
