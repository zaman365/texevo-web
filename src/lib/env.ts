export const isPreview = process.env.SITE_MODE !== 'live'
export const siteURL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
export const contactEmail = process.env.CONTACT_EMAIL || ''
export const contactPhone = process.env.CONTACT_PHONE || ''
export const newsletterEnabled = process.env.NEWSLETTER_ENABLED === 'true'
