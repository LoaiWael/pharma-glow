import { FormattedMessage } from 'react-intl'

const WishlistPage = () => {
  return (
    <section className="py-12">
      <h1>
        <FormattedMessage id="wishlist.title" />
      </h1>
      <p className="mt-3 text-tertiary">
        <FormattedMessage id="wishlist.empty" />
      </p>
    </section>
  )
}

export default WishlistPage
