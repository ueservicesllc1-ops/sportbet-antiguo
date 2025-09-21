
import { Header } from '@/components/layout/header';
import { MainNav } from '@/components/layout/main-nav';
import { PromotionsCarousel } from '@/components/promotions-carousel';
import { SportsSidebar } from '@/components/sports-sidebar';
import { Sportsbook } from '@/components/sportsbook';
import { BetSlip } from '@/components/bet-slip';
import { BetSlipProvider } from '@/contexts/bet-slip-context';
import { Footer } from '@/components/layout/footer';
import { SecondaryNav } from '@/components/layout/secondary-nav';
import { FeaturedMatches } from '@/components/featured-matches';
// TestUploadForm import removed
import { SimpleUploader } from '@/components/simple-uploader'; // Import the new component

export default function Home() {
  return (
    <BetSlipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <MainNav />
        <SecondaryNav />
        <div className="w-full flex-1 px-4 md:px-6">
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
            {/* Left Sidebar */}
            <aside className="sticky top-20 hidden lg:col-span-1 lg:block">
                <SportsSidebar />
            </aside>
            
            {/* Main Content */}
            <main className="col-span-1 py-4 lg:col-span-3">
              <div className='space-y-4'>
                <PromotionsCarousel />

                {/* +++ Simple Uploader (if you want to keep it) +++ */}
                <div className="my-8 p-4 border rounded-lg">
                  <SimpleUploader />
                </div>
                {/* +++ End Simple Uploader +++ */}
                
                {/* --- The old test form has been removed --- */}

                <FeaturedMatches />
                <Sportsbook />
              </div>
            </main>

            {/* Right Sidebar - Sticky */}
            <aside className="sticky top-20 hidden lg:col-span-1 lg:block">
                <BetSlip />
            </aside>
          </div>
        </div>
        <Footer />
      </div>
    </BetSlipProvider>
  );
}
