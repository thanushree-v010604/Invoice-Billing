import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Edit, 
  Camera,
  LogOut,
  Key,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Profile() {
  const { user, logout } = useAuth();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and account security.</p>
        </div>
        <Button variant="outline" onClick={logout} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 gap-2 rounded-xl h-11">
          <LogOut className="w-4 h-4" /> Log Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="space-y-8">
          <Card className="glass-card border-none overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <CardContent className="relative pt-0">
              <div className="flex flex-col items-center -mt-16">
                <div className="relative group">
                  <Avatar className="h-32 w-32 rounded-3xl border-4 border-white dark:border-slate-950 shadow-2xl">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                    <AvatarFallback className="rounded-3xl text-4xl">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-none px-3 py-1 rounded-full text-[10px] font-bold">
                      ADMINISTRATOR
                    </Badge>
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-none px-3 py-1 rounded-full text-[10px] font-bold">
                      VERIFIED
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <Shield className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Role</p>
                    <p className="text-slate-900 dark:text-white font-medium">System Administrator</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Joined</p>
                    <p className="text-slate-900 dark:text-white font-medium">April 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Password</p>
                    <p className="text-[10px] text-slate-500">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Change</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">2FA Auth</p>
                    <p className="text-[10px] text-slate-500">Not enabled</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
              <CardDescription>Update your personal details and how others see you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        id="fullName" 
                        defaultValue={user?.name} 
                        className="pl-10 bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        id="email" 
                        type="email"
                        defaultValue={user?.email} 
                        className="pl-10 bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        id="phone" 
                        placeholder="+91 98765 43210"
                        className="pl-10 bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Mumbai, India"
                      className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-11 px-8 rounded-xl shadow-lg shadow-indigo-600/20">
                    <Edit className="w-4 h-4" /> Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <CardDescription>Your latest actions in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ActivityItem 
                  title="Created Invoice #INV-2024-001" 
                  time="2 hours ago" 
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} 
                />
                <ActivityItem 
                  title="Updated Business Profile" 
                  time="Yesterday" 
                  icon={<Edit className="w-4 h-4 text-indigo-500" />} 
                />
                <ActivityItem 
                  title="Downloaded GST Report (March)" 
                  time="2 days ago" 
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, icon }: { title: string, time: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}
