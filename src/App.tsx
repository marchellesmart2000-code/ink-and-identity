import { AdminLayout } from "@/admin/AdminLayout";
import { DashboardPage } from "@/admin/DashboardPage";
import { LoginPage } from "@/admin/LoginPage";
import { CategoriesAdminPage } from "@/admin/CategoriesAdmin";
import { FeaturedAdminPage } from "@/admin/FeaturedAdmin";
import { ProductEditorPage, ProductsAdminPage } from "@/admin/ProductsAdmin";
import {
  ServicesAdminPage,
  SocialAdminPage,
  TestimonialsAdminPage,
} from "@/admin/ContentAdmin";
import { SettingsAdminPage } from "@/admin/SettingsAdmin";
import { UsersAdminPage } from "@/admin/UsersAdmin";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToastProvider } from "@/components/ui/Toast";
import { AboutPage } from "@/pages/AboutPage";
import { CollectionPage } from "@/pages/CollectionPage";
import { ContactPage } from "@/pages/ContactPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage, PrivacyPage, TermsPage } from "@/pages/LegalPages";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { QuotePage } from "@/pages/QuotePage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { ShopPage } from "@/pages/ShopPage";
import { HelmetProvider } from "react-helmet-async";
import { Navigate, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/category/:slug" element={<CategoryPage />} />
            <Route path="/shop/:slug" element={<ProductDetailPage />} />
            <Route path="/collections/:slug" element={<CollectionPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="featured" element={<FeaturedAdminPage />} />
            <Route path="products/:id" element={<ProductEditorPage />} />
            <Route path="services" element={<ServicesAdminPage />} />
            <Route path="social" element={<SocialAdminPage />} />
            <Route path="testimonials" element={<TestimonialsAdminPage />} />
            <Route path="settings" element={<SettingsAdminPage />} />
            <Route path="users" element={<UsersAdminPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </HelmetProvider>
  );
}
