import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import TechPartners from "@/components/home/TechPartners";
import Categories from "@/components/home/Categories";
import ImmersiveShowcase from "@/components/home/ImmersiveShowcase";
import FlashSale from "@/components/home/FlashSale";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CommerceSections from "@/components/home/CommerceSections";
import BentoFeatures from "@/components/home/BentoFeatures";
import Testimonials from "@/components/home/Testimonials";
import VipClub from "@/components/home/VipClub";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    // ضفنا flex flex-col gap-32 عشان نفصل السكاشن عن بعض بشكل يخطف العين ويريحها
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500 selection:text-zinc-950 scroll-smooth flex flex-col gap-24 md:gap-40 pb-20">
      
      <Navbar />
      
      <Hero />
      
      <TechPartners />
      
      <Categories />
      
      <ImmersiveShowcase />
      
      <FlashSale />
      
      <BentoFeatures />
      
      <FeaturedProducts />
      
      <CommerceSections />
      
      <Testimonials />
      
      <VipClub />
      
      <div className="mt-20">
        <Footer />
      </div>

    </main>
  );
}
