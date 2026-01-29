import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  DollarSign,
  Mic,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
} from "lucide-react";

// Mock statistics data
const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "primary",
  },
  {
    title: "Voice Sessions",
    value: "15,234",
    change: "+8.2%",
    trend: "up",
    icon: Mic,
    color: "teal",
  },
  {
    title: "Monthly Revenue",
    value: "$24,580",
    change: "+18.7%",
    trend: "up",
    icon: DollarSign,
    color: "gold",
  },
  {
    title: "Event Bookings",
    value: "342",
    change: "-3.1%",
    trend: "down",
    icon: Calendar,
    color: "pink",
  },
];

const recentActivity = [
  { type: "signup", user: "Sarah M.", time: "5 minutes ago", details: "New Growth membership" },
  { type: "session", user: "Elena R.", time: "12 minutes ago", details: "45 min voice session" },
  { type: "event", user: "Mira K.", time: "1 hour ago", details: "Booked Shadow Workshop" },
  { type: "assessment", user: "Aisha J.", time: "2 hours ago", details: "Completed EQ assessment" },
  { type: "upgrade", user: "Luna S.", time: "3 hours ago", details: "Upgraded to Transformation" },
];

const upcomingEvents = [
  { title: "Shadow Integration Workshop", date: "Feb 15, 2026", capacity: "38/50", status: "Active" },
  { title: "Full Moon Circle", date: "Feb 12, 2026", capacity: "22/30", status: "Active" },
  { title: "Couples Deep Dive", date: "Feb 20, 2026", capacity: "14/20", status: "Active" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      {activity.type === "signup" && <Users className="h-5 w-5 text-primary" />}
                      {activity.type === "session" && <Mic className="h-5 w-5 text-teal" />}
                      {activity.type === "event" && <Calendar className="h-5 w-5 text-pink" />}
                      {activity.type === "assessment" && <TrendingUp className="h-5 w-5 text-purple" />}
                      {activity.type === "upgrade" && <DollarSign className="h-5 w-5 text-gold" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/events">Manage</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{event.date}</span>
                    <span>{event.capacity} booked</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline" asChild>
              <Link to="/admin/events/new">Create New Event</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/admin/events/new">
              <Calendar className="h-5 w-5" />
              <span>Create Event</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/admin/assessments/new">
              <TrendingUp className="h-5 w-5" />
              <span>New Assessment</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/admin/users">
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <Link to="/admin/analytics">
              <TrendingUp className="h-5 w-5" />
              <span>View Analytics</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
