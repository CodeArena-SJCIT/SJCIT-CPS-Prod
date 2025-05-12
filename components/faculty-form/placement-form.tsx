"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft, Plus } from "lucide-react"
import type { PlacementActivitiesSection } from "@/lib/types"

interface PlacementFormProps {
  placementActivities: PlacementActivitiesSection
  setPlacementActivities: (placementActivities: PlacementActivitiesSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function PlacementForm({ placementActivities, setPlacementActivities, onNext, onPrevious }: PlacementFormProps) {
  const [activeTab, setActiveTab] = useState("percentage")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Placement Activities</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{placementActivities.totalPoints}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="percentage">Placement Percentage</TabsTrigger>
          <TabsTrigger value="assistance">Placement Assistance</TabsTrigger>
          <TabsTrigger value="startup">Startup Mentoring</TabsTrigger>
        </TabsList>

        <TabsContent value="percentage" className="pt-4">
          <CardDescription className="mb-4">
            Add placement percentage data (points based on percentage achieved, max 20 points)
          </CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about placement percentage achieved by your department/students.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Placement Percentage
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="assistance" className="pt-4">
          <CardDescription className="mb-4">
            Add placement assistance data (0.25 points per student placed, max 5 points per year)
          </CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about your contribution to placing students.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Placement Assistance
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="startup" className="pt-4">
          <CardDescription className="mb-4">Add startup mentoring data (5 points per startup)</CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about startups you have mentored.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Startup Mentoring
            </Button>
          </div>
        </TabsContent>
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
