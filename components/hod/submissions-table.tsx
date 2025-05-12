"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Search, FileText, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SubmissionsTableProps {
  submissions: any[]
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.user.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApprove = async (id: string) => {
    try {
      setIsApproving(true)
      setError("")
      setSuccessMessage("")

      const response = await fetch(`/api/submissions/${id}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to approve submission")
      }

      setSuccessMessage("Submission approved successfully")

      // Wait a moment before closing the dialog
      setTimeout(() => {
        setSelectedSubmission(null)
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Error approving submission:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or department..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Faculty Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubmissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No submissions found.
              </TableCell>
            </TableRow>
          ) : (
            filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.user.name}</TableCell>
                <TableCell>{submission.user.department}</TableCell>
                <TableCell>{submission.academicYear}</TableCell>
                <TableCell>{new Date(submission.submittedDate).toLocaleDateString()}</TableCell>
                <TableCell>{submission.totalPoints}</TableCell>
                <TableCell>
                  <Badge variant={submission.status === "approved" ? "default" : "outline"}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(submission)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Faculty Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Faculty CPS Form Details</DialogTitle>
            <DialogDescription>Reviewing submission for {selectedSubmission?.user.name}</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="bg-green-50">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Faculty Name</h3>
                  <p className="font-medium">{selectedSubmission.user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="font-medium">{selectedSubmission.user.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Submitted Date</h3>
                  <p className="font-medium">{new Date(selectedSubmission.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Academic Year</h3>
                  <p className="font-medium">{selectedSubmission.academicYear}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Points</h3>
                  <p className="text-xl font-bold">{selectedSubmission.totalPoints}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <Badge variant={selectedSubmission.status === "approved" ? "default" : "outline"} className="mt-1">
                    {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <Tabs defaultValue="breakdown">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="breakdown">Point Breakdown</TabsTrigger>
                  <TabsTrigger value="details">Form Details</TabsTrigger>
                </TabsList>

                <TabsContent value="breakdown" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Research & Publications</span>
                      <span className="font-medium">{selectedSubmission.research.totalPoints} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Administrative Duties</span>
                      <span className="font-medium">{selectedSubmission.administration.totalPoints} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Academic Performance</span>
                      <span className="font-medium">{selectedSubmission.academics.totalPoints} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry Interaction</span>
                      <span className="font-medium">{selectedSubmission.industryInteraction.totalPoints} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placement Activities</span>
                      <span className="font-medium">{selectedSubmission.placementActivities.totalPoints} points</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Research Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Sponsored Projects: {selectedSubmission.research.sponsoredProjects.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Patents: {selectedSubmission.research.patents.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Journal Papers: {selectedSubmission.research.journalPapers.length}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Administrative Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Administrative Roles: {selectedSubmission.administration.administrativeRoles.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Committee Roles: {selectedSubmission.administration.committeeRoles.length}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Academic Details</h3>
                      <p className="text-sm text-muted-foreground">
                        Workshops & FDPs: {selectedSubmission.academics.workshops.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Books Published: {selectedSubmission.academics.booksPublished.length}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                {selectedSubmission.status === "pending" && (
                  <Button onClick={() => handleApprove(selectedSubmission.id)} disabled={isApproving}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isApproving ? "Approving..." : "Approve"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
