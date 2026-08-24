export interface EgyptGovernorate {
  id: string
  nameEn: string
  nameAr: string
}

export const EGYPT_COUNTRY_CODE = 'EG' as const

export const EGYPT_GOVERNORATES: EgyptGovernorate[] = [
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة' },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة' },
  { id: 'alexandria', nameEn: 'Alexandria', nameAr: 'الإسكندرية' },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية' },
  { id: 'dakahlia', nameEn: 'Dakahlia', nameAr: 'الدقهلية' },
  { id: 'sharqia', nameEn: 'Sharqia', nameAr: 'الشرقية' },
  { id: 'gharbia', nameEn: 'Gharbia', nameAr: 'الغربية' },
  { id: 'monufia', nameEn: 'Monufia', nameAr: 'المنوفية' },
  { id: 'beheira', nameEn: 'Beheira', nameAr: 'البحيرة' },
  { id: 'kafr-el-sheikh', nameEn: 'Kafr El Sheikh', nameAr: 'كفر الشيخ' },
  { id: 'damietta', nameEn: 'Damietta', nameAr: 'دمياط' },
  { id: 'port-said', nameEn: 'Port Said', nameAr: 'بورسعيد' },
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية' },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس' },
  { id: 'fayoum', nameEn: 'Fayoum', nameAr: 'الفيوم' },
  { id: 'beni-suef', nameEn: 'Beni Suef', nameAr: 'بني سويف' },
  { id: 'minya', nameEn: 'Minya', nameAr: 'المنيا' },
  { id: 'asyut', nameEn: 'Asyut', nameAr: 'أسيوط' },
  { id: 'sohag', nameEn: 'Sohag', nameAr: 'سوهاج' },
  { id: 'qena', nameEn: 'Qena', nameAr: 'قنا' },
  { id: 'luxor', nameEn: 'Luxor', nameAr: 'الأقصر' },
  { id: 'aswan', nameEn: 'Aswan', nameAr: 'أسوان' },
  { id: 'red-sea', nameEn: 'Red Sea', nameAr: 'البحر الأحمر' },
  { id: 'new-valley', nameEn: 'New Valley', nameAr: 'الوادي الجديد' },
  { id: 'matrouh', nameEn: 'Matrouh', nameAr: 'مطروح' },
  { id: 'north-sinai', nameEn: 'North Sinai', nameAr: 'شمال سيناء' },
  { id: 'south-sinai', nameEn: 'South Sinai', nameAr: 'جنوب سيناء' },
]
