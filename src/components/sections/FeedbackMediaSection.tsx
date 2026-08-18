import { FormattedMessage } from 'react-intl'
import { ImageIcon, Play } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'

export const FeedbackMediaSection = () => {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          kicker="media.kicker"
          title="media.title"
          subtitle="media.subtitle"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl bg-primary text-white">
            <Play className="size-10" />
            <p className="text-sm">
              <FormattedMessage id="media.item1" />
            </p>
          </div>
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-secondary-300 bg-secondary-50 text-secondary-700">
            <ImageIcon className="size-10" />
            <p className="text-sm">
              <FormattedMessage id="media.item2" />
            </p>
          </div>
          <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl bg-tertiary-800 text-white">
            <Play className="size-10" />
            <p className="text-sm">
              <FormattedMessage id="media.item3" />
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
