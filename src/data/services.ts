import type { MessageKey } from '@/i18n/messages/en'

export type Service = {
  slug: string
  titleKey: MessageKey
  summaryKey: MessageKey
  bodyKey: MessageKey
}

export const services: Service[] = [
  {
    slug: 'brand-identity-creation',
    titleKey: 'service.brandIdentity.title',
    summaryKey: 'service.brandIdentity.summary',
    bodyKey: 'service.brandIdentity.body',
  },
  {
    slug: 'digital-platforms-management',
    titleKey: 'service.digitalPlatforms.title',
    summaryKey: 'service.digitalPlatforms.summary',
    bodyKey: 'service.digitalPlatforms.body',
  },
  {
    slug: 'paid-ad-campaigns',
    titleKey: 'service.adCampaigns.title',
    summaryKey: 'service.adCampaigns.summary',
    bodyKey: 'service.adCampaigns.body',
  },
  {
    slug: 'content-production-brand-management',
    titleKey: 'service.contentProduction.title',
    summaryKey: 'service.contentProduction.summary',
    bodyKey: 'service.contentProduction.body',
  },
  {
    slug: 'influencer-marketing',
    titleKey: 'service.influencerMarketing.title',
    summaryKey: 'service.influencerMarketing.summary',
    bodyKey: 'service.influencerMarketing.body',
  },
]

export const getServiceBySlug = (slug: string | undefined) =>
  services.find((service) => service.slug === slug)
