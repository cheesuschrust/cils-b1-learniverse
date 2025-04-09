
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BarChart, 
  DollarSign, 
  Edit, 
  ExternalLink, 
  LineChart, 
  Plus, 
  RefreshCw, 
  Search, 
  Trash, 
  Users 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AdCampaign } from '@/types/advertisement';
import AdService from '@/services/AdService';

const AdCampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    setIsLoading(true);
    try {
      // Initialize sample data if needed
      AdService.initializeSampleData();
      
      // Fetch campaigns
      const allCampaigns = AdService.getAllCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load ad campaigns',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    toast({
      title: 'Create Campaign',
      description: 'Campaign creation would open in a modal dialog',
    });
  };

  const handleEditCampaign = (id: string) => {
    toast({
      title: 'Edit Campaign',
      description: `Editing campaign ${id}`,
    });
  };

  const handleDeleteCampaign = (id: string) => {
    try {
      const success = AdService.deleteCampaign(id);
      if (success) {
        setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
        toast({
          title: 'Campaign Deleted',
          description: 'The campaign has been successfully deleted',
        });
      } else {
        throw new Error('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete campaign',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Ad Campaign Management</CardTitle>
            <CardDescription>
              Create and manage advertising campaigns
            </CardDescription>
          </div>
          <Button onClick={handleCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search campaigns..."
                  className="pl-8 w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={loadCampaigns}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading campaigns...
                    </TableCell>
                  </TableRow>
                ) : campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No campaigns found. Create your first campaign.
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            campaign.status === 'active'
                              ? 'default'
                              : campaign.status === 'paused'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(campaign.startDate)}</TableCell>
                      <TableCell>{formatCurrency(campaign.budget.total)}</TableCell>
                      <TableCell>{formatCurrency(campaign.budget.spent)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-2">
                            <div className="text-sm font-medium">{campaign.performance?.ctr.toFixed(1)}% CTR</div>
                            <div className="text-xs text-muted-foreground">
                              {campaign.performance?.impressions.toLocaleString()} impressions
                            </div>
                          </div>
                          {campaign.performance?.ctr > 2.5 ? (
                            <LineChart className="h-4 w-4 text-green-500" />
                          ) : (
                            <BarChart className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCampaign(campaign.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCampaign(campaign.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="active">
            {/* Similar table for active campaigns only */}
            <p className="text-muted-foreground text-center py-4">
              Filtered view for active campaigns would appear here
            </p>
          </TabsContent>
          
          <TabsContent value="paused">
            {/* Similar table for paused campaigns only */}
            <p className="text-muted-foreground text-center py-4">
              Filtered view for paused campaigns would appear here
            </p>
          </TabsContent>
          
          <TabsContent value="draft">
            {/* Similar table for draft campaigns only */}
            <p className="text-muted-foreground text-center py-4">
              Filtered view for draft campaigns would appear here
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdCampaignManager;
