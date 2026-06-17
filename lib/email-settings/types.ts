export type EmailProvider = 'LOG' | 'SMTP' | 'RESEND'

export const EMAIL_PROVIDERS: EmailProvider[] = ['LOG', 'SMTP', 'RESEND']

/** Read shape — secrets are never returned, only a "set" flag. */
export interface EmailSettings {
  provider: EmailProvider
  fromAddress: string
  smtpHost: string | null
  smtpPort: number
  smtpUseSsl: boolean
  smtpUser: string | null
  smtpPasswordSet: boolean
  resendApiKeySet: boolean
  updatedAtUtc: string | null
  updatedBy: string | null
}

/** Write shape — secret fields are leave-blank-to-keep. */
export interface UpdateEmailSettingsInput {
  provider: EmailProvider
  fromAddress: string
  smtpHost: string | null
  smtpPort: number
  smtpUseSsl: boolean
  smtpUser: string | null
  smtpPassword?: string | null
  resendApiKey?: string | null
}

export interface TestEmailResult {
  success: boolean
  provider: EmailProvider
  error: string | null
}
