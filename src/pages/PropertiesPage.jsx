import React from 'react';
import Header from '../components/global/Header';

const PropertiesPage = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Properties</h1>
          <p className="text-lg text-gray-700">Explore our exclusive property listings.</p>
        </section>
      </main>
    </div>
  );
};

export default PropertiesPage;
