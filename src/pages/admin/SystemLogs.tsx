
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Filter,
  RefreshCw,
  CheckCircle,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

const SystemLogs = () => {
  const { getSystemLogs, updateSystemLog, user } = useAuth();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    resolved: undefined as boolean | undefined,
  });
  
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get unique categories for the filter dropdown
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  const loadLogs = () => {
    try {
      // Get all logs
      const logs = getSystemLogs();
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(logs.map(log => log.category)));
      setCategories(uniqueCategories);
      
      // Apply filters and set the filtered logs
      applyFilters();
    } catch (error) {
      console.error('Error loading logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system logs',
        variant: 'destructive',
      });
    }
  };
  
  const applyFilters = () => {
    try {
      // Get logs with filters
      const logs = getSystemLogs({
        level: filters.level ? (filters.level as "info" | "warning" | "error") : undefined,
        category: filters.category || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        resolved: filters.resolved,
      });
      
      // Sort by timestamp descending (newest first)
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setTotalPages(Math.ceil(sortedLogs.length / ITEMS_PER_PAGE));
      
      // Apply pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedLogs = sortedLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setFilteredLogs(paginatedLogs);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast({
        title: 'Error',
        description: 'Failed to filter system logs',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    applyFilters();
  }, [filters, currentPage]);
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const resetFilters = () => {
    setFilters({
      level: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      resolved: undefined,
    });
    setCurrentPage(1);
  };
  
  const handleLogClick = (log: any) => {
    setSelectedLog(log);
    setIsDialogOpen(true);
  };
  
  const toggleLogResolution = async (logId: string, currentState: boolean) => {
    const success = updateSystemLog(logId, { resolved: !currentState });
    
    if (success) {
      toast({
        title: 'Success',
        description: `Log ${!currentState ? 'marked as resolved' : 'unmarked as resolved'}`,
      });
      
      // Update the selected log if it's open
      if (selectedLog && selectedLog.id === logId) {
        setSelectedLog({
          ...selectedLog,
          resolved: !currentState,
        });
      }
      
      // Refresh logs
      applyFilters();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update log status',
        variant: 'destructive',
      });
    }
  };
  
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Info</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Warning</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Error</Badge>;
      default:
        return null;
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return dateString;
    }
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={currentPage === pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">System Logs</h1>
          <Button onClick={loadLogs} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" />
            <h2 className="font-medium">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="level-filter">Level</Label>
              <Select
                value={filters.level}
                onValueChange={(value) => handleFilterChange('level', value)}
              >
                <SelectTrigger id="level-filter">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <div>
              <Label htmlFor="resolved-filter">Status</Label>
              <Select
                value={filters.resolved === undefined ? "" : String(filters.resolved)}
                onValueChange={(value) => {
                  if (value === "") {
                    handleFilterChange('resolved', undefined);
                  } else {
                    handleFilterChange('resolved', value === "true");
                  }
                }}
              >
                <SelectTrigger id="resolved-filter" className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="false">Unresolved</SelectItem>
                  <SelectItem value="true">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Results Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Time</TableHead>
                <TableHead className="w-[100px]">Level</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No logs found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-mono text-xs" onClick={() => handleLogClick(log)}>
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell onClick={() => handleLogClick(log)}>
                      <div className="flex items-center">
                        {getLevelIcon(log.level)}
                        <span className="ml-2 capitalize">{log.level}</span>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleLogClick(log)}>
                      <Badge variant="outline" className="capitalize">
                        {log.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate" onClick={() => handleLogClick(log)}>
                      {log.message}
                    </TableCell>
                    <TableCell onClick={() => handleLogClick(log)}>
                      {log.resolved ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          Unresolved
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLogResolution(log.id, log.resolved);
                        }}
                      >
                        {log.resolved ? (
                          <X className="h-4 w-4 text-gray-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {renderPagination()}
        </div>
        
        {/* Log Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
              <DialogDescription>
                Full information about the selected log entry
              </DialogDescription>
            </DialogHeader>
            
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
                    <p className="font-mono">{formatDateTime(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Level</h3>
                    <div className="flex items-center mt-1">
                      {getLevelBadge(selectedLog.level)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="capitalize">{selectedLog.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="flex items-center mt-1">
                      {selectedLog.resolved ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          Unresolved
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Message</h3>
                  <p className="mt-1">{selectedLog.message}</p>
                </div>
                
                {selectedLog.details && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Details</h3>
                    <pre className="mt-1 p-3 bg-gray-50 rounded text-sm font-mono overflow-x-auto">
                      {selectedLog.details}
                    </pre>
                  </div>
                )}
                
                {selectedLog.userId && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                    <p className="mt-1 font-mono text-sm">{selectedLog.userId}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant={selectedLog.resolved ? "destructive" : "default"}
                    onClick={() => toggleLogResolution(selectedLog.id, selectedLog.resolved)}
                  >
                    {selectedLog.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default SystemLogs;
