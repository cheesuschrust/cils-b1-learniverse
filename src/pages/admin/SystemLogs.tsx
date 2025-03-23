import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogCategory, LogEntry } from "@/contexts/shared-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Copy, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type SystemLog = LogEntry;

const SystemLogs = () => {
  const { getSystemLogs, updateSystemLog } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<LogCategory | "all">("all");
  const [levelFilter, setLevelFilter] = useState<"all" | "info" | "warning" | "error">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedDetails, setEditedDetails] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    const allLogs = getSystemLogs();
    // Ensure the timestamp is handled as a string, not a Date object
    setLogs(allLogs.map(log => ({
      ...log,
      timestamp: typeof log.timestamp === 'object' && log.timestamp !== null 
        ? log.timestamp.toISOString() 
        : log.timestamp || new Date().toISOString()
    })));
  }, []);
  
  useEffect(() => {
    let filtered = [...logs];
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }
    
    if (levelFilter !== "all") {
      filtered = filtered.filter(log => log.level === levelFilter);
    }
    
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        const fromDate = new Date(dateRange.from as Date);
        const toDate = new Date(dateRange.to as Date);
        toDate.setHours(23, 59, 59, 999);
        return logDate >= fromDate && logDate <= toDate;
      });
    }
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(lowerSearchTerm) ||
        (log.details && log.details.toLowerCase().includes(lowerSearchTerm)) ||
        log.id.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, categoryFilter, levelFilter, dateRange, searchTerm]);
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown date';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error("Invalid date format:", dateStr);
      return 'Invalid date';
    }
  };
  
  const handleCopyLogId = (logId: string) => {
    navigator.clipboard.writeText(logId);
    toast({
      title: "Log ID Copied",
      description: "The log ID has been copied to your clipboard.",
    });
  };
  
  const handleClearFilters = () => {
    setCategoryFilter("all");
    setLevelFilter("all");
    setDateRange(undefined);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const handleOpenEditDialog = (log: SystemLog) => {
    setSelectedLog(log);
    setEditedDetails(log.details || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedDetails = async () => {
    if (!selectedLog) return;

    setIsUpdating(true);
    try {
      const success = await updateSystemLog(selectedLog.id, { details: editedDetails });
      if (success) {
        setLogs(prevLogs =>
          prevLogs.map(log =>
            log.id === selectedLog.id ? { ...log, details: editedDetails } : log
          )
        );

        toast({
          title: "Log Updated",
          description: "Log details have been updated successfully.",
        });
        setIsEditDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update log details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating log details:", error);
      toast({
        title: "Error",
        description: "Failed to update log details.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">System Logs</CardTitle>
          <CardDescription>
            View and manage system activity logs
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as LogCategory | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="auth">Auth</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="level-filter">Level</Label>
              <Select
                value={levelFilter}
                onValueChange={(value) => setLevelFilter(value as "all" | "info" | "warning" | "error")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                      ) : (
                        format(dateRange.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={{ before: new Date("2023-01-01") }}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="search-term">Search</Label>
              <div className="relative">
                <Input
                  id="search-term"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchTerm("")}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          
          <ScrollArea className="rounded-md border">
            <div className="relative min-h-[300px]">
              {currentLogs.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  No logs found.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="[&_th]:px-4 [&_th]:py-2 [&_tr]:border-b">
                    <tr>
                      <th>Timestamp</th>
                      <th>Category</th>
                      <th>Level</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLogs.map((log) => (
                      <tr key={log.id} className="[&_td]:px-4 [&_td]:py-2 [&_tr]:border-b last:border-none">
                        <td>{formatDate(log.timestamp)}</td>
                        <td>{log.category}</td>
                        <td>
                          <Badge
                            variant={
                              log.level === "error"
                                ? "destructive"
                                : log.level === "warning"
                                ? "secondary"
                                : "secondary"
                            }
                          >
                            {log.level}
                          </Badge>
                        </td>
                        <td>{log.action}</td>
                        <td className="max-w-[300px] truncate" title={log.details}>
                          {log.details}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyLogId(log.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditDialog(log)}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {currentLogs.length} of {filteredLogs.length} logs
            </div>
            
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => 
                  prev < Math.ceil(filteredLogs.length / logsPerPage) ? prev + 1 : prev
                )}
                disabled={currentPage >= Math.ceil(filteredLogs.length / logsPerPage)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Log Details</DialogTitle>
            <DialogDescription>
              Edit the details for the selected log entry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                placeholder="Log details..."
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveEditedDetails} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemLogs;
