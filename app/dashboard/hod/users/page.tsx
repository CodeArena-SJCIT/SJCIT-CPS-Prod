"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([
    {
      id: "hod-1",
      name: "Dr. Rajesh Kumar",
      email: "hod@example.com",
      role: "hod",
      department: "Computer Science",
    },
    {
      id: "faculty-1",
      name: "Dr. Priya Sharma",
      email: "faculty@example.com",
      role: "faculty",
      department: "Computer Science",
    },
  ])

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
    department: "Computer Science",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mongoStatus, setMongoStatus] = useState<"checking" | "connected" | "error">("checking")
  const [mongoError, setMongoError] = useState("")

  // Check MongoDB connection on component mount
  useState(() => {
    checkMongoConnection()
  })

  async function checkMongoConnection() {
    try {
      const response = await fetch("/api/check-mongo")
      const data = await response.json()

      if (data.connected) {
        setMongoStatus("connected")
        // If connected, fetch real users
        fetchUsers()
      } else {
        setMongoStatus("error")
        setMongoError(data.error || "Could not connect to MongoDB")
      }
    } catch (error) {
      setMongoStatus("error")
      setMongoError("Failed to check MongoDB connection")
    }
  }

  async function fetchUsers() {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      if (mongoStatus === "connected") {
        // If MongoDB is connected, send to API
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to create user")
        }

        setSuccess("User created successfully")
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "faculty",
          department: "Computer Science",
        })

        // Refresh user list
        fetchUsers()
      } else {
        // If MongoDB is not connected, just add to local state
        setUsers([
          ...users,
          {
            id: `temp-${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            department: newUser.department,
          },
        ])

        setSuccess("User added to temporary list (MongoDB not connected)")
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "faculty",
          department: "Computer Science",
        })
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {mongoStatus === "error" && (
        <Alert variant="destructive">
          <AlertDescription>MongoDB is not connected: {mongoError}. Using temporary hardcoded users.</AlertDescription>
        </Alert>
      )}

      {mongoStatus === "connected" && (
        <Alert className="bg-green-50">
          <AlertDescription>MongoDB is connected successfully. Users will be saved to the database.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding User..." : "Add User"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.department}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
