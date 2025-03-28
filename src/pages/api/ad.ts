
import { NextApiRequest, NextApiResponse } from 'next';
import DatabaseService from '@/services/DatabaseService';
import { AdUnit } from '@/types/ad';

// Define request types specific to this API endpoint
interface CreateAdRequest {
  owner: string;
  title: string;
  description: string;
  startDate: string; // Accept strings, convert to Date later
  endDate: string;
  adFormat: string;
  dimensions: string;
  placements: string[];
  targeting: string[];
  price: number;
  currency: string;
  company: string;
  status: string;
}

interface UpdateAdRequest {
  owner?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  adFormat?: string;
  dimensions?: string;
  placements?: string[];
  targeting?: string[];
  price?: number;
  currency?: string;
  company?: string;
  status?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = DatabaseService.getInstance();

  switch (req.method) {
    case 'GET': {
      if (req.query.id) {
        const adUnit = db.getAdUnitById(req.query.id as string);
        if (adUnit) {
          return res.status(200).json(adUnit);
        }
        return res.status(404).json({ error: 'Ad unit not found' });
      }
      
      const adUnits = db.getAdUnits();
      return res.status(200).json(adUnits);
    }

    case 'POST': {
      try {
        const createData: CreateAdRequest = req.body;
        if (!createData.owner || !createData.title) {
          return res.status(400).json({ message: "Missing required fields (owner, title)" });
        }

        const adData: Partial<AdUnit> = {
          ...createData,
          startDate: new Date(createData.startDate),
          endDate: new Date(createData.endDate),
        };

        const newAdUnit = db.createAdUnit(adData);
        return res.status(201).json(newAdUnit);
      } catch (error) {
        console.error("Error creating ad:", error);
        return res.status(500).json({ error: 'Failed to create ad unit' });
      }
    }

    case 'PUT': {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required for update' });
      }
      
      try {
        const updateData: UpdateAdRequest = req.body;
        const adData: Partial<AdUnit> = {
          ...updateData,
          startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
          endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
        };
        
        const updatedAd = db.updateAdUnit(id, adData);
        
        if (!updatedAd) {
          return res.status(404).json({ error: 'Ad unit not found' });
        }
        
        return res.status(200).json(updatedAd);
      } catch (error) {
        console.error("Error updating ad:", error);
        return res.status(500).json({ error: 'Failed to update ad unit' });
      }
    }

    case 'DELETE': {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required for deletion' });
      }
      
      try {
        const success = db.deleteAdUnit(id);
        
        if (!success) {
          return res.status(404).json({ error: 'Ad unit not found' });
        }
        
        return res.status(200).json({ success: true, message: 'Ad unit deleted successfully' });
      } catch (error) {
        console.error("Error deleting ad:", error);
        return res.status(500).json({ error: 'Failed to delete ad unit' });
      }
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
