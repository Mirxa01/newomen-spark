import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Download,
  Filter,
  Mail,
  Crown,
  Star,
  Sparkles,
  Eye,
  Ban,
  Trash2,
} from "lucide-react";

// Mock user data
const mockUsers = [
  {
    id: "1",
    email: "sarah@example.com",
    nickname: "Sarah M.",
    tier: "transformation",
    status: "active",
    voiceMinutes: 145,
    sessionsCount: 23,
    joinedAt: "2025-10-15",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    email: "elena@example.com",
    nickname: "Elena R.",
    tier: "transformation",
    status: "active",
    voiceMinutes: 287,
    sessionsCount: 45,
    joinedAt: "2025-09-22",
    lastActive: "5 minutes ago",
  },
  {
    id: "3",
    email: "mira@example.com",
    nickname: "Mira K.",
    tier: "growth",
    status: "active",
    voiceMinutes: 52,
    sessionsCount: 12,
    joinedAt: "2025-12-01",
    lastActive: "1 day ago",
  },
  {
    id: "4",
    email: "aisha@example.com",
    nickname: "Aisha J.",
    tier: "growth",
    status: "active",
    voiceMinutes: 38,
    sessionsCount: 8,
    joinedAt: "2025-12-15",
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    email: "luna@example.com",
    nickname: "Luna S.",
    tier: "discovery",
    status: "active",
    voiceMinutes: 5,
    sessionsCount: 2,
    joinedAt: "2026-01-10",
    lastActive: "1 week ago",
  },
  {
    id: "6",
    email: "maya@example.com",
    nickname: "Maya P.",
    tier: "discovery",
    status: "inactive",
    voiceMinutes: 3,
    sessionsCount: 1,
    joinedAt: "2025-11-20",
    lastActive: "3 weeks ago",
  },
];

const tierIcons: Record<string, React.ElementType> = {
  discovery: Sparkles,
  growth: Star,
  transformation: Crown,
};

const tierColors: Record<string, string> = {
  discovery: "secondary",
  growth: "default",
  transformation: "outline",
};

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = !selectedTier || user.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and subscriptions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold">2,847</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-gold" />
              <p className="text-sm text-muted-foreground">Transformation</p>
            </div>
            <p className="text-2xl font-bold">257</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">Growth</p>
            </div>
            <p className="text-2xl font-bold">756</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal" />
              <p className="text-sm text-muted-foreground">Discovery</p>
            </div>
            <p className="text-2xl font-bold">1,834</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedTier === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier(null)}
              >
                All
              </Button>
              <Button
                variant={selectedTier === "transformation" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("transformation")}
              >
                <Crown className="h-4 w-4 mr-1" />
                Transformation
              </Button>
              <Button
                variant={selectedTier === "growth" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("growth")}
              >
                <Star className="h-4 w-4 mr-1" />
                Growth
              </Button>
              <Button
                variant={selectedTier === "discovery" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("discovery")}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Discovery
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Voice Minutes</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const TierIcon = tierIcons[user.tier];
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {user.nickname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.nickname}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tierColors[user.tier] as "default" | "secondary" | "outline"} className="capitalize gap-1">
                        <TierIcon className="h-3 w-3" />
                        {user.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={user.status === "active" ? "bg-green-100 text-green-700" : ""}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.voiceMinutes} min</TableCell>
                    <TableCell>{user.sessionsCount}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
