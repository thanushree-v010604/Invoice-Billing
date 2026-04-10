import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { 
  Building2, 
  Save, 
  Globe, 
  ShieldCheck,
  Smartphone,
  Moon,
  Sun,
  Upload,
  User,
  Bell,
  Lock
} from 'lucide-react';
import { db } from '../db';
import { type BusinessProfile } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<BusinessProfile>({
    name: '',
    gstin: '',
    address: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      const p = await db.profile.toCollection().first();
      if (p) setProfile(p);
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const existing = await db.profile.toCollection().first();
      if (existing) {
        await db.profile.update(existing.id!, profile);
      } else {
        await db.profile.add(profile);
      }
      toast.success("Business profile updated successfully");
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your business profile and app preferences.</p>
      </div>

      <Tabs defaultValue="business" className="space-y-8">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          <TabsList className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 h-14 shadow-sm w-max md:w-full">
            <TabsTrigger value="business" className="rounded-xl px-6 md:px-8 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20">
              <Building2 className="w-4 h-4 mr-2" /> Business
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl px-6 md:px-8 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20">
              <Sun className="w-4 h-4 mr-2" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-6 md:px-8 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-6 md:px-8 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20">
              <Lock className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="business" className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Business Information</CardTitle>
                  <CardDescription>This information will appear on your generated invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative group">
                      <Avatar className="h-32 w-32 rounded-3xl border-4 border-white dark:border-slate-950 shadow-xl">
                        <AvatarImage src={profile.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                        <AvatarFallback className="rounded-3xl text-4xl">{profile.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-xl shadow-lg">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Company Logo</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Upload your company logo for professional branding. Recommended size: 512x512px.</p>
                      <div className="flex gap-2 justify-center md:justify-start pt-2">
                        <Button variant="outline" size="sm" className="rounded-lg">Upload New</Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-rose-600 hover:text-rose-700">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bizName">Business Name</Label>
                      <Input 
                        id="bizName" 
                        value={profile.name} 
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        placeholder="e.g. Acme Billing Solutions"
                        className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bizGstin">GST Number (GSTIN)</Label>
                      <Input 
                        id="bizGstin" 
                        value={profile.gstin} 
                        onChange={e => setProfile({...profile, gstin: e.target.value})}
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bizEmail">Support Email</Label>
                      <Input 
                        id="bizEmail" 
                        type="email"
                        value={profile.email} 
                        onChange={e => setProfile({...profile, email: e.target.value})}
                        placeholder="e.g. billing@acme.com"
                        className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bizPhone">Contact Phone</Label>
                      <Input 
                        id="bizPhone" 
                        value={profile.phone} 
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        placeholder="e.g. +91 98765 43210"
                        className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="bizAddress">Business Address</Label>
                      <Input 
                        id="bizAddress" 
                        value={profile.address} 
                        onChange={e => setProfile({...profile, address: e.target.value})}
                        placeholder="e.g. 123 Tech Tower, Bandra Kurla Complex, Mumbai"
                        className="bg-white/50 dark:bg-slate-900/50 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <Button onClick={handleSaveProfile} className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-11 px-8 rounded-xl shadow-lg shadow-indigo-600/20">
                      <Save className="w-4 h-4" /> Save Business Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                    <div>
                      <p className="font-bold text-sm">GST Ready</p>
                      <p className="text-[10px]">Your invoices meet all GST requirements.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
                    <Smartphone className="w-6 h-6" />
                    <div>
                      <p className="font-bold text-sm">Offline Mode</p>
                      <p className="text-[10px]">Data is safely synced locally.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-8 animate-in slide-in-from-bottom-4">
          <Card className="glass-card border-none max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Theme Preferences</CardTitle>
              <CardDescription>Customize how BillingPro looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                    theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                  }`}
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Sun className="w-8 h-8 text-amber-500" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">Light Mode</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                    theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                  }`}
                >
                  <div className="bg-slate-950 p-3 rounded-xl shadow-sm">
                    <Moon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">Dark Mode</span>
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Language</p>
                    <p className="text-xs text-slate-500">Choose your preferred dashboard language.</p>
                  </div>
                  <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
                    <SelectTrigger className="w-40 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
