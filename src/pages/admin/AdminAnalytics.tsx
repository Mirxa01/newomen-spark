import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  Mic,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  UserPlus,
  Activity,
} from "lucide-react";

// Mock data for analytics
const overviewStats = {
  dau: { value: 847, change: "+5.2%", trend: "up" },
  wau: { value: 2134, change: "+8.1%", trend: "up" },
  mau: { value: 2847, change: "+12.5%", trend: "up" },
  avgSession: { value: "12.4 min", change: "+2.3%", trend: "up" },
};

const revenueByTier = [
  { tier: "Discovery", users: 1834, revenue: 0, percentage: 64 },
  { tier: "Growth", users: 756, revenue: 16632, percentage: 27 },
  { tier: "Transformation", users: 257, revenue: 57054, percentage: 9 },
];

const voiceUsageData = [
  { day: "Mon", sessions: 234, minutes: 2890 },
  { day: "Tue", sessions: 267, minutes: 3245 },
  { day: "Wed", sessions: 312, minutes: 3856 },
  { day: "Thu", sessions: 289, minutes: 3456 },
  { day: "Fri", sessions: 345, minutes: 4123 },
  { day: "Sat", sessions: 178, minutes: 2134 },
  { day: "Sun", sessions: 156, minutes: 1867 },
];

const conversionMetrics = [
  { stage: "Visitors", count: 12450, rate: "100%" },
  { stage: "Sign-ups", count: 2847, rate: "22.9%" },
  { stage: "Onboarding Complete", count: 2234, rate: "78.5%" },
  { stage: "First Session", count: 1897, rate: "84.9%" },
  { stage: "Paid Conversion", count: 1013, rate: "53.4%" },
];

export default function AdminAnalytics() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track platform performance and user engagement.
          </p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Active Users</p>
                <p className="text-2xl font-bold">{overviewStats.dau.value}</p>
                <Badge variant="secondary" className="text-xs mt-1 text-green-600">
                  {overviewStats.dau.change}
                </Badge>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Active Users</p>
                <p className="text-2xl font-bold">{overviewStats.wau.value}</p>
                <Badge variant="secondary" className="text-xs mt-1 text-green-600">
                  {overviewStats.wau.change}
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-teal opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Active Users</p>
                <p className="text-2xl font-bold">{overviewStats.mau.value}</p>
                <Badge variant="secondary" className="text-xs mt-1 text-green-600">
                  {overviewStats.mau.change}
                </Badge>
              </div>
              <UserPlus className="h-8 w-8 text-pink opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Session Length</p>
                <p className="text-2xl font-bold">{overviewStats.avgSession.value}</p>
                <Badge variant="secondary" className="text-xs mt-1 text-green-600">
                  {overviewStats.avgSession.change}
                </Badge>
              </div>
              <Clock className="h-8 w-8 text-gold opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="voice">Voice Usage</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue by Tier
                </CardTitle>
                <CardDescription>Monthly recurring revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByTier.map((tier) => (
                    <div key={tier.tier} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tier.tier}</span>
                          <Badge variant="outline" className="text-xs">
                            {tier.users} users
                          </Badge>
                        </div>
                        <span className="font-bold">
                          ${tier.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${tier.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total MRR</span>
                    <span className="text-2xl font-bold">
                      ${revenueByTier.reduce((sum, t) => sum + t.revenue, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">$73,686</p>
                    </div>
                    <Badge className="text-green-600 bg-green-100">+18.7%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Month</p>
                      <p className="text-2xl font-bold">$62,054</p>
                    </div>
                    <Badge className="text-green-600 bg-green-100">+14.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">YTD Revenue</p>
                      <p className="text-2xl font-bold">$287,450</p>
                    </div>
                    <Badge className="text-green-600 bg-green-100">+32.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Usage Tab */}
        <TabsContent value="voice">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Weekly Voice Usage
                </CardTitle>
                <CardDescription>Sessions and minutes per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {voiceUsageData.map((day) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <span className="w-10 text-sm font-medium">{day.day}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">
                            {day.sessions} sessions
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {day.minutes} min
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal rounded-full"
                            style={{ width: `${(day.minutes / 4500) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voice Usage Stats</CardTitle>
                <CardDescription>This week's voice session metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-2xl font-bold">1,781</p>
                    <p className="text-xs text-green-600">+12.3% vs last week</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Minutes</p>
                    <p className="text-2xl font-bold">21,571</p>
                    <p className="text-xs text-green-600">+8.7% vs last week</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg per Session</p>
                    <p className="text-2xl font-bold">12.1 min</p>
                    <p className="text-xs text-muted-foreground">Target: 15 min</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Peak Hour</p>
                    <p className="text-2xl font-bold">8-9 PM</p>
                    <p className="text-xs text-muted-foreground">Local time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Conversion Funnel
              </CardTitle>
              <CardDescription>User journey from visitor to paid member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionMetrics.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {stage.count.toLocaleString()} users
                          </span>
                          <Badge variant="outline">{stage.rate}</Badge>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(stage.count / conversionMetrics[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Performance
                </CardTitle>
                <CardDescription>Booking and attendance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Total Events (MTD)</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <Badge className="text-green-600 bg-green-100">+3 vs last month</Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Total Bookings</p>
                        <p className="text-2xl font-bold">342</p>
                      </div>
                      <Badge className="text-green-600 bg-green-100">87% fill rate</Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Event Revenue</p>
                        <p className="text-2xl font-bold">$24,580</p>
                      </div>
                      <Badge className="text-green-600 bg-green-100">+22% vs last month</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Event Types</CardTitle>
                <CardDescription>By booking volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Workshops", bookings: 156, percentage: 45 },
                    { type: "Moon Circles", bookings: 98, percentage: 29 },
                    { type: "Couples Sessions", bookings: 54, percentage: 16 },
                    { type: "Retreats", bookings: 34, percentage: 10 },
                  ].map((eventType) => (
                    <div key={eventType.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{eventType.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {eventType.bookings} bookings
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink rounded-full"
                          style={{ width: `${eventType.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
