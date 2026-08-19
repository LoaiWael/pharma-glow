import { FormattedMessage } from 'react-intl'
import {
  HomeBannerCarousel,
  HomeCategories,
  HomePromoTicker,
  HomeBadgeGrids,
  HomeCategoryGrids,
} from '@/features/home'

export const HomePage = () => {
  return (
    <>
      <h1 className="sr-only">
        <FormattedMessage id="brand.name" />
      </h1>
      <HomePromoTicker />
      <HomeBannerCarousel />
      <HomeCategories />
      <HomeBadgeGrids />
      <HomeCategoryGrids />
    </>
  )
}

