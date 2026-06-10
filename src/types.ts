/**
 * Type declarations for the Resume Vault application.
 */

export interface Resume {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadTime: string; // ISO String
  expiresAt: string;  // ISO String
  retentionDays: number; // e.g., 15
  status: 'active' | 'expiring_soon' | 'deleted_by_job';
}

export interface CleanupLogEntry {
  id: string;
  timestamp: string;
  type: 'auto' | 'manual';
  resumesDeletedCount: number;
  details: string;
  freedBytes: number;
}

export interface SystemStats {
  activeCount: number;
  deletedCount: number;
  totalSpaceUsed: number; // in bytes
  totalSpaceFreed: number; // in bytes
}

export interface RetentionPolicy {
  days: number;
  label: string;
}
