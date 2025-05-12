"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft, Plus } from "lucide-react"
import type { AcademicsSection } from "@/lib/types"

interface AcademicsFormProps {
  academics: AcademicsSection
  setAcademics: (academics: AcademicsSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function AcademicsForm({ academics, setAcademics, onNext, onPrevious }: AcademicsFormProps) {
  const [activeTab, setActiveTab] = useState("workshops")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Academic Activities</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{academics.totalPoints}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="new-labs">New Labs</TabsTrigger>
          <TabsTrigger value="pg-dissertations">PG Dissertations</TabsTrigger>
          <TabsTrigger value="ug-projects">UG Projects</TabsTrigger>
          <TabsTrigger value="books">Books Published</TabsTrigger>
          <TabsTrigger value="appraisal">Faculty Appraisal</TabsTrigger>
          <TabsTrigger value="results">Subject Results</TabsTrigger>
        </TabsList>

        <TabsContent value="workshops" className="pt-4">
          <CardDescription className="mb-4">
            Add workshops, FDPs, and training programs (0.5 points per course)
          </CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about workshops, FDPs, and training programs you have attended or
              conducted.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Workshop/FDP
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="pt-4">
          <CardDescription className="mb-4">
            Add certifications completed (0.5 points per certification, max 5 points)
          </CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about certifications you have completed.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Certification
            </Button>
          </div>
        </TabsContent>

        {/* Other tab content sections would follow the same pattern */}
        {/* For brevity, I'm omitting the detailed implementation of all tabs */}
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous Section
        </Button>
        <Button onClick={onNext}>
          Next Section <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
