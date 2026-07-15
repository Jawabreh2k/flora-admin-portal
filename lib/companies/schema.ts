import { z } from 'zod'

export const upsertCompanySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(256),
  logoUrl: z.string().max(2048).optional().nullable(),
  website: z.string().max(2048).optional().nullable(),
  description: z.string().max(4000).optional().nullable(),
})

export type UpsertCompanyFormValues = z.infer<typeof upsertCompanySchema>
