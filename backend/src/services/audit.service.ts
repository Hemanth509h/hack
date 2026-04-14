import { AuditLog } from '../models/AuditLog';
import mongoose from 'mongoose';

export const logAdminAction = async (
  adminId: string,
  action: string,
  resource: string,
  resourceId?: string,
  metadata?: any
) => {
  try {
    await AuditLog.create({
      adminId: new mongoose.Types.ObjectId(adminId),
      action,
      resource,
      resourceId: resourceId ? new mongoose.Types.ObjectId(resourceId) : undefined,
      metadata,
    });
  } catch (error) {
    console.error('[audit-service]: Failed to log admin action:', error);
    // Don't throw - audit logging should not break the main workflow
  }
};
