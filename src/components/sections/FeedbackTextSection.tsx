import { FormattedMessage } from 'react-intl'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'

const items = [1, 2, 3] as const

export const FeedbackTextSection = () => {
  return (
    <section id="feedback" className="scroll-mt-24 bg-white py-16">
      <Container>
        <SectionHeading kicker="feedback.kicker" title="feedback.title" />
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((n) => (
            <blockquote
              key={n}
              className="rounded-2xl border border-primary-100 bg-neutral-50 p-6 text-start"
            >
              <p className="text-sm text-primary">
                “<FormattedMessage id={`feedback.item${n}.quote`} />”
              </p>
              <footer className="mt-4">
                <p className="text-sm font-medium text-primary">
                  <FormattedMessage id={`feedback.item${n}.name`} />
                </p>
                <p className="text-xs text-tertiary-600">
                  <FormattedMessage id={`feedback.item${n}.role`} />
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  )
}
