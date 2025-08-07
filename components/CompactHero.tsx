import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CompactHero = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden my-8 shadow-lg border border-white/10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      />
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-dark-200/50 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 md:p-12 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Find Your Next Tutoring Opportunity
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mb-6">
          Browse our curated list of jobs and connect with students who need your expertise.
        </p>
        <Button
          asChild
          className="bg-accent-500 text-dark-100 font-bold rounded-full shadow-lg hover:bg-accent-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Link href="/jobs">Explore All Jobs</Link>
        </Button>
      </div>
    </div>
  );
};

export default CompactHero;
