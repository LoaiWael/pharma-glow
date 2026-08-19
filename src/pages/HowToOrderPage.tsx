import { useIntl } from 'react-intl'
import { motion } from 'motion/react'
import { ShoppingCart, CheckCircle, Truck, HelpCircle } from 'lucide-react'

const HowToOrderPage = () => {
  const intl = useIntl()
  const isAr = intl.locale === 'ar'

  const steps = [
    {
      icon: <ShoppingCart className="size-6 text-primary-600" />,
      title: isAr ? '١. اختر منتجاتك' : '1. Select Your Products',
      description: isAr
        ? 'تصفح تشكيلتنا المميزة من منتجات العناية بالبشرة والجسم وأضفها إلى حقيبة التسوق.'
        : 'Browse our curated collection of skincare and bodycare products and add them to your shopping bag.',
    },
    {
      icon: <CheckCircle className="size-6 text-secondary" />,
      title: isAr ? '٢. مراجعة الحقيبة والشراء' : '2. Review Bag & Checkout',
      description: isAr
        ? 'توجه إلى الحقيبة لمراجعة طلبك وإدخال بيانات التوصيل والدفع بكل أمان.'
        : 'Go to your bag to review your items, fill in your delivery details, and complete your secure payment.',
    },
    {
      icon: <Truck className="size-6 text-tertiary-foreground" />,
      title: isAr ? '٣. التوصيل السريع' : '3. Fast Delivery',
      description: isAr
        ? 'سنقوم بتجهيز طلبك وتغليفه بعناية فائقة ليصلك إلى باب منزلك في أسرع وقت.'
        : 'We will carefully package and dispatch your order directly to your doorstep in no time.',
    },
  ]

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary-900 dark:text-primary-100 ring-1 ring-primary/30">
          <HelpCircle className="size-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {isAr ? 'كيفية الطلب' : 'How to Order'}
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          {isAr
            ? 'خطوات بسيطة وسهلة للحصول على أفضل منتجات العناية والتجميل.'
            : 'Simple and easy steps to get your favorite beauty and skincare products.'}
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="flex flex-col items-center text-center rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/50"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HowToOrderPage
