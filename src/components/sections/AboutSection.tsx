import { FormattedMessage } from 'react-intl'
import { Container } from '@/components/layout/Container'

export const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-24 py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="text-start">
          <p className="mb-2 text-sm font-medium tracking-wide text-secondary-600">
            <FormattedMessage id="about.kicker" />
          </p>
          <h2 className="mb-4 text-3xl text-primary sm:text-4xl">
            <FormattedMessage id="about.title" />
          </h2>
          <p className="text-tertiary-600">
            <FormattedMessage id="about.body" />
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-primary-100">
              <p className="text-2xl font-semibold text-secondary-600">
                <FormattedMessage id={`about.stat${n}.value`} />
              </p>
              <p className="mt-1 text-sm text-tertiary-600">
                <FormattedMessage id={`about.stat${n}.label`} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
