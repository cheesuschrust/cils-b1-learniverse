
import { NextApiRequest, NextApiResponse } from 'next';
import DatabaseService from '@/services/DatabaseService';
import { AdUnit } from '@/types/ad';

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
      const adData = req.body as Partial<AdUnit>;
      const newAdUnit = db.createAdUnit(adData);
      return res.status(201).json(newAdUnit);
    }

    case 'PUT': {
      const { id } = req.query;
      const adData = req.body as Partial<AdUnit>;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required for update' });
      }
      
      const updatedAd = db.updateAdUnit(id as string, adData);
      
      if (!updatedAd) {
        return res.status(404).json({ error: 'Ad unit not found' });
      }
      
      return res.status(200).json(updatedAd);
    }

    case 'DELETE': {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required for deletion' });
      }
      
      const success = db.deleteAdUnit(id as string);
      
      if (!success) {
        return res.status(404).json({ error: 'Ad unit not found' });
      }
      
      return res.status(200).json({ success: true, message: 'Ad unit deleted successfully' });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
