import { Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';

export default function Home() {
  const [animateIn, setAnimateIn] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { 
      title: 'Academic Analysis', 
      description: 'Evaluate study habits, exam pressure, and academic performance',
      icon: 'brain'
    },
    { 
      title: 'Financial Assessment', 
      description: 'Analyze financial stress factors and economic concerns',
      icon: 'chart'
    },
    { 
      title: 'Psychological Evaluation', 
      description: 'Assess mental well-being and emotional patterns',
      icon: 'shield'
    },
    { 
      title: 'AI-Powered Insights', 
      description: 'Get personalized recommendations based on ML analysis',
      icon: 'target'
    }
  ];

  // Generate particles dengan useMemo agar tidak re-render terus
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.15 + 0.05,
    }));
  }, []);

  useEffect(() => {
    setAnimateIn(true);
    
    // Rotate features
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => {
      clearInterval(featureInterval);
    };
  }, [features.length]);

  // SVG Icons
  const IconBrain = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const IconChart = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const IconShield = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const IconTarget = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10a6 6 0 110-12 6 6 0 010 12z" />
    </svg>
  );

  const IconArrowRight = () => (
    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );

  const IconSparkle = () => (
    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 4.343a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM17 10a1 1 0 10-2 0v1a1 1 0 102 0v-1zM4.343 15.657a1 1 0 001.414 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 000 1.414zM8 17a1 1 0 10-2 0v1a1 1 0 102 0v-1zM4 10a1 1 0 10-2 0v1a1 1 0 102 0v-1z" />
    </svg>
  );

  const IconCheck = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'brain': return <IconBrain />;
      case 'chart': return <IconChart />;
      case 'shield': return <IconShield />;
      case 'target': return <IconTarget />;
      default: return <IconBrain />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/30 to-blue-50/30">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl animate-pulse" 
             style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-blue-200/20 blur-3xl animate-pulse"
             style={{ animationDuration: '12s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-stone-300/10 blur-3xl animate-pulse"
             style={{ animationDuration: '14s', animationDelay: '4s' }} />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-amber-700/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        
        <div className={`w-full max-w-4xl mx-auto transition-all duration-1000 transform ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-stone-300/50 shadow-sm mb-8 animate-fade-in">
              <IconSparkle />
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-widest">
                AI-Powered Mental Health Platform
              </span>
              <IconSparkle />
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight">
              <span className="text-stone-800 block sm:inline">Student </span>
              <span className="bg-gradient-to-r from-amber-700 via-stone-600 to-blue-700 bg-clip-text text-transparent">
                Stress Predictor
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4">
              An intelligent <span className="font-semibold text-stone-800">Machine Learning</span> platform designed to 
              analyze and detect student stress levels through comprehensive evaluation
            </p>
            <p className="text-stone-500 text-sm sm:text-base max-w-xl mx-auto">
              Combining academic, financial, and psychological factors for accurate insights
            </p>
          </div>

          {/* Features Carousel - Enhanced */}
          <div className="mb-16">
            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-stone-200/60 shadow-2xl shadow-stone-200/50 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full -ml-20 -mb-20" />
              
              <div className="relative p-8 sm:p-10 lg:p-12">
                {/* Icon Container */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 bg-gradient-to-br from-amber-600 to-blue-600">
                      <div className="text-white transition-all duration-300 transform">
                        {getIcon(features[currentFeature].icon)}
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/20 to-blue-400/20 blur-xl -z-10" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-4 transition-all duration-300">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto transition-all duration-300">
                    {features[currentFeature].description}
                  </p>
                </div>
                
                {/* Progress Dots */}
                <div className="flex justify-center items-center gap-3">
                  {features.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentFeature(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        currentFeature === idx 
                          ? 'w-10 h-2.5 bg-gradient-to-r from-amber-600 to-blue-600 shadow-md' 
                          : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                      }`}
                      aria-label={`View feature ${idx + 1}: ${features[idx].title}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link 
              to="/predict" 
              className="group inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl text-white font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 bg-gradient-to-r from-amber-700 via-stone-600 to-blue-700 bg-size-200 hover:bg-right-bottom"
              style={{ backgroundSize: '200% 100%', transition: 'all 0.3s ease' }}
            >
              <span>Start Your Assessment</span>
              <IconArrowRight />
            </Link>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
              <div className="flex items-center gap-2 text-stone-500">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <IconCheck />
                </div>
                <span className="text-sm">Secure & Confidential</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <IconCheck />
                </div>
                <span className="text-sm">Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <IconCheck />
                </div>
                <span className="text-sm">Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-15px) translateX(10px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(-20px) translateX(5px);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .bg-size-200 {
          background-size: 200% 100%;
        }
        
        .hover\\:bg-right-bottom:hover {
          background-position: right bottom;
        }
      `}</style>
    </div>
  );
} 