import { FormattedMessage } from 'react-intl'
import type { MessageKey } from '@/i18n/messages/en'

type SectionHeadingProps = {
  kicker: MessageKey
  title: MessageKey
  subtitle?: MessageKey
  light?: boolean
}

export const SectionHeading = ({
  kicker,
  title,
  subtitle,
  light = false,
}: SectionHeadingProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-6 text-center">
      <p
        className={
          light
            ? 'text-3xl font-medium tracking-wide text-secondary-200'
            : 'text-3xl font-medium tracking-wide text-secondary-600'
        }
      >
        <FormattedMessage id={kicker} />
      </p>
      <h2 className={light ? '!m-0 text-xl text-white sm:text-4xl' : '!m-0 text-3xl !text-primary-950 sm:text-xl'}>
        <FormattedMessage id={title} />
      </h2>
      {subtitle ? (
        <p className={light ? 'mt-3 text-primary-200' : 'mt-3 text-tertiary-600'}>
          <FormattedMessage id={subtitle} />
        </p>
      ) : null}
    </div>
  )
}
