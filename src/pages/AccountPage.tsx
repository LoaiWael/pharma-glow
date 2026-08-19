import { FormattedMessage } from 'react-intl'

const AccountPage = () => {
  return (
    <section className="py-12">
      <h1>
        <FormattedMessage id="account.title" />
      </h1>
      <p className="mt-3 text-tertiary">
        <FormattedMessage id="account.placeholder" />
      </p>
    </section>
  )
}

export default AccountPage
