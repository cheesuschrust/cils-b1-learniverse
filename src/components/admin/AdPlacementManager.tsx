
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AdPosition, AdSize } from '@/types/advertisement';
import { Devices, LayoutGrid, Plus, Save, Trash } from 'lucide-react';
import Advertisement from '@/components/common/Advertisement';

const AdPlacementManager: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('website');
  
  // Sample placement data - in a real app, this would come from your backend
  const [placements, setPlacements] = useState([
    { id: '1', name: 'Homepage Banner', position: 'top' as AdPosition, size: 'large' as AdSize, active: true, pageType: 'website' },
    { id: '2', name: 'Sidebar Premium Promo', position: 'sidebar' as AdPosition, size: 'medium' as AdSize, active: true, pageType: 'website' },
    { id: '3', name: 'Learning Page Inline', position: 'inline' as AdPosition, size: 'medium' as AdSize, active: true, pageType: 'learning' },
    { id: '4', name: 'Mobile Footer Sticky', position: 'bottom' as AdPosition, size: 'small' as AdSize, active: false, pageType: 'mobile' }
  ]);
  
  const [newPlacement, setNewPlacement] = useState({
    name: '',
    position: 'inline' as AdPosition,
    size: 'medium' as AdSize,
    pageType: 'website'
  });
  
  const handleAddPlacement = () => {
    if (!newPlacement.name) {
      toast({
        title: "Error",
        description: "Please provide a name for the placement",
        variant: "destructive"
      });
      return;
    }
    
    setPlacements([
      ...placements,
      {
        id: Date.now().toString(),
        ...newPlacement,
        active: true
      }
    ]);
    
    setNewPlacement({
      name: '',
      position: 'inline',
      size: 'medium',
      pageType: 'website'
    });
    
    toast({
      title: "Placement Added",
      description: `New ad placement "${newPlacement.name}" has been created`
    });
  };
  
  const handleTogglePlacement = (id: string) => {
    setPlacements(placements.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
    
    const placement = placements.find(p => p.id === id);
    if (placement) {
      toast({
        title: placement.active ? "Placement Disabled" : "Placement Enabled",
        description: `Ad placement "${placement.name}" has been ${placement.active ? 'disabled' : 'enabled'}`
      });
    }
  };
  
  const handleDeletePlacement = (id: string) => {
    const placement = placements.find(p => p.id === id);
    setPlacements(placements.filter(p => p.id !== id));
    
    if (placement) {
      toast({
        title: "Placement Deleted",
        description: `Ad placement "${placement.name}" has been deleted`
      });
    }
  };
  
  const filteredPlacements = placements.filter(p => p.pageType === activeTab);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Placement Management</CardTitle>
        <CardDescription>
          Configure where ads appear throughout your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="learning">Learning Pages</TabsTrigger>
            <TabsTrigger value="mobile">Mobile View</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardHeader className="bg-muted/50 py-3">
                <CardTitle className="text-sm font-medium">Add New Placement</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="placement-name">Name</Label>
                    <Input
                      id="placement-name"
                      value={newPlacement.name}
                      onChange={e => setNewPlacement({...newPlacement, name: e.target.value})}
                      placeholder="e.g., Homepage Banner"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="placement-position">Position</Label>
                    <Select 
                      value={newPlacement.position} 
                      onValueChange={val => setNewPlacement({...newPlacement, position: val as AdPosition})}
                    >
                      <SelectTrigger id="placement-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="placement-size">Size</Label>
                    <Select 
                      value={newPlacement.size} 
                      onValueChange={val => setNewPlacement({...newPlacement, size: val as AdSize})}
                    >
                      <SelectTrigger id="placement-size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={handleAddPlacement} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Placement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="py-3 bg-muted/50">
                <CardTitle className="text-sm font-medium">Current Placements</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {filteredPlacements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No ad placements defined for this section yet.</p>
                    <p className="text-sm">Add your first placement using the form above.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Preview</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlacements.map((placement) => (
                        <TableRow key={placement.id}>
                          <TableCell className="font-medium">{placement.name}</TableCell>
                          <TableCell className="capitalize">{placement.position}</TableCell>
                          <TableCell className="capitalize">{placement.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={placement.active} 
                                onCheckedChange={() => handleTogglePlacement(placement.id)} 
                              />
                              <Badge variant={placement.active ? "default" : "outline"}>
                                {placement.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <Devices className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeletePlacement(placement.id)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            {activeTab === "website" && (
              <Card>
                <CardHeader className="py-3 bg-muted/50">
                  <CardTitle className="text-sm font-medium">Sample Advertisements</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Inline Advertisement (Medium)</h3>
                    <Advertisement position="inline" size="medium" />
                    
                    <h3 className="text-sm font-medium">Sidebar Advertisement (Small)</h3>
                    <Advertisement position="sidebar" size="small" />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdPlacementManager;
