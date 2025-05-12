"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft, Plus } from "lucide-react"
import type { IndustryInteractionSection } from "@/lib/types"

interface IndustryFormProps {
  industryInteraction: IndustryInteractionSection
  setIndustryInteraction: (industryInteraction: IndustryInteractionSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function IndustryForm({ industryInteraction, setIndustryInteraction, onNext, onPrevious }: IndustryFormProps) {
  const [activeTab, setActiveTab] = useState("attachments")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Industry-Institute Interaction</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{industryInteraction.totalPoints}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="attachments">Industry Attachments</TabsTrigger>
          <TabsTrigger value="projects">Industry Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="attachments" className="pt-4">
          <CardDescription className="mb-4">
            Add industry attachments (1 point for 4 weeks, 2 points for 8 weeks, max 6 points)
          </CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about your attachments with industry partners.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Industry Attachment
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="pt-4">
          <CardDescription className="mb-4">Add industry projects (1 point per project, max 6 points)</CardDescription>
          <div className="text-center p-6 bg-muted/50 rounded-md">
            <p className="text-muted-foreground mb-4">
              This section allows you to add details about projects undertaken in collaboration with industry.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Industry Project
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
