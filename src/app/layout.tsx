export const metadata = {
  title: {
    default: 'Alpha Store - Premium Commerce',
    template: '%s | Alpha Store',
  },
  description: 'Database-driven commerce platform with products, checkout, accounts, admin dashboard, and CMS.',
  openGraph: {
    title: 'Alpha Store',
    description: 'Premium scalable e-commerce storefront.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alpha Store',
    description: 'Premium scalable e-commerce storefront.',
  },
}
import { AppProvider } from '@/context/AppContext';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/search/SearchModal';
import OfflineBanner from '@/components/layout/OfflineBanner';
import "@/app/globals.css"; // أو مسار الـ css عندك

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ضفنا className="scroll-smooth" هنا وده هيعمل نفس التأثير بـ CSS بس وبدون أخطاء
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body>
        {/* تغليف الموقع بالكامل بالعقل المفكر */}
        <AppProvider>
          
          {children}

          {/* استدعاء الشاشات المنبثقة العالمية */}
          <CartDrawer />
          <SearchModal />
          <OfflineBanner />
          
        </AppProvider>
      </body>
    </html>
  );
}
