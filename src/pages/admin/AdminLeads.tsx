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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
} from "lucide-react";

// Mock leads data
const mockLeads = [
  {
    id: "1",
    fullName: "Jessica Thompson",
    whatsapp: "+1234567890",
    source: "Shadow Workshop Event",
    status: "new",
    createdAt: "2026-01-28",
    notes: "",
  },
  {
    id: "2",
    fullName: "Rachel Williams",
    whatsapp: "+9876543210",
    source: "Membership Page",
    status: "contacted",
    createdAt: "2026-01-27",
    notes: "Interested in Growth tier, follow up next week",
  },
  {
    id: "3",
    fullName: "Amanda Chen",
    whatsapp: "+5551234567",
    source: "Full Moon Circle Event",
    status: "converted",
    createdAt: "2026-01-25",
    notes: "Converted to Growth membership",
  },
  {
    id: "4",
    fullName: "Sophie Garcia",
    whatsapp: "+3217654321",
    source: "Couples Workshop Event",
    status: "new",
    createdAt: "2026-01-28",
    notes: "",
  },
  {
    id: "5",
    fullName: "Emma Rodriguez",
    whatsapp: "+7891234560",
    source: "Homepage CTA",
    status: "declined",
    createdAt: "2026-01-20",
    notes: "Not interested at this time",
  },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

const statusIcons: Record<string, React.ElementType> = {
  new: Clock,
  contacted: MessageSquare,
  converted: CheckCircle,
  declined: XCircle,
};

export default function AdminLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.whatsapp.includes(searchQuery);
    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const leadCounts = {
    all: mockLeads.length,
    new: mockLeads.filter((l) => l.status === "new").length,
    contacted: mockLeads.filter((l) => l.status === "contacted").length,
    converted: mockLeads.filter((l) => l.status === "converted").length,
    declined: mockLeads.filter((l) => l.status === "declined").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Membership Leads</h1>
          <p className="text-muted-foreground">
            Manage potential members who expressed interest.
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === null ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedStatus(null)}
        >
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">All Leads</p>
            <p className="text-2xl font-bold">{leadCounts.all}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === "new" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedStatus("new")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">New</p>
            </div>
            <p className="text-2xl font-bold">{leadCounts.new}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === "contacted" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedStatus("contacted")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Contacted</p>
            </div>
            <p className="text-2xl font-bold">{leadCounts.contacted}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === "converted" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedStatus("converted")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Converted</p>
            </div>
            <p className="text-2xl font-bold">{leadCounts.converted}</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === "declined" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setSelectedStatus("declined")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-muted-foreground">Declined</p>
            </div>
            <p className="text-2xl font-bold">{leadCounts.declined}</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Leads</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => {
                const StatusIcon = statusIcons[lead.status];
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.fullName}</TableCell>
                    <TableCell>
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {lead.whatsapp}
                      </a>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.source}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {lead.notes || "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Converted
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4 mr-2" />
                            Mark as Declined
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
