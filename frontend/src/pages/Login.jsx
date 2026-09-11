import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, User, Users, ChevronLeft, Building2, MapIcon, 
  FileText, Activity, Database, AlertTriangle, CheckCircle2, Search, Download 
} from 'lucide-react';

// DYNAMIC CONTENT DICTIONARY
const paneContent = {
  default: {
    title: "Digitizing Land Records with High-Fidelity AI.",
    desc: "An end-to-end digitization pipeline utilizing Human-in-the-Loop verification and spatial GIS validation.",
    features: [
      { icon: <FileText className="w-6 h-6 text-yellow-500 mt-1" />, title: "AI OCR Extraction", desc: "Automated Khasra & Khatauni reading with confidence gating." },
      { icon: <MapIcon className="w-6 h-6 text-yellow-500 mt-1" />, title: "GIS Spatial Validation", desc: "Real-time cadastral boundary mapping to prevent disputes." }
    ]
  },
  admin: {
    title: "System Control & Telemetry",
    desc: "Monitor pipeline throughput, node health, and overall AI accuracy across state-wide jurisdictions in real-time.",
    features: [
      { icon: <Activity className="w-6 h-6 text-yellow-500 mt-1" />, title: "Live Analytics", desc: "Track digitization speed and geographic throughput." },
      { icon: <Database className="w-6 h-6 text-yellow-500 mt-1" />, title: "Database Integrity", desc: "Manage encrypted SQLite deployments and access logs." }
    ]
  },
  verifier: {
    title: "Human-in-the-Loop Dashboard",
    desc: "You are the final line of defense. Review flagged records and override low-confidence AI extractions to maintain 100% legal accuracy.",
    features: [
      { icon: <AlertTriangle className="w-6 h-6 text-yellow-500 mt-1" />, title: "Anomaly Resolution", desc: "Side-by-side comparison of physical docs vs extracted data." },
      { icon: <CheckCircle2 className="w-6 h-6 text-yellow-500 mt-1" />, title: "Secure Commits", desc: "Approve and push verified records to the master database." }
    ]
  },
  citizen: {
    title: "Public Land Record Portal",
    desc: "Access your digital Khasra and Khatauni securely using your government-linked identity. Transparency at your fingertips.",
    features: [
      { icon: <Search className="w-6 h-6 text-yellow-500 mt-1" />, title: "Instant Search", desc: "Find your registered property using Khasra or owner name." },
      { icon: <Download className="w-6 h-6 text-yellow-500 mt-1" />, title: "Digital Downloads", desc: "Get legally valid, digitally signed copies instantly." }
    ]
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState('select'); 
  const [selectedRole, setSelectedRole] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setView('login');
    
    // Developer convenience
    if (role === 'admin') setEmail('admin@gov.in');
    else if (role === 'verifier') setEmail('verifier@gov.in');
    else setEmail('');
    setPassword('password'); 
  };

  const handleBackToRoles = () => {
    setView('select');
    setSelectedRole(null); // Resets the left pane to default text
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('auth_token', 'mock_jwt_token_123');
    navigate('/dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Citizen registration submitted!");
    setView('login');
  };

  const springTransition = { type: "spring", stiffness: 80, damping: 20 };
  
  // Get active text content
  const activeContent = paneContent[selectedRole || 'default'];

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${view !== 'select' ? 'lg:flex-row-reverse' : ''} bg-stone-100 font-sans overflow-hidden`}>
      
      {/* BRANDING PANE */}
      <motion.div 
        layout 
        transition={springTransition}
        className="hidden lg:flex lg:w-1/2 bg-[#3E2723] text-white flex-col justify-between p-12 relative overflow-hidden z-10 shadow-2xl"
      >
        {/* INFINITE ANIMATION BLOBS (GPU Accelerated) */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
        />

        <div className="relative z-10">
          {/* Logo with infinite gentle float */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex items-center space-x-3 mb-12"
          >
            <ShieldCheck className="w-10 h-10 text-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-white">Bhumi-AI</h1>
              <p className="text-[10px] text-yellow-500 uppercase tracking-widest font-semibold">Govt. Prototype</p>
            </div>
          </motion.div>

          {/* DYNAMIC TEXT CROSSFADE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole || 'default'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-4xl font-bold leading-tight mb-6">
                {activeContent.title}
              </h2>
              <p className="text-stone-300 text-lg max-w-md mb-10">
                {activeContent.desc}
              </p>

              <div className="space-y-6">
                {activeContent.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    {feature.icon}
                    <div>
                      <h4 className="font-bold text-stone-100">{feature.title}</h4>
                      <p className="text-sm text-stone-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 text-xs text-stone-500 font-medium mt-12">
          &copy; 2026 Smart India Hackathon Submission
        </div>
      </motion.div>

      {/* FORM PANE (Remains exactly the same dynamically changing forms) */}
      <motion.div 
        layout 
        transition={springTransition}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative z-0"
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: Role Selection */}
            {view === 'select' && (
              <motion.div 
                key="select"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight">Enter Portal</h2>
                  <p className="text-stone-500 mt-2 text-sm">Select your authorization level to continue.</p>
                </div>

                <div className="space-y-3">
                  <button onClick={() => handleRoleSelect('admin')} className="w-full flex items-center p-4 border-2 border-stone-200 rounded-lg hover:border-stone-800 hover:bg-stone-50 transition-all group">
                    <div className="bg-stone-100 p-3 rounded-md group-hover:bg-stone-800 group-hover:text-white transition-colors"><Building2 className="w-6 h-6" /></div>
                    <div className="ml-4 text-left">
                      <h3 className="font-bold text-stone-900">System Admin</h3>
                      <p className="text-xs text-stone-500">Full access & telemetry</p>
                    </div>
                  </button>
                  <button onClick={() => handleRoleSelect('verifier')} className="w-full flex items-center p-4 border-2 border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all group">
                    <div className="bg-stone-100 p-3 rounded-md group-hover:bg-amber-500 group-hover:text-white transition-colors"><ShieldCheck className="w-6 h-6" /></div>
                    <div className="ml-4 text-left">
                      <h3 className="font-bold text-stone-900">Verifier Officer</h3>
                      <p className="text-xs text-stone-500">Human-in-the-loop dashboard</p>
                    </div>
                  </button>
                  <button onClick={() => handleRoleSelect('citizen')} className="w-full flex items-center p-4 border-2 border-stone-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all group">
                    <div className="bg-stone-100 p-3 rounded-md group-hover:bg-green-600 group-hover:text-white transition-colors"><Users className="w-6 h-6" /></div>
                    <div className="ml-4 text-left">
                      <h3 className="font-bold text-stone-900">Citizen</h3>
                      <p className="text-xs text-stone-500">Public records & requests</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: Login Form */}
            {view === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={handleBackToRoles} className="flex items-center text-sm font-semibold text-stone-500 hover:text-stone-900 mb-8 transition-colors">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to Roles
                </button>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight capitalize">{selectedRole} Login</h2>
                  <p className="text-stone-500 mt-2 text-sm">Enter your credentials to access the portal.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm" required />
                  </div>
                  <button type="submit" className={`w-full py-3 rounded-md font-bold text-white shadow-md transition-all ${selectedRole === 'citizen' ? 'bg-green-600 hover:bg-green-700' : selectedRole === 'verifier' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-900 hover:bg-stone-800'}`}>
                    Sign In
                  </button>
                </form>
                {selectedRole === 'citizen' && (
                  <div className="mt-8 text-center border-t border-stone-200 pt-6">
                    <p className="text-sm text-stone-600">Don't have an account? <button onClick={() => setView('register')} className="font-bold text-green-600 hover:text-green-700 underline">Register Now</button></p>
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 3: Citizen Registration */}
            {view === 'register' && (
              <motion.div 
                key="register"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <button onClick={() => setView('login')} className="flex items-center text-sm font-semibold text-stone-500 hover:text-stone-900 mb-6 transition-colors">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to Login
                </button>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Citizen Registration</h2>
                  <p className="text-stone-500 mt-1 text-sm">Verify your identity to access public land records.</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Full Name</label>
                      <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Mobile</label>
                      <input type="tel" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Aadhar Card</label>
                    <input type="text" placeholder="XXXX XXXX XXXX" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm font-mono tracking-widest" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Email ID</label>
                    <input type="email" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wide mb-1">Address</label>
                    <textarea rows="2" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-1 focus:ring-green-500 outline-none text-sm resize-none" required></textarea>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-green-600 hover:bg-green-700 rounded-md font-bold text-white shadow-md transition-all mt-2">Complete Registration</button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}