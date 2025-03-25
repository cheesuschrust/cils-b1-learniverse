
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  School, 
  Briefcase, 
  BadgeCheck, 
  Edit, 
  Trash, 
  Download, 
  Mail, 
  BarChart,
  UserPlus,
  DollarSign,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Mock data for institutional licenses
const mockLicenses = [
  {
    id: 'lic-001',
    name: 'Riverside University',
    type: 'university',
    plan: 'enterprise',
    seats: 500,
    usedSeats: 423,
    startDate: '2023-01-15',
    endDate: '2024-01-14',
    status: 'active',
    contactName: 'Dr. Sarah Johnson',
    contactEmail: 'sjohnson@riverside.edu',
    customization: {
      logo: true,
      branding: true,
      customDomain: true,
    },
    value: 24500,
    renewalStatus: 'pending',
  },
  {
    id: 'lic-002',
    name: 'Oakridge High School',
    type: 'k12',
    plan: 'educational',
    seats: 150,
    usedSeats: 138,
    startDate: '2023-03-10',
    endDate: '2024-03-09',
    status: 'active',
    contactName: 'Michael Williams',
    contactEmail: 'mwilliams@oakridge.k12.edu',
    customization: {
      logo: true,
      branding: false,
      customDomain: false,
    },
    value: 5250,
    renewalStatus: 'not-started',
  },
  {
    id: 'lic-003',
    name: 'Global Language Institute',
    type: 'language-school',
    plan: 'professional',
    seats: 75,
    usedSeats: 68,
    startDate: '2023-02-20',
    endDate: '2024-02-19',
    status: 'active',
    contactName: 'Anna Martinez',
    contactEmail: 'amartinez@globallang.org',
    customization: {
      logo: true,
      branding: true,
      customDomain: false,
    },
    value: 4500,
    renewalStatus: 'confirmed',
  },
  {
    id: 'lic-004',
    name: 'Corporate Language Training Inc.',
    type: 'corporate',
    plan: 'enterprise',
    seats: 200,
    usedSeats: 142,
    startDate: '2023-05-01',
    endDate: '2024-04-30',
    status: 'active',
    contactName: 'James Wilson',
    contactEmail: 'jwilson@clt.com',
    customization: {
      logo: true,
      branding: true,
      customDomain: true,
    },
    value: 15000,
    renewalStatus: 'not-started',
  },
  {
    id: 'lic-005',
    name: 'Westside Community College',
    type: 'university',
    plan: 'educational',
    seats: 300,
    usedSeats: 187,
    startDate: '2023-08-15',
    endDate: '2024-08-14',
    status: 'active',
    contactName: 'Dr. Robert Chen',
    contactEmail: 'rchen@westside.edu',
    customization: {
      logo: true,
      branding: false,
      customDomain: false,
    },
    value: 10500,
    renewalStatus: 'not-started',
  },
];

interface License {
  id: string;
  name: string;
  type: 'university' | 'k12' | 'language-school' | 'corporate';
  plan: 'educational' | 'professional' | 'enterprise';
  seats: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'suspended';
  contactName: string;
  contactEmail: string;
  customization: {
    logo: boolean;
    branding: boolean;
    customDomain: boolean;
  };
  value: number;
  renewalStatus: 'confirmed' | 'pending' | 'not-started';
}

const InstitutionalLicensingManager: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>(mockLicenses);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();
  
  // Simple form state for new license
  const [newLicense, setNewLicense] = useState<Omit<License, 'id'>>({
    name: '',
    type: 'university',
    plan: 'educational',
    seats: 100,
    usedSeats: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    status: 'active',
    contactName: '',
    contactEmail: '',
    customization: {
      logo: false,
      branding: false,
      customDomain: false,
    },
    value: 0,
    renewalStatus: 'not-started',
  });
  
  const filteredLicenses = filterType === 'all' 
    ? licenses 
    : licenses.filter(license => license.type === filterType);
  
  const calculateTotalValue = () => {
    return licenses.reduce((sum, license) => sum + license.value, 0);
  };
  
  const calculateTotalSeats = () => {
    return licenses.reduce((sum, license) => sum + license.seats, 0);
  };
  
  const calculateUsedSeats = () => {
    return licenses.reduce((sum, license) => sum + license.usedSeats, 0);
  };
  
  const handleCreateLicense = () => {
    // In a real implementation, this would send data to an API
    const id = `lic-${String(licenses.length + 1).padStart(3, '0')}`;
    
    // Calculate value based on plan and seats
    let valuePerSeat = 0;
    switch (newLicense.plan) {
      case 'educational':
        valuePerSeat = 35;
        break;
      case 'professional':
        valuePerSeat = 60;
        break;
      case 'enterprise':
        valuePerSeat = 49; // Discounted rate for volume
        break;
    }
    
    const value = newLicense.seats * valuePerSeat;
    
    const license: License = {
      ...newLicense,
      id,
      value,
    };
    
    setLicenses([...licenses, license]);
    setShowCreateDialog(false);
    
    toast({
      title: "License created",
      description: `${license.name} license has been created successfully`,
    });
    
    // Reset form
    setNewLicense({
      name: '',
      type: 'university',
      plan: 'educational',
      seats: 100,
      usedSeats: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'active',
      contactName: '',
      contactEmail: '',
      customization: {
        logo: false,
        branding: false,
        customDomain: false,
      },
      value: 0,
      renewalStatus: 'not-started',
    });
  };
  
  const handleUpdateLicense = () => {
    if (!selectedLicense) return;
    
    setLicenses(licenses.map(license => 
      license.id === selectedLicense.id ? selectedLicense : license
    ));
    
    setShowEditDialog(false);
    
    toast({
      title: "License updated",
      description: `${selectedLicense.name} license has been updated successfully`,
    });
  };
  
  const handleDeleteLicense = (id: string) => {
    setLicenses(licenses.filter(license => license.id !== id));
    
    toast({
      title: "License deleted",
      description: "The license has been deleted successfully",
    });
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'university':
        return <School className="h-5 w-5 text-blue-500" />;
      case 'k12':
        return <School className="h-5 w-5 text-green-500" />;
      case 'language-school':
        return <Building className="h-5 w-5 text-purple-500" />;
      case 'corporate':
        return <Briefcase className="h-5 w-5 text-amber-500" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };
  
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'educational':
        return 'bg-blue-100 text-blue-800';
      case 'professional':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500';
      case 'pending':
        return 'text-amber-500';
      case 'not-started':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Institutional Licensing</h2>
          <p className="text-muted-foreground">
            Manage educational and corporate licenses
          </p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)}>
          <Building className="mr-2 h-4 w-4" />
          Create License
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {licenses.length} institutional licenses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalSeats().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {calculateUsedSeats().toLocaleString()} seats in use ({Math.round((calculateUsedSeats() / calculateTotalSeats()) * 100)}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{licenses.filter(l => l.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {licenses.filter(l => l.renewalStatus === 'pending').length} pending renewal
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active-licenses">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-licenses">Active Licenses</TabsTrigger>
          <TabsTrigger value="license-usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="renewal-tracking">Renewal Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-licenses">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <CardTitle>License Management</CardTitle>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="university">Universities</SelectItem>
                    <SelectItem value="k12">K-12 Schools</SelectItem>
                    <SelectItem value="language-school">Language Schools</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Manage institutional licenses and subscription access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Expiration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredLicenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                          No licenses found. Create a new license to get started.
                        </td>
                      </tr>
                    ) : (
                      filteredLicenses.map((license) => (
                        <tr key={license.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getTypeIcon(license.type)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium">{license.name}</div>
                                <div className="text-xs text-muted-foreground">{license.contactName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlanBadgeColor(license.plan)}`}>
                              {license.plan.charAt(0).toUpperCase() + license.plan.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>{license.usedSeats} / {license.seats}</div>
                            <div className="w-24 bg-muted rounded-full h-1.5 mt-1">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${(license.usedSeats / license.seats) * 100}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>{new Date(license.endDate).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.ceil((new Date(license.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            ${license.value.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedLicense(license);
                                  setShowEditDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  handleDeleteLicense(license.id);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLicenses.length} of {licenses.length} licenses
              </div>
              <Button variant="outline" size="sm" onClick={() => {}}>
                <Download className="mr-2 h-4 w-4" />
                Export Licenses
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="license-usage">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>License Usage by Type</CardTitle>
                <CardDescription>Seat utilization by institution type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* This would be a chart in a real implementation */}
                <div className="h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Activity metrics across licensed institutions</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* This would be a chart in a real implementation */}
                <div className="h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Performing Institutions</CardTitle>
                <CardDescription>Ranked by engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Institution
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Active Users
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Avg. Session Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Questions/User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Completion Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {licenses.slice(0, 5).map((license, index) => (
                        <tr key={license.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getTypeIcon(license.type)}
                              </div>
                              <div className="ml-3 text-sm font-medium">{license.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {Math.round(license.usedSeats * (0.7 + Math.random() * 0.3))}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {Math.round(8 + Math.random() * 10)} mins
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {Math.round(20 + Math.random() * 60)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {Math.round(60 + Math.random() * 35)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="renewal-tracking">
          <Card>
            <CardHeader>
              <CardTitle>License Renewal Status</CardTitle>
              <CardDescription>Track upcoming renewals and expired licenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium mb-3">Upcoming Renewals</h3>
                  <div className="rounded-md border divide-y divide-border">
                    {licenses
                      .filter(license => 
                        new Date(license.endDate) > new Date() && 
                        new Date(license.endDate) < new Date(new Date().setMonth(new Date().getMonth() + 3))
                      )
                      .map(license => (
                        <div key={license.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              {getTypeIcon(license.type)}
                              <div>
                                <h4 className="text-sm font-medium">{license.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {license.seats} seats • ${license.value.toLocaleString()} • Expires {new Date(license.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs mt-1 font-medium">
                                  <span className={getRenewalStatusColor(license.renewalStatus)}>
                                    {license.renewalStatus === 'confirmed' && 'Renewal Confirmed ✓'}
                                    {license.renewalStatus === 'pending' && 'Renewal Pending...'}
                                    {license.renewalStatus === 'not-started' && 'Renewal Not Started'}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                <Mail className="h-3 w-3 mr-1" />
                                Send Reminder
                              </Button>
                              <Button size="sm" className="text-xs h-8">
                                <BadgeCheck className="h-3 w-3 mr-1" />
                                Mark Renewed
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {licenses.filter(license => 
                      new Date(license.endDate) > new Date() && 
                      new Date(license.endDate) < new Date(new Date().setMonth(new Date().getMonth() + 3))
                    ).length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        No licenses due for renewal in the next 3 months.
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Recently Renewed</h3>
                  <div className="rounded-md border divide-y divide-border">
                    {licenses
                      .filter(license => license.renewalStatus === 'confirmed')
                      .slice(0, 2)
                      .map(license => (
                        <div key={license.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              {getTypeIcon(license.type)}
                              <div>
                                <h4 className="text-sm font-medium">{license.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {license.seats} seats • ${license.value.toLocaleString()} • Expires {new Date(license.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs mt-1 font-medium text-green-500">
                                  Renewed on {new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <Button size="sm" variant="outline" className="text-xs h-8">
                                <FileText className="h-3 w-3 mr-1" />
                                View Contract
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {licenses.filter(license => license.renewalStatus === 'confirmed').length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        No licenses have been recently renewed.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => {}}>
                <UserPlus className="mr-2 h-4 w-4" />
                Create New License Opportunity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create License Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Institutional License</DialogTitle>
            <DialogDescription>
              Add a new educational or corporate license to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution-name">Institution Name</Label>
                <Input
                  id="institution-name"
                  value={newLicense.name}
                  onChange={(e) => setNewLicense({ ...newLicense, name: e.target.value })}
                  placeholder="University of Example"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution-type">Institution Type</Label>
                <Select
                  value={newLicense.type}
                  onValueChange={(value: License['type']) => setNewLicense({ ...newLicense, type: value })}
                >
                  <SelectTrigger id="institution-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="k12">K-12 School</SelectItem>
                    <SelectItem value="language-school">Language School</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input
                  id="contact-name"
                  value={newLicense.contactName}
                  onChange={(e) => setNewLicense({ ...newLicense, contactName: e.target.value })}
                  placeholder="Dr. John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={newLicense.contactEmail}
                  onChange={(e) => setNewLicense({ ...newLicense, contactEmail: e.target.value })}
                  placeholder="jsmith@example.edu"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license-plan">License Plan</Label>
                <Select
                  value={newLicense.plan}
                  onValueChange={(value: License['plan']) => setNewLicense({ ...newLicense, plan: value })}
                >
                  <SelectTrigger id="license-plan">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-seats">Number of Seats</Label>
                <Input
                  id="license-seats"
                  type="number"
                  min="1"
                  value={newLicense.seats}
                  onChange={(e) => setNewLicense({ ...newLicense, seats: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-status">Status</Label>
                <Select
                  value={newLicense.status}
                  onValueChange={(value: License['status']) => setNewLicense({ ...newLicense, status: value })}
                >
                  <SelectTrigger id="license-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newLicense.startDate}
                  onChange={(e) => setNewLicense({ ...newLicense, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newLicense.endDate}
                  onChange={(e) => setNewLicense({ ...newLicense, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label>Customization Options</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-logo" className="cursor-pointer">
                    Custom Logo
                  </Label>
                  <Switch
                    id="custom-logo"
                    checked={newLicense.customization.logo}
                    onCheckedChange={(checked) => 
                      setNewLicense({
                        ...newLicense,
                        customization: { ...newLicense.customization, logo: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-branding" className="cursor-pointer">
                    Custom Branding & Colors
                  </Label>
                  <Switch
                    id="custom-branding"
                    checked={newLicense.customization.branding}
                    onCheckedChange={(checked) => 
                      setNewLicense({
                        ...newLicense,
                        customization: { ...newLicense.customization, branding: checked }
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-domain" className="cursor-pointer">
                    Custom Domain
                  </Label>
                  <Switch
                    id="custom-domain"
                    checked={newLicense.customization.customDomain}
                    onCheckedChange={(checked) => 
                      setNewLicense({
                        ...newLicense,
                        customization: { ...newLicense.customization, customDomain: checked }
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLicense}>
              Create License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit License Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Institutional License</DialogTitle>
            <DialogDescription>
              Update license details for {selectedLicense?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedLicense && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-institution-name">Institution Name</Label>
                  <Input
                    id="edit-institution-name"
                    value={selectedLicense.name}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-institution-type">Institution Type</Label>
                  <Select
                    value={selectedLicense.type}
                    onValueChange={(value: License['type']) => setSelectedLicense({ ...selectedLicense, type: value })}
                  >
                    <SelectTrigger id="edit-institution-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="k12">K-12 School</SelectItem>
                      <SelectItem value="language-school">Language School</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-name">Contact Name</Label>
                  <Input
                    id="edit-contact-name"
                    value={selectedLicense.contactName}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-email">Contact Email</Label>
                  <Input
                    id="edit-contact-email"
                    type="email"
                    value={selectedLicense.contactEmail}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-license-plan">License Plan</Label>
                  <Select
                    value={selectedLicense.plan}
                    onValueChange={(value: License['plan']) => setSelectedLicense({ ...selectedLicense, plan: value })}
                  >
                    <SelectTrigger id="edit-license-plan">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-license-seats">Number of Seats</Label>
                  <Input
                    id="edit-license-seats"
                    type="number"
                    min="1"
                    value={selectedLicense.seats}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, seats: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-license-status">Status</Label>
                  <Select
                    value={selectedLicense.status}
                    onValueChange={(value: License['status']) => setSelectedLicense({ ...selectedLicense, status: value })}
                  >
                    <SelectTrigger id="edit-license-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-renewal-status">Renewal Status</Label>
                  <Select
                    value={selectedLicense.renewalStatus}
                    onValueChange={(value: License['renewalStatus']) => setSelectedLicense({ ...selectedLicense, renewalStatus: value })}
                  >
                    <SelectTrigger id="edit-renewal-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="not-started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-used-seats">Used Seats</Label>
                  <Input
                    id="edit-used-seats"
                    type="number"
                    min="0"
                    max={selectedLicense.seats}
                    value={selectedLicense.usedSeats}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, usedSeats: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-start-date">Start Date</Label>
                  <Input
                    id="edit-start-date"
                    type="date"
                    value={selectedLicense.startDate}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end-date">End Date</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={selectedLicense.endDate}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, endDate: e.target.value })}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label>Customization Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-custom-logo" className="cursor-pointer">
                      Custom Logo
                    </Label>
                    <Switch
                      id="edit-custom-logo"
                      checked={selectedLicense.customization.logo}
                      onCheckedChange={(checked) => 
                        setSelectedLicense({
                          ...selectedLicense,
                          customization: { ...selectedLicense.customization, logo: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-custom-branding" className="cursor-pointer">
                      Custom Branding & Colors
                    </Label>
                    <Switch
                      id="edit-custom-branding"
                      checked={selectedLicense.customization.branding}
                      onCheckedChange={(checked) => 
                        setSelectedLicense({
                          ...selectedLicense,
                          customization: { ...selectedLicense.customization, branding: checked }
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-custom-domain" className="cursor-pointer">
                      Custom Domain
                    </Label>
                    <Switch
                      id="edit-custom-domain"
                      checked={selectedLicense.customization.customDomain}
                      onCheckedChange={(checked) => 
                        setSelectedLicense({
                          ...selectedLicense,
                          customization: { ...selectedLicense.customization, customDomain: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateLicense}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionalLicensingManager;
