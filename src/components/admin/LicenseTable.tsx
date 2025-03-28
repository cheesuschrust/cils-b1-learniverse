
import React from 'react';
import { License, LicenseType, LicenseStatus } from '@/types/license';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LicenseTableProps {
  licenses: License[];
  isLoading: boolean;
  onEdit: (license: License) => void;
  onDelete: (license: License) => void;
  getLicenseTypeIcon: (type: LicenseType) => React.ReactNode;
  getStatusBadgeVariant: (status: string) => string;
}

const LicenseTable: React.FC<LicenseTableProps> = ({
  licenses,
  isLoading,
  onEdit,
  onDelete,
  getLicenseTypeIcon,
  getStatusBadgeVariant
}) => {
  const getStatusBadge = (status: LicenseStatus) => {
    let variant = getStatusBadgeVariant(status);
    let label = status.charAt(0).toUpperCase() + status.slice(1);
    
    return (
      <Badge variant={variant as any} className="capitalize">
        {status === 'active' && <span className="mr-1">●</span>}
        {label}
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (licenses.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No licenses found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {licenses.map((license) => (
            <TableRow key={license.id}>
              <TableCell>
                <div className="font-medium">{license.name}</div>
                <div className="text-sm text-muted-foreground">{license.contactEmail}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getLicenseTypeIcon(license.type)}
                  <span className="capitalize">{license.type.replace('-', ' ')}</span>
                </div>
              </TableCell>
              <TableCell>{license.plan}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{license.usedSeats} of {license.seats} seats</span>
                    <span className="text-muted-foreground">
                      {Math.round((license.usedSeats / license.seats) * 100)}%
                    </span>
                  </div>
                  <Progress value={(license.usedSeats / license.seats) * 100} className="h-1" />
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(license.status)}</TableCell>
              <TableCell>
                <div className="font-medium">{new Date(license.endDate).toLocaleDateString()}</div>
                <div className="text-xs text-muted-foreground">
                  Renewal: {license.renewalStatus.replace('-', ' ')}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(license)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit license
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(license)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete license
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LicenseTable;
