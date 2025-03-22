
import React, { useState, useEffect } from "react";
import { useAuth, LogCategory } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, FilterIcon, RefreshCw, Trash2, AlertCircle, CheckCircle, InfoIcon, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

// Update the SystemLog interface to match LogEntry from AuthContext
interface SystemLog {
  id: string;
  timestamp: Date;
  category: LogCategory;
  action: string;
  userId?: string;
  details?: string;
  level: 'info' | 'warning' | 'error';
}

const SystemLogs = () => {
  const { getSystemLogs, updateSystemLog } = useAuth();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [activeCategory, setActiveCategory] = useState<LogCategory | "all">("all");
  const [activeLevel, setActiveLevel] = useState<'all' | 'info' | 'warning' | 'error'>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy HH:mm:ss");
  };
  
  // Load logs based on current filters
  const loadLogs = () => {
    let category: LogCategory | undefined = activeCategory as LogCategory;
    if (activeCategory === "all") {
      category = undefined;
    }
    
    let level: 'info' | 'warning' | 'error' | undefined = undefined;
    if (activeLevel !== 'all') {
      level = activeLevel;
    }
    
    let startDateTime: Date | undefined = undefined;
    if (startDate) {
      startDateTime = new Date(startDate);
    }
    
    let endDateTime: Date | undefined = undefined;
    if (endDate) {
      endDateTime = new Date(endDate);
      // Set to end of day
      endDateTime.setHours(23, 59, 59, 999);
    }
    
    // Get logs with filters
    const fetchedLogs = getSystemLogs(category, level, startDateTime, endDateTime);
    
    // Apply search filter if needed
    let filteredLogs = fetchedLogs;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredLogs = fetchedLogs.filter(log => 
        log.action.toLowerCase().includes(searchLower) || 
        (log.details && log.details.toLowerCase().includes(searchLower)) ||
        (log.userId && log.userId.toLowerCase().includes(searchLower))
      );
    }
    
    setLogs(filteredLogs);
  };
  
  // Load logs on mount and when filters change
  useEffect(() => {
    loadLogs();
  }, [activeCategory, activeLevel, searchTerm, startDate, endDate]);
  
  // Get level badge style
  const getLevelBadge = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'info':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <InfoIcon className="h-3 w-3 mr-1" />
            Info
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
    }
  };
  
  // Get category badge
  const getCategoryBadge = (category: LogCategory) => {
    let color = "";
    switch (category) {
      case 'auth':
        color = "bg-purple-50 text-purple-700 border-purple-200";
        break;
      case 'user':
        color = "bg-green-50 text-green-700 border-green-200";
        break;
      case 'content':
        color = "bg-blue-50 text-blue-700 border-blue-200";
        break;
      case 'email':
        color = "bg-amber-50 text-amber-700 border-amber-200";
        break;
      case 'system':
        color = "bg-gray-50 text-gray-700 border-gray-200";
        break;
      case 'ai':
        color = "bg-cyan-50 text-cyan-700 border-cyan-200";
        break;
    }
    
    return (
      <Badge variant="outline" className={color}>
        {category}
      </Badge>
    );
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage);
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Handle export to CSV
  const exportToCSV = () => {
    const header = "ID,Timestamp,Category,Action,User ID,Details,Level\n";
    const csvContent = logs.map(log => {
      const timestamp = formatDate(log.timestamp);
      const details = log.details ? `"${log.details.replace(/"/g, '""')}"` : "";
      return `${log.id},"${timestamp}",${log.category},"${log.action.replace(/"/g, '""')}",${log.userId || ""},"${details}",${log.level}`;
    }).join('\n');
    
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Reset filters
  const resetFilters = () => {
    setActiveCategory("all");
    setActiveLevel("all");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">System Logs</CardTitle>
          <CardDescription>View and analyze system activity logs</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={loadLogs} 
                title="Refresh logs"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={exportToCSV} 
                title="Export logs to CSV"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetFilters} 
                title="Reset filters"
              >
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <Select value={activeCategory} onValueChange={(value) => setActiveCategory(value as LogCategory | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={activeLevel} onValueChange={(value) => setActiveLevel(value as 'all' | 'info' | 'warning' | 'error')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              
              <div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  placeholder="Start date"
                />
              </div>
              
              <div>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-full">Action</TableHead>
                  <TableHead>User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(log.category)}
                      </TableCell>
                      <TableCell>
                        {getLevelBadge(log.level)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.action}</div>
                          {log.details && (
                            <div className="text-sm text-muted-foreground">{log.details}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {log.userId || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {logs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, logs.length)} of {logs.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <span className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;
