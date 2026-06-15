import { z } from 'zod'
import {
  JOB_STATUSES,
  JOB_TYPES,
  LOCATION_TYPES,
  type JobStatus,
  type JobType,
  type LocationType,
} from './types'

export const upsertJobSchema = z.object({
  companyId: z.string().uuid('Select a company'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(256),
  department: z.string().min(2, 'Department is required').max(128),
  locationType: z.enum(LOCATION_TYPES as [LocationType, ...LocationType[]]),
  locationText: z.string().min(2, 'Location is required').max(256),
  jobType: z.enum(JOB_TYPES as [JobType, ...JobType[]]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  salaryRange: z.string().max(128).optional().nullable(),
  status: z.enum(JOB_STATUSES as [JobStatus, ...JobStatus[]]),
  closingDate: z.string().optional().nullable(),
})

export type UpsertJobFormValues = z.infer<typeof upsertJobSchema>
