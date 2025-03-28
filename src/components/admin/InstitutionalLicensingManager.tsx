
import React, { useState, useEffect } from 'react';
import { License, LicenseType } from '@/types/license';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { 
  Building, 
  School, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  Edit, 
  Trash2, 
  Plus, 
  Download, 
  Upload, 
  Search, 
  RefreshCw, 
  Filter, 
  MoreHorizontal, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Ban
} from 'lucide-react';
import LicenseTable from './LicenseTable';

const InstitutionalLicensingManager: React.FC = () => {
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for new/edit license
  const [formData, setFormData] = useState({
    name: '',
    type: 'university' as LicenseType,
    plan: 'Standard',
    seats: 100,
    startDate: '',
    endDate: '',
    contactName: '',
    contactEmail: '',
    customization: {
      logo: '',
      colors: {
        primary: '#000000',
        secondary: '#ffffff'
      },
      domain: ''
    }
  });

  // Mock license data
  const mockLicenses: License[] = [
    {
      id: "1",
      name: "Stanford University",
      type: "university",
      plan: "Enterprise",
      seats: 500,
      usedSeats: 423,
      startDate: "2023-01-15",
      endDate: "2024-01-14",
      status: "active",
      contactName: "Dr. Emily Chen",
      contactEmail: "echen@stanford.edu",
      customization: {
        logo: "/logos/stanford.png",
        colors: {
          primary: "#8C1515",
          secondary: "#4D4F53"
        },
        domain: "stanford.edu"
      },
      value: 25000,
      renewalStatus: "auto-renewal"
    },
    {
      id: "2",
      name: "Berkeley High School",
      type: "k12", 
      plan: "Standard",
      seats: 120,
      usedSeats: 98,
      startDate: "2023-03-10",
      endDate: "2024-03-09",
      status: "active",
      contactName: "Michael Johnson",
      contactEmail: "mjohnson@berkeleyhigh.edu",
      customization: {
        logo: "/logos/berkeley-high.png",
        colors: {
          primary: "#C4820E",
          secondary: "#003262"
        },
        domain: "berkeleyhigh.edu"
      },
      value: 6000,
      renewalStatus: "pending"
    },
    {
      id: "3",
      name: "Rosetta Language Institute",
      type: "language-school",
      plan: "Professional",
      seats: 50,
      usedSeats: 42,
      startDate: "2023-02-01",
      endDate: "2024-01-31",
      status: "active",
      contactName: "Sofia Rossi",
      contactEmail: "srossi@rosettainstitute.com",
      customization: {
        logo: "/logos/rosetta.png",
        colors: {
          primary: "#2C5F2D",
          secondary: "#97BC62"
        },
        domain: "rosettainstitute.com"
      },
      value: 4500,
      renewalStatus: "auto-renewal"
    },
    {
      id: "4",
      name: "Global Tech Solutions",
      type: "corporate",
      plan: "Enterprise",
      seats: 200,
      usedSeats: 187,
      startDate: "2022-11-15",
      endDate: "2023-11-14",
      status: "expired",
      contactName: "Robert Williams",
      contactEmail: "rwilliams@globaltechsolutions.com",
      customization: {
        logo: "/logos/global-tech.png",
        colors: {
          primary: "#0078D7",
          secondary: "#50E6FF"
        },
        domain: "globaltechsolutions.com"
      },
      value: 15000,
      renewalStatus: "not-renewing"
    },
    {
      id: "5",
      name: "Milan International School",
      type: "k12",
      plan: "Professional",
      seats: 80,
      usedSeats: 65,
      startDate: "2023-04-01",
      endDate: "2024-03-31",
      status: "active",
      contactName: "Marco Bianchi",
      contactEmail: "mbianchi@milanschool.it",
      customization: {
        logo: "/logos/milan-school.png",
        colors: {
          primary: "#D90429",
          secondary: "#EDF2F4"
        },
        domain: "milanschool.it"
      },
      value: 5200,
      renewalStatus: "auto-renewal"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLicenses(mockLicenses);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter licenses based on search query and filters
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || license.type === filterType;
    const matchesStatus = filterStatus === 'all' || license.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle customization changes
  const handleCustomizationChange = (field: string, value: string) => {
    if (field === 'primary' || field === 'secondary') {
      setFormData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          colors: {
            ...prev.customization.colors,
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          [field]: value
        }
      }));
    }
  };

  // Add new license
  const handleAddLicense = () => {
    const newLicense: License = {
      id: Date.now().toString(),
      ...formData,
      status: 'active',
      usedSeats: 0,
      value: calculateLicenseValue(formData.plan, formData.seats),
      renewalStatus: 'pending'
    };
    
    setLicenses(prev => [...prev, newLicense]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "License Added",
      description: `${newLicense.name} has been added successfully.`,
      variant: "default",
    });
  };

  // Edit license
  const handleEditLicense = () => {
    if (!selectedLicense) return;
    
    const updatedLicenses = licenses.map(license => 
      license.id === selectedLicense.id 
        ? { 
            ...license, 
            ...formData,
            value: calculateLicenseValue(formData.plan, formData.seats)
          } 
        : license
    );
    
    setLicenses(updatedLicenses);
    setIsEditDialogOpen(false);
    setSelectedLicense(null);
    resetForm();
    
    toast({
      title: "License Updated",
      description: `${formData.name} has been updated successfully.`,
      variant: "default",
    });
  };

  // Delete license
  const handleDeleteLicense = () => {
    if (!selectedLicense) return;
    
    const updatedLicenses = licenses.filter(license => license.id !== selectedLicense.id);
    setLicenses(updatedLicenses);
    setIsDeleteDialogOpen(false);
    setSelectedLicense(null);
    
    toast({
      title: "License Deleted",
      description: `${selectedLicense.name} has been deleted.`,
      variant: "destructive",
    });
  };

  // Open edit dialog and populate form
  const openEditDialog = (license: License) => {
    setSelectedLicense(license);
    setFormData({
      name: license.name,
      type: license.type,
      plan: license.plan,
      seats: license.seats,
      startDate: license.startDate,
      endDate: license.endDate,
      contactName: license.contactName,
      contactEmail: license.contactEmail,
      customization: {
        ...license.customization
      }
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (license: License) => {
    setSelectedLicense(license);
    setIsDeleteDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: 'university',
      plan: 'Standard',
      seats: 100,
      startDate: '',
      endDate: '',
      contactName: '',
      contactEmail: '',
      customization: {
        logo: '',
        colors: {
          primary: '#000000',
          secondary: '#ffffff'
        },
        domain: ''
      }
    });
  };

  // Calculate license value based on plan and seats
  const calculateLicenseValue = (plan: string, seats: number): number => {
    const basePrices: Record<string, number> = {
      'Standard': 50,
      'Professional': 75,
      'Enterprise': 100
    };
    
    const basePrice = basePrices[plan] || 50;
    return basePrice * seats;
  };

  // Get icon based on license type
  const getLicenseTypeIcon = (type: LicenseType) => {
    switch (type) {
      case 'university':
        return <GraduationCap className="h-4 w-4" />;
      case 'k12':
        return <School className="h-4 w-4" />;
      case 'language-school':
        return <Globe className="h-4 w-4" />;
      case 'corporate':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  // Get badge color based on license status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'destructive';
      case 'inactive':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Institutional Licensing</h1>
          <p className="text-muted-foreground">
            Manage educational and corporate licenses for the platform
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add License
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="active">Active Licenses</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
            <TabsTrigger value="all">All Licenses</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search licenses..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="k12">K-12 School</SelectItem>
                <SelectItem value="language-school">Language School</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setFilterStatus('all');
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <LicenseTable 
            licenses={filteredLicenses.filter(l => l.status === 'active')}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            getLicenseTypeIcon={getLicenseTypeIcon}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <LicenseTable 
            licenses={filteredLicenses.filter(l => l.status === 'pending')}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            getLicenseTypeIcon={getLicenseTypeIcon}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          <LicenseTable 
            licenses={filteredLicenses.filter(l => l.status === 'expired')}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            getLicenseTypeIcon={getLicenseTypeIcon}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <LicenseTable 
            licenses={filteredLicenses}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            getLicenseTypeIcon={getLicenseTypeIcon}
            getStatusBadgeVariant={getStatusBadgeVariant}
          />
        </TabsContent>
      </Tabs>

      {/* Add License Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New License</DialogTitle>
            <DialogDescription>
              Create a new institutional license for an organization
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Organization Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label htmlFor="plan">License Plan</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleSelectChange('plan', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seats">Number of Seats</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Contact person name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@organization.com"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 py-2">
            <h3 className="text-sm font-medium">Customization Options</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.customization.domain}
                  onChange={(e) => handleCustomizationChange('domain', e.target.value)}
                  placeholder="organization.edu"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.customization.logo}
                  onChange={(e) => handleCustomizationChange('logo', e.target.value)}
                  placeholder="/logos/organization.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.customization.colors.primary}
                    onChange={(e) => handleCustomizationChange('primary', e.target.value)}
                    className="w-12 h-8 p-0"
                  />
                  <Input
                    value={formData.customization.colors.primary}
                    onChange={(e) => handleCustomizationChange('primary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.customization.colors.secondary}
                    onChange={(e) => handleCustomizationChange('secondary', e.target.value)}
                    className="w-12 h-8 p-0"
                  />
                  <Input
                    value={formData.customization.colors.secondary}
                    onChange={(e) => handleCustomizationChange('secondary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddLicense}>Add License</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit License Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit License</DialogTitle>
            <DialogDescription>
              Update the license information for {selectedLicense?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Organization Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Organization Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value as LicenseType)}
                >
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label htmlFor="edit-plan">License Plan</Label>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => handleSelectChange('plan', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-seats">Number of Seats</Label>
                <Input
                  id="edit-seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleInputChange}
                  min={1}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-contactName">Contact Person</Label>
                <Input
                  id="edit-contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-contactEmail">Contact Email</Label>
                <Input
                  id="edit-contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 py-2">
            <h3 className="text-sm font-medium">Customization Options</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-domain">Domain</Label>
                <Input
                  id="edit-domain"
                  value={formData.customization.domain}
                  onChange={(e) => handleCustomizationChange('domain', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-logo">Logo URL</Label>
                <Input
                  id="edit-logo"
                  value={formData.customization.logo}
                  onChange={(e) => handleCustomizationChange('logo', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="edit-primaryColor"
                    type="color"
                    value={formData.customization.colors.primary}
                    onChange={(e) => handleCustomizationChange('primary', e.target.value)}
                    className="w-12 h-8 p-0"
                  />
                  <Input
                    value={formData.customization.colors.primary}
                    onChange={(e) => handleCustomizationChange('primary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="edit-secondaryColor"
                    type="color"
                    value={formData.customization.colors.secondary}
                    onChange={(e) => handleCustomizationChange('secondary', e.target.value)}
                    className="w-12 h-8 p-0"
                  />
                  <Input
                    value={formData.customization.colors.secondary}
                    onChange={(e) => handleCustomizationChange('secondary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedLicense(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditLicense}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete License Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete License</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the license for {selectedLicense?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLicense?.usedSeats > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Warning: Active Users</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    This license has {selectedLicense.usedSeats} active users. Deleting it will remove their access to the platform.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedLicense(null);
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLicense}>
              Delete License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionalLicensingManager;
