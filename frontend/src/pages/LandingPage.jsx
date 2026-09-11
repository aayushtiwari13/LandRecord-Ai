import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Landmark, ArrowRight, ShieldCheck, FileSearch, Database, CheckCircle, Languages, Map } from "lucide-react";

export default function LandingPage() {
  // Scroll Parallax Hooks
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 1000], [0, 300]);
  const blob2Y = useTransform(scrollY, [0, 1000], [0, -250]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Spring Transitions
  const springTransition = { type: "spring", stiffness: 100, damping: 20 };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: springTransition }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-orange-50/80 font-sans text-[#3E2723] overflow-hidden selection:bg-orange-200 selection:text-orange-900">
      
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ y: blob1Y }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-300/40 rounded-full mix-blend-multiply filter blur-[100px]"
        />
        <motion.div 
          style={{ y: blob2Y }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-[120px]"
        />
      </div>

      {/* SECTION 1: Hero */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 z-10">
        <motion.div 
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="text-center max-w-4xl mt-12 w-full"
        >
         {/* Official Stamp Logo Animation */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1 }}
          className="flex justify-center mb-8"
        >
          {/* Outer Brown Circle */}
          <div className="relative w-28 h-28 bg-[#3E2723] rounded-full flex items-center justify-center shadow-2xl shadow-orange-900/30 border-4 border-white/40 backdrop-blur-sm">
            
            {/* Inner Dashed Yellow Line */}
            <div className="absolute inset-2 rounded-full border-[3px] border-dashed border-yellow-500/80"></div>
            
            {/* Center Icon */}
            <ShieldCheck className="w-12 h-12 text-yellow-400 relative z-10" strokeWidth={2} />
            
          </div>
        </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6">
              LANDRECORD <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-500">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#5D4037] font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Intelligent Land Record Digitization & Validation System.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-14">
            <div className="flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-orange-200/50 text-sm font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 mr-2 text-green-600" /> End-to-End Encryption
            </div>
            <div className="flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-orange-200/50 text-sm font-semibold tracking-wide">
              <FileSearch className="w-4 h-4 mr-2 text-blue-600" /> Smart OCR Engine
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Link to="/login" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-[#3E2723] rounded-full overflow-hidden shadow-[0_20px_40px_-15px_rgba(62,39,35,0.5)] transition-all hover:shadow-[0_20px_40px_-10px_rgba(62,39,35,0.7)] hover:-translate-y-1">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
              <span className="relative flex items-center text-lg tracking-wide">
                Enter Officer Portal
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>           
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: Workflow */}
      <section className="py-32 bg-white/60 backdrop-blur-3xl border-t border-white/40 relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Digitization Pipeline</h2>
            <p className="text-lg text-[#5D4037] max-w-2xl mx-auto">Transforming legacy physical records into verified digital assets with human-in-the-loop AI.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[2px] bg-gradient-to-r from-orange-100 via-orange-300 to-orange-100 -translate-y-1/2 -z-10 opacity-50"></div>
            
            {[
              { step: "01", title: "Ingestion", desc: "Upload scanned legacy maps and handwritten cadastral records.", icon: <FileSearch className="w-7 h-7" /> },
              { step: "02", title: "Extraction", desc: "Spatial OCR isolates Khasra, Khata, and ownership parameters.", icon: <Database className="w-7 h-7" /> },
              { step: "03", title: "Validation", desc: "Algorithmic cross-referencing against the central DILRMP database.", icon: <ShieldCheck className="w-7 h-7" /> },
              { step: "04", title: "Verification", desc: "Low-confidence anomalies are flagged for manual Revenue Officer review.", icon: <CheckCircle className="w-7 h-7" /> }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp} 
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white/80 p-8 rounded-3xl border border-orange-100/50 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-shadow relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 text-8xl font-black text-orange-50 opacity-50 group-hover:text-orange-100 transition-colors duration-500 z-0 pointer-events-none">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#3E2723]">{item.title}</h3>
                  <p className="text-sm text-[#5D4037] leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Features */}
      <section className="py-32 bg-[#2D1B15] text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-50 tracking-tight">System Architecture</h2>
            <p className="text-lg text-[#BCAAA4] max-w-2xl mx-auto">Engineered for scale, security, and precision across state jurisdictions.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Native Multilingual AI", desc: "Context-aware processing of Hindi, English, and regional state dialects without third-party translation overhead.", icon: <Languages className="w-8 h-8 text-yellow-500" /> },
              { title: "Spatial GIS Integration", desc: "Automated vectorization of boundary maps and direct integration with OpenLayers and PostGIS architectures.", icon: <Map className="w-8 h-8 text-yellow-500" /> },
              { title: "Granular Confidence Scoring", desc: "Every extracted entity receives a deterministic reliability score, optimizing the human-in-the-loop workload.", icon: <CheckCircle className="w-8 h-8 text-yellow-500" /> }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeUp} 
                whileHover={{ scale: 1.02 }}
                className="bg-[#3E2723]/50 p-10 rounded-3xl border border-[#5D4037] hover:border-orange-500/50 hover:bg-[#3E2723] transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-orange-50">{feature.title}</h3>
                <p className="text-[15px] text-[#A1887F] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}