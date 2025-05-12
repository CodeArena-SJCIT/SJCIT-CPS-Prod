"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  calculateAdministrativeRolePoints,
  calculateCommitteeRolePoints,
  calculateDepartmentalActivityPoints,
  calculateAdministrationPoints,
} from "@/lib/point-calculator"
import type { AdministrationSection, AdministrativeRole, CommitteeRole, DepartmentalActivity } from "@/lib/types"
import { Trash2, Plus, ChevronRight, ChevronLeft } from "lucide-react"

interface AdministrationFormProps {
  administration: AdministrationSection
  setAdministration: (administration: AdministrationSection) => void
  onNext: () => void
  onPrevious: () => void
}

export function AdministrationForm({ administration, setAdministration, onNext, onPrevious }: AdministrationFormProps) {
  const [activeTab, setActiveTab] = useState("admin-roles")

  // Add new administrative role
  const addAdministrativeRole = () => {
    const newRole: AdministrativeRole = {
      role: "",
      startDate: "",
      endDate: "",
      calculatedPoints: 0,
    }

    const updatedRoles = [...administration.administrativeRoles, newRole]
    setAdministration({
      ...administration,
      administrativeRoles: updatedRoles,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        administrativeRoles: updatedRoles,
      }),
    })
  }

  // Update administrative role
  const updateAdministrativeRole = (index: number, updatedRole: Partial<AdministrativeRole>) => {
    const updatedRoles = [...administration.administrativeRoles]
    updatedRoles[index] = {
      ...updatedRoles[index],
      ...updatedRole,
      calculatedPoints: calculateAdministrativeRolePoints({
        ...updatedRoles[index],
        ...updatedRole,
      }),
    }

    setAdministration({
      ...administration,
      administrativeRoles: updatedRoles,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        administrativeRoles: updatedRoles,
      }),
    })
  }

  // Remove administrative role
  const removeAdministrativeRole = (index: number) => {
    const updatedRoles = administration.administrativeRoles.filter((_, i) => i !== index)
    setAdministration({
      ...administration,
      administrativeRoles: updatedRoles,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        administrativeRoles: updatedRoles,
      }),
    })
  }

  // Add new committee role
  const addCommitteeRole = () => {
    const newRole: CommitteeRole = {
      committee: "",
      role: "",
      startDate: "",
      endDate: "",
      calculatedPoints: 0,
    }

    const updatedRoles = [...administration.committeeRoles, newRole]
    setAdministration({
      ...administration,
      committeeRoles: updatedRoles,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        committeeRoles: updatedRoles,
      }),
    })
  }

  // Update committee role
  const updateCommitteeRole = (index: number, updatedRole: Partial<CommitteeRole>) => {
    const updatedRoles = [...administration.committeeRoles]
    updatedRoles[index] = {
      ...updatedRoles[index],
      ...updatedRole,
      calculatedPoints: calculateCommitteeRolePoints({
        ...updatedRoles[index],
        ...updatedRole,
      }),
    }

    setAdministration({
      ...administration,
      committeeRoles: updatedRoles,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        committeeRoles: updatedRoles,
      }),
    })
  }

  // Remove committee role
  const removeCommitteeRole = (index: number) => {
    const updatedRoles = administration.committeeRoles.filter((_, i) => i !== index)
    setAdministration({
      ...administration,
      committeeRoles: updatedRoles,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        committeeRoles: updatedRoles,
      }),
    })
  }

  // Add new departmental activity
  const addDepartmentalActivity = () => {
    const newActivity: DepartmentalActivity = {
      activity: "",
      role: "",
      startDate: "",
      endDate: "",
      calculatedPoints: 0,
    }

    const updatedActivities = [...administration.departmentalActivities, newActivity]
    setAdministration({
      ...administration,
      departmentalActivities: updatedActivities,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        departmentalActivities: updatedActivities,
      }),
    })
  }

  // Update departmental activity
  const updateDepartmentalActivity = (index: number, updatedActivity: Partial<DepartmentalActivity>) => {
    const updatedActivities = [...administration.departmentalActivities]
    updatedActivities[index] = {
      ...updatedActivities[index],
      ...updatedActivity,
      calculatedPoints: calculateDepartmentalActivityPoints({
        ...updatedActivities[index],
        ...updatedActivity,
      }),
    }

    setAdministration({
      ...administration,
      departmentalActivities: updatedActivities,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        departmentalActivities: updatedActivities,
      }),
    })
  }

  // Remove departmental activity
  const removeDepartmentalActivity = (index: number) => {
    const updatedActivities = administration.departmentalActivities.filter((_, i) => i !== index)
    setAdministration({
      ...administration,
      departmentalActivities: updatedActivities,
      totalPoints: calculateAdministrationPoints({
        ...administration,
        departmentalActivities: updatedActivities,
      }),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Administrative Responsibilities</h2>
        <div className="text-sm text-muted-foreground">
          Points: <span className="font-medium">{administration.totalPoints}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="admin-roles">Administrative Roles</TabsTrigger>
          <TabsTrigger value="committee-roles">Committee Roles</TabsTrigger>
          <TabsTrigger value="dept-activities">Departmental Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="admin-roles" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <CardDescription>Add administrative roles (1 point per year, max 6 points)</CardDescription>
            <Button onClick={addAdministrativeRole} size="sm" variant="secondary">
              <Plus className="h-4 w-4 mr-1" /> Add Role
            </Button>
          </div>

          {administration.administrativeRoles.map((adminRole, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{adminRole.role || `Role ${index + 1}`}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 absolute top-2 right-2"
                    onClick={() => removeAdministrativeRole(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Points: {adminRole.calculatedPoints}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`admin-role-${index}`}>Role Title</Label>
                  <Input
                    id={`admin-role-${index}`}
                    value={adminRole.role}
                    onChange={(e) => updateAdministrativeRole(index, { role: e.target.value })}
                    placeholder="E.g. Dean, HOD, Coordinator"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`admin-start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`admin-start-date-${index}`}
                      type="date"
                      value={adminRole.startDate}
                      onChange={(e) => updateAdministrativeRole(index, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`admin-end-date-${index}`}>End Date</Label>
                    <Input
                      id={`admin-end-date-${index}`}
                      type="date"
                      value={adminRole.endDate}
                      onChange={(e) => updateAdministrativeRole(index, { endDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {administration.administrativeRoles.length === 0 && (
            <div className="text-center p-4 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">
                No administrative roles added yet. Click the button above to add one.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="committee-roles" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <CardDescription>Add committee roles (0.75/0.5 points per year, max 5 points)</CardDescription>
            <Button onClick={addCommitteeRole} size="sm" variant="secondary">
              <Plus className="h-4 w-4 mr-1" /> Add Role
            </Button>
          </div>

          {administration.committeeRoles.map((committeeRole, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base">
                    {committeeRole.committee
                      ? `${committeeRole.committee} - ${committeeRole.role}`
                      : `Committee Role ${index + 1}`}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 absolute top-2 right-2"
                    onClick={() => removeCommitteeRole(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Points: {committeeRole.calculatedPoints}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`committee-name-${index}`}>Committee Name</Label>
                    <Input
                      id={`committee-name-${index}`}
                      value={committeeRole.committee}
                      onChange={(e) => updateCommitteeRole(index, { committee: e.target.value })}
                      placeholder="E.g. Academic Council, IQAC"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`committee-role-${index}`}>Your Role</Label>
                    <Input
                      id={`committee-role-${index}`}
                      value={committeeRole.role}
                      onChange={(e) => updateCommitteeRole(index, { role: e.target.value })}
                      placeholder="E.g. Chairman, Member"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`committee-start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`committee-start-date-${index}`}
                      type="date"
                      value={committeeRole.startDate}
                      onChange={(e) => updateCommitteeRole(index, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`committee-end-date-${index}`}>End Date</Label>
                    <Input
                      id={`committee-end-date-${index}`}
                      type="date"
                      value={committeeRole.endDate}
                      onChange={(e) => updateCommitteeRole(index, { endDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {administration.committeeRoles.length === 0 && (
            <div className="text-center p-4 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">No committee roles added yet. Click the button above to add one.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="dept-activities" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <CardDescription>Add departmental activities (0.25 points per semester, max 5 points)</CardDescription>
            <Button onClick={addDepartmentalActivity} size="sm" variant="secondary">
              <Plus className="h-4 w-4 mr-1" /> Add Activity
            </Button>
          </div>

          {administration.departmentalActivities.map((activity, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{activity.activity || `Activity ${index + 1}`}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 absolute top-2 right-2"
                    onClick={() => removeDepartmentalActivity(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Points: {activity.calculatedPoints}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4 grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`activity-name-${index}`}>Activity Name</Label>
                  <Input
                    id={`activity-name-${index}`}
                    value={activity.activity}
                    onChange={(e) => updateDepartmentalActivity(index, { activity: e.target.value })}
                    placeholder="E.g. Class Advisor, Lab In-charge"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`activity-role-${index}`}>Your Role</Label>
                  <Input
                    id={`activity-role-${index}`}
                    value={activity.role}
                    onChange={(e) => updateDepartmentalActivity(index, { role: e.target.value })}
                    placeholder="Your role in this activity"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`activity-start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`activity-start-date-${index}`}
                      type="date"
                      value={activity.startDate}
                      onChange={(e) => updateDepartmentalActivity(index, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`activity-end-date-${index}`}>End Date</Label>
                    <Input
                      id={`activity-end-date-${index}`}
                      type="date"
                      value={activity.endDate}
                      onChange={(e) => updateDepartmentalActivity(index, { endDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {administration.departmentalActivities.length === 0 && (
            <div className="text-center p-4 bg-muted/50 rounded-md">
              <p className="text-muted-foreground">
                No departmental activities added yet. Click the button above to add one.
              </p>
            </div>
          )}
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
