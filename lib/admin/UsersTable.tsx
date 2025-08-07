"use client";

import { User } from "@/database/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveTutor, rejectTutor } from "@/lib/admin/actions/user.actions";

interface UsersTableProps {
  users: User[];
}

const UsersTable = ({ users }: UsersTableProps) => {
  const handleApprove = async (userId: string) => {
    await approveTutor(userId);
  };

  const handleReject = async (userId: string) => {
    // In a real app, you'd have a modal to enter a rejection reason.
    const reason = "Your profile does not meet our current requirements.";
    await rejectTutor(userId, reason);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Profile Progress</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.status === "APPROVED" ? "default" : "secondary"}
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>{user.profileCompletionPercentage}%</TableCell>
            <TableCell>
              {user.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(user.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
