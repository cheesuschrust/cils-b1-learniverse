
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
  SelectValue,
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

// Define the system log structure
interface SystemLog {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  category: "auth" | "ai" | "content" | "user" | "system" | "email" | "admin";
  message: string;
  details?: string;
  userId?: string;
  ipAddress?: string;
  resolved?: boolean;
}

// Filter state interface
interface LogFilters {
  level: string;
  category: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  resolved: boolean | undefined;
  search: string;
}

const SystemLogs = () => {
  const { getSystemLogs, updateSystemLog } = useAuth();
  const { toast } = useToast();
  
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<LogFilters>({
    level: '',
    category: '',
    dateFrom: undefined,
    dateTo: undefined,
    resolved: undefined,
    search: '',
  });
  
  const logsPerPage = 10;
  
  // Load logs on mount and when filters change
  useEffect(() => {
    loadLogs();
  }, [filters]);
  
  const loadLogs = () => {
    try {
      // Convert filters to the format expected by getSystemLogs
      const apiFilters: any = {};
      if (filters.level) apiFilters.level = filters.level;
      if (filters.category) apiFilters.category = filters.category;
      if (filters.dateFrom) apiFilters.dateFrom = filters.dateFrom.toISOString();
      if (filters.dateTo) apiFilters.dateTo = filters.dateTo.toISOString();
      if (filters.resolved !== undefined) apiFilters.resolved = filters.resolved;
      
      let filteredLogs = getSystemLogs(apiFilters);
      
      // Apply search filter locally
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.message.toLowerCase().includes(searchLower) || 
          (log.details && log.details.toLowerCase().includes(searchLower)) ||
          (log.userId && log.userId.toLowerCase().includes(searchLower))
        );
      }
      
      setLogs(filteredLogs);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error('Error loading logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system logs',
        variant: 'destructive',
      });
    }
  };
  
  const handleResolveLog = (logId: string, resolved: boolean) => {
    try {
      const success = updateSystemLog(logId, { resolved });
      
      if (success) {
        // Update local state
        setLogs(logs.map(log => 
          log.id === logId ? { ...log, resolved } : log
        ));
        
        if (selectedLog && selectedLog.id === logId) {
          setSelectedLog({ ...selectedLog, resolved });
        }
        
        toast({
          title: resolved ? 'Log Resolved' : 'Log Marked as Unresolved',
          description: `Log has been marked as ${resolved ? 'resolved' : 'unresolved'}`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update log status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error resolving log:', error);
      toast({
        title: 'Error',
        description: 'Failed to update log status',
        variant: 'destructive',
      });
    }
  };
  
  const handleFilterChange = (field: keyof LogFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      level: '',
      category: '',
      dateFrom: undefined,
      dateTo: undefined,
      resolved: undefined,
      search: '',
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(logs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  
  const getLevelBadge = (level: "info" | "warning" | "error") => {
    switch (level) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            <Info className="w-3 h-3 mr-1" /> Info
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" /> Warning
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" /> Error
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">System Logs</h1>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter logs by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level-filter">Log Level</Label>
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
              
              <div className="space-y-2">
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
                    <SelectItem value="auth">Authentication</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resolved-filter">Status</Label>
                <Select
                  value={filters.resolved === undefined ? '' : filters.resolved ? 'resolved' : 'unresolved'}
                  onValueChange={(value) => {
                    if (value === '') {
                      handleFilterChange('resolved', undefined);
                    } else {
                      handleFilterChange('resolved', value === 'resolved');
                    }
                  }}
                >
                  <SelectTrigger id="resolved-filter">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="unresolved">Unresolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? (
                        format(filters.dateFrom, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange('dateFrom', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? (
                        format(filters.dateTo, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange('dateTo', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search in logs..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </CardFooter>
        </Card>
        
        {/* Log Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Log Entries</CardTitle>
                <CardDescription>
                  Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, logs.length)} of {logs.length} logs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="w-[150px]">Category</TableHead>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No logs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentLogs.map((log) => (
                          <TableRow 
                            key={log.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedLog(log)}
                          >
                            <TableCell>{getLevelBadge(log.level)}</TableCell>
                            <TableCell className="font-medium">{log.message}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.category}</Badge>
                            </TableCell>
                            <TableCell>{format(parseISO(log.timestamp), 'PPp')}</TableCell>
                            <TableCell>
                              {log.resolved ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                                  Unresolved
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              {totalPages > 1 && (
                <CardFooter>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          isActive={currentPage > 1}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          isActive={currentPage < totalPages}
                          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Log Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Log Details</CardTitle>
                <CardDescription>
                  Selected log information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedLog ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium mb-1">Level</Label>
                      <div>{getLevelBadge(selectedLog.level)}</div>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium mb-1">Category</Label>
                      <Badge variant="outline">{selectedLog.category}</Badge>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium mb-1">Timestamp</Label>
                      <p className="text-sm">{format(parseISO(selectedLog.timestamp), 'PPpp')}</p>
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium mb-1">Message</Label>
                      <p className="text-sm p-2 bg-muted rounded-md">{selectedLog.message}</p>
                    </div>
                    
                    {selectedLog.details && (
                      <div>
                        <Label className="block text-sm font-medium mb-1">Details</Label>
                        <pre className="text-xs p-2 bg-muted rounded-md whitespace-pre-wrap font-mono">
                          {selectedLog.details}
                        </pre>
                      </div>
                    )}
                    
                    {selectedLog.userId && (
                      <div>
                        <Label className="block text-sm font-medium mb-1">User ID</Label>
                        <p className="text-sm p-2 bg-muted rounded-md">{selectedLog.userId}</p>
                      </div>
                    )}
                    
                    {selectedLog.ipAddress && (
                      <div>
                        <Label className="block text-sm font-medium mb-1">IP Address</Label>
                        <p className="text-sm p-2 bg-muted rounded-md">{selectedLog.ipAddress}</p>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="resolved" 
                          checked={selectedLog.resolved}
                          onCheckedChange={(checked) => {
                            handleResolveLog(selectedLog.id, checked === true);
                          }}
                        />
                        <label
                          htmlFor="resolved"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Mark as resolved
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Select a log to view details</p>
                  </div>
                )}
              </CardContent>
              {selectedLog && (
                <CardFooter>
                  <Button
                    variant={selectedLog.resolved ? "outline" : "default"}
                    className="w-full"
                    onClick={() => handleResolveLog(selectedLog.id, !selectedLog.resolved)}
                  >
                    {selectedLog.resolved ? (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark as Unresolved
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Resolved
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SystemLogs;
