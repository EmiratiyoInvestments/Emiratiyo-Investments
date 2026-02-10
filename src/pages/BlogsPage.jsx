import React from 'react';
import Header from '../components/global/Header';

const BlogsPage = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-gray-700">Read our latest insights and updates.</p>
        </section>
      </main>
    </div>
  );
};

export default BlogsPage;
