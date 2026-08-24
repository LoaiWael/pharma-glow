import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShoppingBag,
  MapPin,
  Banknote,
  CheckCircle2,
  Truck,
  UserCheck,
  UserX,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales'
import { getLocalizedPath } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const HowToOrderPage = () => {
  const intl = useIntl()
  const locale: Locale = isLocale(intl.locale) ? intl.locale : DEFAULT_LOCALE
  const isAr = locale === 'ar'
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const steps = [
    {
      step: '01',
      icon: <ShoppingBag className="size-6 text-secondary" />,
      title: isAr ? '١. استكشف وأضف المنتجات' : '1. Discover & Add to Bag',
      description: isAr
        ? 'تصفح تشكيلة منتجات العناية بالبشرة والجسم الأصلية 100%. اختر الحجم أو العبوة المناسبة وأضفها إلى حقيبة التسوق الخاصة بك.'
        : 'Explore our 100% certified authentic skincare and body care products. Pick your desired volume/variant and add items to your shopping bag.',
      badge: isAr ? 'الخطوة الأولى' : 'Step 1',
    },
    {
      step: '02',
      icon: <UserCheck className="size-6 text-primary-600 dark:text-primary-400" />,
      title: isAr ? '٢. الطلب كعضو أو كزائر (بدون حساب)' : '2. Order as Guest or Member',
      description: isAr
        ? 'يمكنك إتمام الطلب فوراً كزائر بدون الحاجة لإنشاء حساب أو تسجيل دخول، أو تسجيل الدخول لاستخدام بياناتك وعناوينك المحفوظة مسبقاً.'
        : 'Place your order seamlessly as a guest without any account required, or sign in to autofill your saved contact and delivery details.',
      badge: isAr ? 'مرونة تامة' : 'Flexible Checkout',
    },
    {
      step: '03',
      icon: <MapPin className="size-6 text-secondary" />,
      title: isAr ? '٣. بيانات التوصيل في مصر' : '3. Enter Egyptian Address',
      description: isAr
        ? 'أدخل اسمك ورقم هاتفك المصري (010, 011, 012, 015)، وحدد محافظتك (القاهرة، الجيزة، الإسكندرية وجميع المحافظات الـ27) والعنوان بالتفصيل.'
        : 'Provide your name, Egyptian mobile number (010, 011, 012, 015), and select your governorate across Egypt with your detailed street address.',
      badge: isAr ? 'تغطية لجميع المحافظات' : 'All 27 Governorates',
    },
    {
      step: '04',
      icon: <Banknote className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: isAr ? '٤. الدفع عند الاستلام' : '4. Cash on Delivery (COD)',
      description: isAr
        ? 'لا حاجة لبطاقات ائتمانية. اضغط على "تأكيد الطلب" وادفع نقداً لمندوب الشحن عند استلام طلبك ومراجعته على باب منزلك.'
        : 'No credit card needed. Click "Place Order" and pay comfortably in cash upon delivery right at your doorstep.',
      badge: isAr ? 'دفع آمن ومريح' : 'Safe & Convenient',
    },
  ]

  const accountComparison = [
    {
      icon: <UserX className="size-6 text-secondary" />,
      title: isAr ? 'الطلب كزائر (بدون تسجيل)' : 'Guest Checkout',
      subtitle: isAr ? 'طلب سريع بدون أي متطلبات مسبقة' : 'Fast ordering without signup',
      benefits: [
        isAr ? 'لا يشترط إنشاء حساب أو كلمة مرور' : 'No account creation or password needed',
        isAr ? 'فقط أدخل اسمك ورقم هاتفك وعنوانك' : 'Just enter your name, mobile & address',
        isAr ? 'استلام إشعار وتأكيد فوري للطلب' : 'Instant order confirmation with order ID',
      ],
    },
    {
      icon: <UserCheck className="size-6 text-primary-700 dark:text-primary-300" />,
      title: isAr ? 'الطلب كعضو مسجل' : 'Member Checkout',
      subtitle: isAr ? 'تجربة أسرع ومتابعة شاملة' : 'Faster experience & order tracking',
      benefits: [
        isAr ? 'تعبئة تلقائية للاسم ورقم الهاتف والعنوان' : 'Autofills your saved name, phone & address',
        isAr ? 'تتبع مسار وتحديثات طلباتك عبر صفحة الطلبات' : 'Track your order status step-by-step in Orders tab',
        isAr ? 'إعادة طلب المنتجات السابقة بضغطة زر واحدة' : 'One-click reorder from your order history',
      ],
    },
  ]

  const faqs = [
    {
      q: isAr ? 'هل يجب عليّ إنشاء حساب لإتمام الطلب؟' : 'Do I need to create an account to place an order?',
      a: isAr
        ? 'لا، يمكنك إتمام طلبك كزائر بكل سهولة بمجرد إدخال اسمك ورقم هاتفك وعنوان الشحن دون الحاجة للتسجيل.'
        : 'No, you can easily place an order as a guest. Simply enter your contact details and delivery address at checkout.',
    },
    {
      q: isAr ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are supported?',
      a: isAr
        ? 'ندعم حالياً الدفع عند الاستلام (Cash on Delivery) لجميع الطلبات داخل جمهورية مصر العربية.'
        : 'We currently support Cash on Delivery (COD) for all orders across Egypt.',
    },
    {
      q: isAr ? 'ما هي المدة المتوقعة لتوصيل الطلب؟' : 'What is the estimated delivery time?',
      a: isAr
        ? 'يستغرق التوصيل عادةً من 2 إلى 4 أيام عمل لمحافظات القاهرة والجيزة والإسكندرية، ومن 3 إلى 5 أيام عمل لباقي المحافظات.'
        : 'Delivery usually takes 2-4 business days for Cairo, Giza, and Alexandria, and 3-5 business days for other governorates.',
    },
    {
      q: isAr ? 'هل تشحنون لجميع المحافظات في مصر؟' : 'Do you ship to all governorates in Egypt?',
      a: isAr
        ? 'نعم، نغطي جميع محافظات جمهورية مصر العربية الـ 27 مع مندوبي توصيل محترفين.'
        : 'Yes, we deliver across all 27 governorates in Egypt with professional courier services.',
    },
    {
      q: isAr ? 'كيف يمكنني متابعة حالة طلبي بعد إتمامه؟' : 'How can I track my order after placing it?',
      a: isAr
        ? 'ستحصل فوراً على رقم الطلب (Order ID). وإذا كنت مسجلاً للدخول، ستتمكن من متابعة مراحله (قيد التجهيز، تم الشحن، تم التوصيل) مباشرة من صفحة "متابعة الطلبات".'
        : 'You will receive an Order ID immediately upon placing the order. If you are signed in, you can track its progress (Processing, Shipped, Delivered) in your "Orders" dashboard.',
    },
  ]

  const guarantees = [
    {
      icon: <ShieldCheck className="size-6 text-primary-600 dark:text-primary-400" />,
      title: isAr ? 'منتجات أصلية 100%' : '100% Authentic',
      desc: isAr ? 'تركيبات معتمدة ومرخصة بمعايير صيدلية دقيقة' : 'Certified pharmacy-grade skincare formulas',
    },
    {
      icon: <Truck className="size-6 text-secondary" />,
      title: isAr ? 'شحن سريع لجميع المحافظات' : 'Fast Egypt-Wide Delivery',
      desc: isAr ? 'تغليف عناية فائق وتوصيل حتى باب بيتك' : 'Carefully packaged and dispatched to your door',
    },
    {
      icon: <Banknote className="size-6 text-emerald-600 dark:text-emerald-400" />,
      title: isAr ? 'دفع عند الاستلام' : 'Cash on Delivery',
      desc: isAr ? 'استلم طلبك وافحصه أولاً ثم ادفع نقداً' : 'Inspect your parcel upon arrival then pay cash',
    },
    {
      icon: <PhoneCall className="size-6 text-secondary" />,
      title: isAr ? 'دعم عملاء متخصص' : 'Specialized Support',
      desc: isAr ? 'فريق جاهز للإجابة على استفساراتك' : 'Our beauty specialists are ready to help',
    },
  ]

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-14 space-y-12 md:space-y-16">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/30 px-4 py-1.5 text-xs font-semibold text-secondary dark:text-secondary-100 ring-1 ring-secondary/20">
          <Sparkles className="size-3.5" />
          <span>{isAr ? 'دليل الشراء السهل والمباشر' : 'Simple & Seamless Ordering Guide'}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {isAr ? 'كيفية الطلب من بيور' : 'How to Place an Order on Pure'}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          {isAr
            ? 'خطوات بسيطة وسريعة للحصول على منتجات العناية بالبشرة والجسم الأصلية حتى باب منزلك مع خيار الطلب كزائر والدفع عند الاستلام.'
            : 'Simple and quick steps to get authentic skincare and beauty products delivered to your door in Egypt, with guest checkout and cash on delivery.'}
        </p>
      </motion.div>

      {/* 4 Step Process Grid */}
      <div className="space-y-6">
        <div className="text-center md:text-start">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            {isAr ? 'خطوات الطلب (٤ خطوات بسيطة)' : 'Order Process (4 Easy Steps)'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? 'من الاختيار حتى استلام طلبك وتأكيده' : 'From selection to doorstep delivery'}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-xs hover:border-secondary/40 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/40 text-secondary">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-secondary/30 font-mono">
                    {item.step}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Guest vs Member Ordering Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl sm:rounded-3xl border border-secondary/20 bg-linear-to-b from-primary/20 via-primary/5 to-transparent p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6"
      >
        <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            {isAr ? 'الطلب متاح للجميع: زائر أو عضو' : 'Order Your Way: Guest or Member'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isAr
              ? 'صممنا تجربة الشراء في بيور لتمنحك كامل الحرية والسرعة في إتمام طلبك بالطريقة التي تفضلها.'
              : 'Pure is designed for maximum speed and flexibility, whether you want an instant guest checkout or saved account benefits.'}
          </p>
        </div>

        <div className="grid gap-3.5 sm:gap-6 md:grid-cols-2">
          {accountComparison.map((opt, i) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl border border-border/60 bg-card/90 p-3.5 sm:p-5 md:p-6 space-y-3 sm:space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary/40">
                  {opt.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">{opt.title}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">{opt.subtitle}</p>
                </div>
              </div>
              <ul className="space-y-2 sm:space-y-2.5 pt-2 border-t border-border/40">
                {opt.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90">
                    <CheckCircle2 className="size-3.5 sm:size-4 shrink-0 text-secondary mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trust & Guarantee Badges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guarantees.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-4.5 shadow-xs"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/30">
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs Section */}
      <div className="space-y-6">
        <div className="text-center md:text-start">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            {isAr ? 'الأسئلة الشائعة حول الطلب والتوصيل' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isAr ? 'كل ما تود معرفته عن الشحن والدفع ومتابعة الطلبات' : 'Everything you need to know about delivery and payment'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4.5 sm:p-5 text-start font-medium text-foreground hover:bg-muted/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'size-5 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180 text-secondary',
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-border/40 px-4.5 sm:px-5 pb-5 pt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Call to Action Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-secondary p-6 sm:p-8 text-secondary-foreground shadow-lg"
      >
        <div className="space-y-2 text-center sm:text-start">
          <h3 className="text-xl sm:text-2xl font-bold">
            {isAr ? 'جاهز لبدء رحلة التوهج والعناية؟' : 'Ready to start your glow routine?'}
          </h3>
          <p className="text-sm text-secondary-foreground/90 max-w-lg">
            {isAr
              ? 'تصفح الآن أفضل منتجات العناية بالبشرة والجسم واستمتع بطلب سريع ودفع مريح عند الاستلام.'
              : 'Explore our curated skincare and beauty collection now with fast delivery and cash on delivery.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={getLocalizedPath('/products', locale)}
            className={cn(
              buttonVariants({ variant: 'default', size: 'lg' }),
              'rounded-xl bg-white text-secondary-950 hover:bg-neutral font-semibold shadow-sm transition-transform hover:scale-105',
            )}
          >
            <span>{isAr ? 'تسوق المنتجات الآن' : 'Shop Products'}</span>
            <ArrowIcon className="size-4 ms-2" />
          </Link>
          <Link
            to={getLocalizedPath('/cart', locale)}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'rounded-xl border-white/40 bg-secondary/80 text-white hover:bg-white/10 font-semibold',
            )}
          >
            <ShoppingBag className="size-4 me-2" />
            <span>{isAr ? 'حقيبة التسوق' : 'View Bag'}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default HowToOrderPage
