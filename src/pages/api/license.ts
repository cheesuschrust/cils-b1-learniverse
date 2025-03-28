
import { NextApiRequest, NextApiResponse } from 'next';
import DatabaseService from '@/services/DatabaseService';
import { License } from '@/types/License';

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
      const licenseData = req.body as Partial<License>;
      const newLicense = db.createLicense(licenseData);
      return res.status(201).json(newLicense);
    }

    case 'PUT': {
      const { id } = req.query;
      const licenseData = req.body as Partial<License>;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required for update' });
      }
      
      const updatedLicense = db.updateLicense(id as string, licenseData);
      
      if (!updatedLicense) {
        return res.status(404).json({ error: 'License not found' });
      }
      
      return res.status(200).json(updatedLicense);
    }

    case 'DELETE': {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required for deletion' });
      }
      
      const success = db.deleteLicense(id as string);
      
      if (!success) {
        return res.status(404).json({ error: 'License not found' });
      }
      
      return res.status(200).json({ success: true, message: 'License deleted successfully' });
    }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
