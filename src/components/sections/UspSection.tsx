import { FormattedMessage } from 'react-intl'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'

const items = [1, 2, 3, 4] as const

export const UspSection = () => {
  return (
    <section className="bg-primary py-16 text-white">
      <Container>
        <SectionHeading kicker="usp.kicker" title="usp.title" light />
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((n) => (
            <div key={n} className="rounded-2xl bg-primary-800 p-6 text-start">
              <h3 className="mb-2 text-lg font-medium text-white">
                <FormattedMessage id={`usp.item${n}.title`} />
              </h3>
              <p className="text-sm text-primary-200">
                <FormattedMessage id={`usp.item${n}.body`} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
