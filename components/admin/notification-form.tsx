"use client"

import { useState } from "react"
import { createNotification } from "@/app/actions/notifications"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NotificationFormProps {
  users: { id: string; name: string | null; email: string }[];
  classes: { id: string; subject: string; className: string }[];
}

export function NotificationForm({ users, classes }: NotificationFormProps) {
  const [open, setOpen] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const res = await createNotification(formData)
    if (res?.success) setOpen(false)
    else alert(res?.error)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Notification History</Button> 
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Create Notification History</DialogTitle></DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>User *</Label>
                    <Select name="userId" required>
                        <SelectTrigger><SelectValue placeholder="Select user..." /></SelectTrigger>
                        <SelectContent>
                            {users.map(u => (
                                <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Class Schedule</Label>
                    <Select name="classScheduleId">
                        <SelectTrigger><SelectValue placeholder="Optional..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.subject} ({c.className})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Notification Type</Label>
                <Input name="type" placeholder="Ex: System Alert, Class Update" required />
            </div>

            <div className="space-y-2">
                <Label>Message</Label>
                <Textarea name="message" placeholder="Type the notification content..." required />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="isRead" name="isRead" />
                <Label htmlFor="isRead">Is Read</Label>
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}