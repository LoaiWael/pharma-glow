import { FormattedMessage } from 'react-intl'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Button } from '@/components/ui/button'

const items = [1, 2, 3] as const

export const EventsSection = () => {
  return (
    <section id="events" className="scroll-mt-24 py-16">
      <Container>
        <SectionHeading kicker="events.kicker" title="events.title" />
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((n) => (
            <article
              key={n}
              className="flex flex-col rounded-2xl border border-primary-100 bg-white p-6 text-start"
            >
              <p className="text-sm text-secondary-600">
                <FormattedMessage id={`events.item${n}.meta`} />
              </p>
              <h3 className="mt-2 text-lg font-medium text-primary">
                <FormattedMessage id={`events.item${n}.title`} />
              </h3>
              <p className="mt-2 flex-1 text-sm text-tertiary-600">
                <FormattedMessage id={`events.item${n}.body`} />
              </p>
              <Button className="mt-5 w-fit px-3" size="sm" variant="secondary">
                <FormattedMessage id="events.cta" />
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
