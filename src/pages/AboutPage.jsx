import React from 'react';
import Header from '../components/global/Header';

const AboutPage = () => {
    return (
        <div>
            <Header />
            <main className="min-h-screen">
                <section className="max-w-6xl mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold mb-4">About Us</h1>
                    <p className="text-lg text-gray-700">Learn more about EMIRATIYO and our mission.</p>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;
