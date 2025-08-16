'use client';

import Pricing from '@/components/Pricing';

const page = () => {
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-8">
        Choose Your Plan
      </h1>
      <Pricing />
    </main>
  );
};

export default page;