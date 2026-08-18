import { useIntl } from 'react-intl'
import { Container } from '@/components/layout/Container'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { LogoLoop, type LogoItem } from '@/components/LogoLoop'
import { isLocale, LOCALE_DIR } from '@/i18n/locales'

const sponsorLogos: LogoItem[] = [
  { src: '/imgs/sponsers/ahmed-almaghribi.webp', alt: 'Ahmed Almaghribi' },
  { src: '/imgs/sponsers/al-ahli-club.webp', alt: 'Al Ahli Club' },
  { src: '/imgs/sponsers/alhadaya-center.webp', alt: 'Alhadaya Center' },
  { src: '/imgs/sponsers/alsaif-gallery.webp', alt: 'Alsaif Gallery' },
  { src: '/imgs/sponsers/alsorayai-group.webp', alt: 'Alsorayai Group' },
  { src: '/imgs/sponsers/alwafa.webp', alt: 'Alwafa' },
  { src: '/imgs/sponsers/b-laban.webp', alt: 'B Laban' },
  { src: '/imgs/sponsers/bayut.webp', alt: 'Bayut' },
  { src: '/imgs/sponsers/beauty-secrets.webp', alt: 'Beauty Secrets' },
  { src: '/imgs/sponsers/beesline.webp', alt: 'Beesline' },
  { src: '/imgs/sponsers/bin-shihon.webp', alt: 'Bin Shihon' },
  { src: '/imgs/sponsers/blooming.webp', alt: 'Blooming' },
  { src: '/imgs/sponsers/blue-green.webp', alt: 'Blue Green' },
  { src: '/imgs/sponsers/boqsha.webp', alt: 'Boqsha' },
  { src: '/imgs/sponsers/care-outlet.webp', alt: 'Care Outlet' },
  { src: '/imgs/sponsers/centrepoint.webp', alt: 'Centrepoint' },
  { src: '/imgs/sponsers/chuck-e-cheese.webp', alt: "Chuck E. Cheese" },
  { src: '/imgs/sponsers/circle-k.webp', alt: 'Circle K' },
  { src: '/imgs/sponsers/danube-properties.webp', alt: 'Danube Properties' },
  { src: '/imgs/sponsers/dune-london.webp', alt: 'Dune London' },
  { src: '/imgs/sponsers/enjaz.webp', alt: 'Enjaz' },
  { src: '/imgs/sponsers/faces.webp', alt: 'Faces' },
  { src: '/imgs/sponsers/fresh.webp', alt: 'Fresh' },
  { src: '/imgs/sponsers/gap.webp', alt: 'GAP' },
  { src: '/imgs/sponsers/hamadah-albaher.webp', alt: 'Hamadah Albaher' },
  { src: '/imgs/sponsers/honor.webp', alt: 'Honor' },
  { src: '/imgs/sponsers/ibraq.webp', alt: 'Ibraq' },
  { src: '/imgs/sponsers/max.webp', alt: 'Max' },
  { src: '/imgs/sponsers/mira-mart.webp', alt: 'Mira Mart' },
  { src: '/imgs/sponsers/nahdi.webp', alt: 'Nahdi' },
  { src: '/imgs/sponsers/nayomi.webp', alt: 'Nayomi' },
  { src: '/imgs/sponsers/okaz.webp', alt: 'Okaz' },
  { src: '/imgs/sponsers/promise.webp', alt: 'Promise' },
  { src: '/imgs/sponsers/qasr-alawani.webp', alt: 'Qasr Alawani' },
  { src: '/imgs/sponsers/redtag.webp', alt: 'Redtag' },
  { src: '/imgs/sponsers/sadan.webp', alt: 'Sadan' },
  { src: '/imgs/sponsers/samsung.webp', alt: 'Samsung' },
  { src: '/imgs/sponsers/sheglam.webp', alt: 'Sheglam' },
  { src: '/imgs/sponsers/shein.webp', alt: 'SHEIN' },
  { src: '/imgs/sponsers/skechers.webp', alt: 'Skechers' },
  { src: '/imgs/sponsers/splash.webp', alt: 'Splash' },
  { src: '/imgs/sponsers/the-body-shop.webp', alt: 'The Body Shop' },
  { src: '/imgs/sponsers/tim-hortons.png', alt: 'Tim Hortons' },
  { src: '/imgs/sponsers/trendyol.png', alt: 'Trendyol' },
  { src: '/imgs/sponsers/united-pharmacy.png', alt: 'United Pharmacy' },
  { src: '/imgs/sponsers/zahran.webp', alt: 'Zahran' },
]

export const SponsorsSection = () => {
  const { locale } = useIntl()
  const isRtl = isLocale(locale) ? LOCALE_DIR[locale] === 'rtl' : true

  return (
    <section className="overflow-hidden border-b border-primary-100 bg-white py-14">
      <Container>
        <SectionHeading kicker="sponsors.kicker" title="sponsors.title" />
      </Container>
      <div className="mt-10">
        <LogoLoop
          logos={sponsorLogos}
          speed={48}
          direction={isRtl ? 'right' : 'left'}
          logoHeight={88}
          gap={72}
          fadeOut
          fadeOutColor="#ffffff"
          scaleOnHover
          pauseOnHover
          ariaLabel="Sponsors"
        />
      </div>
    </section>
  )
}
