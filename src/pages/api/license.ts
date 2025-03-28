
import { NextApiRequest, NextApiResponse } from 'next';
import DatabaseService from '@/services/DatabaseService';
import { License, LicenseStatus } from '@/types/License';

// Define request types specific to this API endpoint
interface CreateLicenseRequest {
  userId: string;
  company: string;
  startDate: string;
  endDate: string;
  validity: number;
  status: string;
  features: string[];
  customization: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
    domain: string;
  };
}

interface UpdateLicenseRequest {
  userId?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  validity?: number;
  status?: string;
  features?: string[];
  customization?: {
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
    };
    domain?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = DatabaseService.getInstance();

  switch (req.method) {
    case 'GET': {
      if (req.query.id) {
        const license = db.getLicenseById(req.query.id as string);
        if (license) {
          return res.status(200).json(license);
        }
        return res.status(404).json({ error: 'License not found' });
      }
      
      const licenses = db.getLicenses();
      return res.status(200).json(licenses);
    }

    case 'POST': {
      try {
        const createData: CreateLicenseRequest = req.body;
        if (!createData.userId || !createData.company) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const licenseData: Partial<License> = {
          ...createData,
          // Convert string dates to Date objects for the service
          startDate: new Date(createData.startDate),
          endDate: new Date(createData.endDate),
          status: createData.status as LicenseStatus
        };

        const newLicense = db.createLicense(licenseData);
        return res.status(201).json(newLicense);
      } catch (error) {
        console.error("Error creating license:", error);
        return res.status(500).json({ error: 'Failed to create license' });
      }
    }

    case 'PUT': {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required for update' });
      }
      
      try {
        const updateData: UpdateLicenseRequest = req.body;
        const licenseData: Partial<License> = {
          ...updateData,
          startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
          endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
          status: updateData.status as LicenseStatus | undefined,
          customization: updateData.customization ? {
            logo: updateData.customization.logo || '',
            colors: {
              primary: updateData.customization.colors?.primary || '',
              secondary: updateData.customization.colors?.secondary || ''
            },
            domain: updateData.customization.domain || ''
          } : undefined
        };
        
        const updatedLicense = db.updateLicense(id, licenseData);
        
        if (!updatedLicense) {
          return res.status(404).json({ error: 'License not found' });
        }
        
        return res.status(200).json(updatedLicense);
      } catch (error) {
        console.error("Error updating license:", error);
        return res.status(500).json({ error: 'Failed to update license' });
      }
    }

    case 'DELETE': {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required for deletion' });
      }
      
      try {
        const success = db.deleteLicense(id);
        
        if (!success) {
          return res.status(404).json({ error: 'License not found' });
        }
        
        return res.status(200).json({ success: true, message: 'License deleted successfully' });
      } catch (error) {
        console.error("Error deleting license:", error);
        return res.status(500).json({ error: 'Failed to delete license' });
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
