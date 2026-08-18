import { FormattedMessage } from 'react-intl'

const WishlistPage = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-secondary">
        <FormattedMessage id="wishlist.title" />
      </h1>
      <p className="mt-3 text-tertiary">
        <FormattedMessage id="wishlist.empty" />
      </p>
    </section>
  )
}

export default WishlistPage
