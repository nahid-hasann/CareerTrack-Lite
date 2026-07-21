import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Create a new job application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    const { companyName, jobTitle, jobUrl, source, status, applicationDate, notes } = req.body;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Company name is required' });
    }

    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Job title is required' });
    }

    const applicationStatus = status ? (status as string).toUpperCase().trim() : 'APPLIED';

    const newApplication = await prisma.application.create({
      data: {
        userId,
        companyName: (companyName as string).trim(),
        jobTitle: (jobTitle as string).trim(),
        jobUrl: jobUrl ? (jobUrl as string).trim() : null,
        source: source ? (source as string).trim() : null,
        status: applicationStatus,
        applicationDate: applicationDate ? new Date(applicationDate as string) : new Date(),
        notes: notes ? (notes as string).trim() : null,
      },
    });

    return res.status(201).json({
      message: 'Application created successfully',
      application: newApplication,
    });
  } catch (error: any) {
    console.error('Create Application Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to create job application',
    });
  }
};

// Fetch all applications for the logged-in user with optional search & filter
export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    const { q, search, status } = req.query;
    const rawSearch = (search || q);
    const searchTerm = typeof rawSearch === 'string' ? rawSearch.trim() : undefined;
    const statusFilter = typeof status === 'string' ? status.trim().toUpperCase() : undefined;

    const whereCondition: any = {
      userId,
    };

    if (statusFilter && statusFilter !== '') {
      whereCondition.status = statusFilter;
    }

    if (searchTerm && searchTerm !== '') {
      whereCondition.OR = [
        { companyName: { contains: searchTerm, mode: 'insensitive' } },
        { jobTitle: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const applications = await prisma.application.findMany({
      where: whereCondition,
      orderBy: { applicationDate: 'desc' },
    });

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error('Get Applications Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch applications',
    });
  }
};

// Get single application details with strict ownership check
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Application not found or access denied',
      });
    }

    return res.status(200).json({ application });
  } catch (error: any) {
    console.error('Get Application By ID Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to fetch application details',
    });
  }
};

// Update application with strict ownership check
export const updateApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    // Check ownership first
    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Application not found or access denied',
      });
    }

    const { companyName, jobTitle, jobUrl, source, status, applicationDate, notes } = req.body;

    const updateData: any = {};
    if (companyName !== undefined) updateData.companyName = (companyName as string).trim();
    if (jobTitle !== undefined) updateData.jobTitle = (jobTitle as string).trim();
    if (jobUrl !== undefined) updateData.jobUrl = jobUrl ? (jobUrl as string).trim() : null;
    if (source !== undefined) updateData.source = source ? (source as string).trim() : null;
    if (status !== undefined) updateData.status = (status as string).toUpperCase().trim();
    if (applicationDate !== undefined) updateData.applicationDate = new Date(applicationDate as string);
    if (notes !== undefined) updateData.notes = notes ? (notes as string).trim() : null;

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Application updated successfully',
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error('Update Application Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to update application',
    });
  }
};

// Delete application with strict ownership check
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not authenticated' });
    }

    // Check ownership first
    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Application not found or access denied',
      });
    }

    await prisma.application.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Application deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete Application Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to delete application',
    });
  }
};
