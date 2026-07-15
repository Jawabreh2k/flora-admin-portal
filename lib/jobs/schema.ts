import { z } from 'zod'
import {
  JOB_STATUSES,
  JOB_TYPES,
  LOCATION_TYPES,
  type JobStatus,
  type JobType,
  type LocationType,
} from './types'

// Arabic translation is optional throughout — the public site falls back to the
// English content when it's blank, so these fields only validate when filled in.
export const upsertJobSchema = z.object({
  companyId: z.string().uuid('Select a company'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(256),
  titleAr: z.union([z.string().max(256), z.literal('')]).optional().nullable(),
  department: z.string().min(2, 'Department is required').max(128),
  locationType: z.enum(LOCATION_TYPES as [LocationType, ...LocationType[]]),
  locationText: z.string().min(2, 'Location is required').max(256),
  jobType: z.enum(JOB_TYPES as [JobType, ...JobType[]]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  descriptionAr: z
    .union([z.string().min(10, 'Arabic description must be at least 10 characters'), z.literal('')])
    .optional()
    .nullable(),
  requirements: z.array(z.string()),
  requirementsAr: z.array(z.string()),
  responsibilities: z.array(z.string()),
  responsibilitiesAr: z.array(z.string()),
  salaryRange: z.string().max(128).optional().nullable(),
  status: z.enum(JOB_STATUSES as [JobStatus, ...JobStatus[]]),
  closingDate: z.string().optional().nullable(),
})

export type UpsertJobFormValues = z.infer<typeof upsertJobSchema>
