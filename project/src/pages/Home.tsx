import React from 'react';
import TopNavbar from '../components/TopNavbar';
import MainNavbar from '../components/MainNavbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <MainNavbar />
      <Hero />
      
      {/* News & Events Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest News & Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img 
                  src={`https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`} 
                  alt="News" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-red-600 text-sm font-semibold mb-2">June 15, 2025</div>
                  <h3 className="text-xl font-bold mb-3">E-JUST Hosts International Conference on Renewable Energy</h3>
                  <p className="text-gray-600 mb-4">Leading researchers from around the world gathered to discuss the latest advancements in renewable energy technologies.</p>
                  <a href="#" className="text-red-600 font-medium hover:underline">Read More</a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#" className="inline-block bg-white border border-red-600 text-red-600 px-6 py-2 rounded-full font-medium hover:bg-red-600 hover:text-white transition-colors duration-200">
              View All News & Events
            </a>
          </div>
        </div>
      </section>
      
      {/* Academic Programs */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Academic Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Engineering', count: '12 Programs' },
              { name: 'Basic Sciences', count: '8 Programs' },
              { name: 'Computer Science', count: '6 Programs' },
              { name: 'International Business', count: '4 Programs' },
              { name: 'Environmental Studies', count: '5 Programs' },
              { name: 'Innovation & Entrepreneurship', count: '3 Programs' }
            ].map((program) => (
              <div key={program.name} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-red-500 transition-all duration-300">
                <h3 className="text-xl font-bold mb-2">{program.name}</h3>
                <p className="text-gray-600 mb-4">{program.count}</p>
                <a href="#" className="text-red-600 font-medium hover:underline">Explore Programs</a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-4 bg-red-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '5000+', label: 'Students' },
              { number: '200+', label: 'Faculty Members' },
              { number: '50+', label: 'Research Centers' },
              { number: '90+', label: 'International Partners' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Home;