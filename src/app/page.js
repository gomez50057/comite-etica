import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import CampaignSpread from '@/components/home/CampaignTripleSpread';
import Carousel from '@/components/home/Carousel';
import Calendar from '@/components/home/Calendar';
import DualBanner from '@/components/home/DualBanner';

// import Announcement from '@/components/home/Announcement';
// import Chatbot from '@/components/chat/Chatbot';
// import IntroVideoModal from '../components/shared/IntroVideoModal';

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* <IntroVideoModal /> */}
      <Hero />
      <About />
      <CampaignSpread />
      <Carousel />
      <Calendar />
      <DualBanner />

      {/* <Chatbot /> */}
      {/* <Announcement /> */}
    </div>
  );
}
