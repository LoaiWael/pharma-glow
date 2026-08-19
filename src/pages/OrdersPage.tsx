import { FormattedMessage } from 'react-intl'

const OrdersPage = () => {
  return (
    <section className="py-12">
      <h1>
        <FormattedMessage id="orders.title" />
      </h1>
      <p className="mt-3 text-tertiary">
        <FormattedMessage id="orders.placeholder" />
      </p>
    </section>
  )
}

export default OrdersPage
