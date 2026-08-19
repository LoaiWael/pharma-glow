import { FormattedMessage } from 'react-intl'
import {
  HomeBannerCarousel,
  HomeCategories,
  HomeBadgeGrids,
  HomeCategoryGrids,
} from '@/features/home'
import { HomeReviewsSection } from '@/features/reviews'

export const HomePage = () => {
  return (
    <>
      <h1 className="sr-only">
        <FormattedMessage id="brand.name" />
      </h1>
      <HomeBannerCarousel />
      <HomeCategories />
      <HomeBadgeGrids />
      <HomeCategoryGrids />
      <HomeReviewsSection />
    </>
  )
}



