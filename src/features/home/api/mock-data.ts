import type { HomeBanner, HomeCategory } from "../types";

export const HOME_BANNERS: HomeBanner[] = [
  {
    id: "new-arrivals",
    imageSrc: "/imgs/mockup/1.webp",
    imageAltKey: "home.banner.1.alt",
    titleKey: "home.banner.1.title",
    subtitleKey: "home.banner.1.subtitle",
    ctaKey: "home.banner.shopNow",
    href: "/products",
  },
  {
    id: "offers",
    imageSrc: "/imgs/mockup/2.webp",
    imageAltKey: "home.banner.2.alt",
    titleKey: "home.banner.2.title",
    subtitleKey: "home.banner.2.subtitle",
    ctaKey: "home.banner.shopNow",
    href: "/offers",
  },
  {
    id: "gold-care",
    imageSrc: "/imgs/mockup/3.webp",
    imageAltKey: "home.banner.3.alt",
    titleKey: "home.banner.3.title",
    subtitleKey: "home.banner.3.subtitle",
    ctaKey: "home.banner.shopNow",
    href: "/skincare",
  },
];

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "skincare",
    titleKey: "category.skincare.title",
    descriptionKey: "category.skincare.description",
    imageSrc: "/imgs/mockup/3.webp",
    href: "/skincare",
  },
  {
    id: "bodycare",
    titleKey: "category.bodycare.title",
    descriptionKey: "category.bodycare.description",
    imageSrc: "/imgs/mockup/1.webp",
    href: "/bodycare",
  },
  {
    id: "offers",
    titleKey: "category.offers.title",
    imageSrc: "/imgs/mockup/2.webp",
    href: "/offers",
  },
  {
    id: "products",
    titleKey: "category.products.title",
    imageSrc: "/imgs/mockup/1.webp",
    href: "/products",
  },
  {
    id: "new-arrivals",
    titleKey: "category.newArrivals.title",
    imageSrc: "/imgs/mockup/2.webp",
    href: "/products",
  },
  {
    id: "makeup",
    titleKey: "category.makeup.title",
    imageSrc: "/imgs/mockup/3.webp",
    href: "/products",
  },
  {
    id: "haircare",
    titleKey: "category.haircare.title",
    imageSrc: "/imgs/mockup/1.webp",
    href: "/products",
  },
  {
    id: "reviews",
    titleKey: "category.reviews.title",
    imageSrc: "/imgs/mockup/3.webp",
    href: "/reviews",
  },
];
