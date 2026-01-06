import { Link } from 'react-router-dom';
import { FaLock, FaEye, FaSync } from 'react-icons/fa';
import notex1 from '../assets/images/notex1.jfif';
import notex2 from '../assets/images/notex2.jfif';
import notex3 from '../assets/images/notex3.jfif';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="text-blue-500 text-2xl">📝</div>
          <span className="text-xl font-bold">NoteX</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-blue-400 transition">Features</a>
          <Link to="/login" className="hover:text-blue-400 transition">Log in</Link>
          <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-4">
              Your Thoughts.
              <br />
              <span className="text-blue-500">Organized.</span> Private.
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              The distraction-free space for your personal notes, ideas, and daily journals. 
              Encrypted for your eyes only.
            </p>
            <div className="flex gap-4 mb-4">
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition">
                Start Writing Now
              </Link>
              <a href="#features" className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-semibold transition">
                Learn More
              </a>
            </div>
            <p className="text-slate-400 text-sm">
              No credit card required. · Free plan available
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-8 shadow-2xl">
              <div className="h-48 rounded-lg mb-4 overflow-hidden">
                <img src={notex2} alt="NoteX Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-4">
                <div className="h-32 flex-1 rounded-lg overflow-hidden">
                  <img src={notex3} alt="NoteX Features" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-32 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-4xl">🌱</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="px-8 py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-semibold mb-2">CORE FEATURES</p>
            <h2 className="text-4xl font-bold mb-4">Experience True Focus</h2>
            <p className="text-slate-300 text-lg">
              Everything you need to capture your ideas without the clutter.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaLock className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy First</h3>
              <p className="text-slate-300">
                End-to-End Encryption ensures your notes are essentially invisible to everyone but you.
              </p>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaEye className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Focus Mode</h3>
              <p className="text-slate-300">
                A minimal interface designed to remove distractions and keep you in the flow of writing.
              </p>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-blue-500 transition">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaSync className="text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sync Everywhere</h3>
              <p className="text-slate-300">
                Seamlessly access your thoughts across desktop, tablet, and mobile devices in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Designed for Clarity Section */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Designed for clarity</h2>
              <p className="text-slate-300 text-lg mb-6">
                A sneak peek into your new distraction-free workspace. 
                Dark mode included by default to ease your eyes during late-night inspiration bursts.
              </p>
              <a href="#features" className="text-blue-400 hover:text-blue-300 font-semibold transition inline-flex items-center gap-2">
                See how it works →
              </a>
            </div>
            <div className="relative max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-2xl">
                <img 
                  src={notex1} 
                  alt="NoteX Dashboard Preview" 
                  className="w-full h-auto max-h-80 object-contain rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="text-blue-500 text-2xl">📝</div>
              <span className="text-xl font-bold">NoteManager</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition">Support</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center text-slate-400 text-sm">
            © 2024 NoteManager Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
