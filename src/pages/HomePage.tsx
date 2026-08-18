import { AboutSection } from '@/components/sections/AboutSection'
import { EventsSection } from '@/components/sections/EventsSection'
import { FeedbackMediaSection } from '@/components/sections/FeedbackMediaSection'
import { FeedbackTextSection } from '@/components/sections/FeedbackTextSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { SponsorsSection } from '@/components/sections/SponsorsSection'
import { UspSection } from '@/components/sections/UspSection'

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <AboutSection />
      <ServicesSection limit={3} />
      <UspSection />
      <EventsSection />
      <FeedbackTextSection />
      <FeedbackMediaSection />
    </>
  )
}
