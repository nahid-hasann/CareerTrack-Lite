import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    const applications = await prisma.application.findMany({
      where: { userId },
      select: { status: true },
    });

    const stats = {
      total: applications.length,
      saved: 0,
      applied: 0,
      assessment: 0,
      interview: 0,
      rejected: 0,
      offer: 0,
    };

    applications.forEach((app) => {
      const status = app.status.toUpperCase();
      if (status === 'SAVED') stats.saved++;
      else if (status === 'APPLIED') stats.applied++;
      else if (status === 'ASSESSMENT') stats.assessment++;
      else if (status === 'INTERVIEW') stats.interview++;
      else if (status === 'REJECTED') stats.rejected++;
      else if (status === 'OFFER') stats.offer++;
    });

    return res.status(200).json({
      stats,
    });
  } catch (error: any) {
    console.error('Get Dashboard Stats Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to retrieve dashboard statistics',
    });
  }
};
