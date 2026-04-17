import { useState, useEffect, FormEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronDown, 
  Clock, 
  Users, 
  Video, 
  Globe, 
  Zap, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  Laptop, 
  Smartphone, 
  Star,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  AlertCircle,
  TrendingDown,
  Gift,
  Award,
  XCircle
} from 'lucide-react';

// --- Types ---
interface FaqItemProps {
  question: string;
  answer: string;
}

// --- Components ---

const SectionBadge = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: false }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="inline-flex items-center bg-brand-blue-navy/60 border border-brand-gold/30 rounded-full px-6 py-2 mb-8 shadow-lg shadow-brand-gold/5"
  >
    <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-brand-gold-light font-bold">
      {children}
    </span>
  </motion.div>
);

const SkillsTicker = () => {
  const skills = [
    "Build Websites with AI",
    "Create Professional Videos Without Camera",
    "Build & Sell Digital Products",
    "Automate Business Systems"
  ];
  
  const tickerItems = [...skills, ...skills, ...skills, ...skills];

  return (
    <>
      {/* Academy Logo Header */}
      <div style={{ 
        padding: '20px 5%', 
        display: 'flex', 
        justifyContent: 'flex-start', 
        background: 'transparent',
        position: 'relative',
        zIndex: 20 
      }}>
        <img 
          src="/LOGO.png" 
          alt="Caramel Digital Academy" 
          style={{ height: '50px', width: 'auto' }} 
        />
      </div>

      <div className="skills-ticker">
        <div className="ticker-content">
          {tickerItems.map((skill, i) => (
            <div key={i} className="flex items-center">
              <div className="ticker-item">{skill}</div>
              <div className="ticker-dot" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-blue-navy/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-brand-blue-navy border border-brand-gold/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        >
          <h3 className="font-serif text-2xl font-bold text-brand-gold-light mb-6">Terms & Conditions</h3>
          <div className="space-y-4 text-brand-off-white/90 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <p>BY SUBMITTING THIS FORM AND DOWNLOADING OUR FREE AI STARTER KIT, You agree to the following terms:</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>To receive relevant AI business tips and updates via your WhatsApp DM in the future.</li>
              <li>That the templates will be used for your personal or internal business purposes only, not to be re shared commercially, redistribute or resell.</li>
              <li>We may revoke access if you violate these terms.</li>
            </ol>
            <p className="pt-4 border-t border-brand-gold/10 font-medium">
              THE PROFESSIONAL'S AI STARTER KIT is exclusively intellectual property of CARAMEL DIGITALS and is protected under copyright law.
              <br />
              © COPYRIGHT 2026 Caramel Digitals. ALL RIGHTS RESERVED.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-8 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold-light font-bold py-3 rounded-xl hover:bg-brand-gold/20 transition-all"
          >
            I UNDERSTAND & AGREE
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-brand-gold/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group transition-all"
      >
        <span className="text-brand-off-white font-medium group-hover:text-brand-gold-light transition-colors">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-brand-off-white/90 text-base leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface WaitlistFormProps {
  idPrefix: string;
  isSubmitted: boolean;
  isSubmitting: boolean;
  setIsTermsOpen: (open: boolean) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const WaitlistForm = ({ idPrefix, isSubmitted, isSubmitting, setIsTermsOpen, handleSubmit }: WaitlistFormProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: false }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="max-w-md mx-auto"
  >
    {!isSubmitted ? (
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="zq" value="41213" />
        <input type="hidden" name="fid" value="5f66a80141213" />
        <input type="hidden" name="pid" value="" />
        <input type="hidden" name="bumppid" value="0" />
        <input type="hidden" name="cid" value="" />
        <input type="hidden" name="usp" value="0" />
        <input type="hidden" name="grk" value="" />
        <input type="hidden" name="pvar" value="" />
        <input type="hidden" name="submit" value="JOIN THE WAITLIST NOW" />

        <div className="space-y-4">
          <div className="relative group">
            <input 
              required
              name="name"
              type="text" 
              placeholder="Your First Name (e.g John) *" 
              className="w-full bg-brand-blue-navy/40 border border-brand-gold/20 rounded-xl px-5 py-4 text-brand-off-white placeholder:text-brand-off-white/50 outline-none focus:border-brand-gold/50 focus:bg-brand-blue-navy/60 transition-all text-base shadow-inner"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-1/3">
              <select 
                name="wnopfx"
                required
                className="w-full bg-brand-blue-navy/40 border border-brand-gold/20 rounded-xl px-4 py-4 text-brand-off-white outline-none focus:border-brand-gold/50 focus:bg-brand-blue-navy/60 transition-all text-base appearance-none cursor-pointer shadow-inner"
              >
                <option value="234">+234 (NG)</option>
                <option value="1">+1 (US/CA)</option>
                <option value="44">+44 (UK)</option>
                <option value="233">+233 (GH)</option>
                <option value="27">+27 (SA)</option>
                <option value="971">+971 (UAE)</option>
              </select>
            </div>
            <div className="w-full sm:w-2/3">
                <input 
                  required
                  name="waphone"
                  type="tel" 
                  minLength={7}
                  placeholder="WhatsApp number" 
                  className="w-full bg-brand-blue-navy/40 border border-brand-gold/20 rounded-xl px-5 py-4 text-brand-off-white placeholder:text-brand-off-white/50 outline-none focus:border-brand-gold/50 focus:bg-brand-blue-navy/60 transition-all text-base shadow-inner"
                />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 text-left px-1">
          <input 
            required 
            type="checkbox" 
            id={`${idPrefix}-terms`}
            className="mt-1.5 accent-brand-gold w-4 h-4"
          />
          <label htmlFor={`${idPrefix}-terms`} className="text-[13px] text-brand-off-white/90 leading-relaxed font-medium">
            I agree to the website's <button type="button" onClick={() => setIsTermsOpen(true)} className="text-brand-gold hover:underline font-bold">terms and conditions *</button>
          </label>
        </div>

        <motion.button 
          disabled={isSubmitting}
          className="premium-button w-full"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 20px rgba(255, 255, 255, 0.3)",
              "0 0 35px rgba(255, 255, 255, 0.6)",
              "0 0 20px rgba(255, 255, 255, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {isSubmitting ? 'SUBMITTING...' : 'JOIN THE WAITLIST NOW'} <ArrowRight className="w-5 h-5" />
        </motion.button>
        <p className="text-[10px] md:text-xs text-brand-off-white/90 font-medium flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-gold" /> NO SPAM. YOUR PRIVACY IS SECURE. <a href="https://privacypolicy.carameldigitals.com/" target="_blank" rel="noopener noreferrer" className="text-brand-gold-light underline hover:text-brand-gold transition-colors">SEE OUR PRIVACY POLICY.</a>
        </p>
      </form>
    ) : (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-8 text-center"
      >
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="font-serif text-2xl font-bold text-brand-gold-light mb-2">You're on the list!</h3>
        <p className="text-brand-off-white/90 text-sm leading-relaxed mb-6">
          We're redirecting you to the WhatsApp group now. If it doesn't happen automatically, click the button below:
        </p>
        <a 
          href="https://chat.whatsapp.com/EKtNC2jSnrwI7puLkRMd9P?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-brand-gold text-brand-blue-dark font-bold py-3 rounded-xl shadow-lg hover:bg-brand-gold-light transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          JOIN WHATSAPP GROUP NOW
        </a>
      </motion.div>
    )}
  </motion.div>
);

const SkillRow = ({ num, title, description, income }: { num: string, title: string, description: string, income: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false }}
    className="glass-card border-l-4 border-l-brand-gold rounded-r-xl p-8 md:p-10 hover:bg-brand-blue-navy/60 transition-all duration-500 group"
  >
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="font-serif text-5xl md:text-6xl font-black text-brand-gold/10 leading-none group-hover:text-brand-gold/20 transition-colors duration-500">
        {num}
      </div>
      <div className="flex-1">
        <h3 className="text-brand-off-white font-bold text-xl mb-3 group-hover:text-brand-gold-light transition-colors duration-500 tracking-tight">
          {title}
        </h3>
        <p className="text-brand-off-white/90 text-sm md:text-base leading-relaxed mb-6 font-normal">
          {description}
        </p>
        <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-lg px-3 py-1.5 text-xs font-bold text-brand-gold-light font-mono">
          <Zap className="w-3.5 h-3.5" /> {income}
        </div>
      </div>
    </div>
  </motion.div>
);

const PriceCard = ({ tier, amount, was, usd, usdWas, includes, featured = false, index }: { tier: string, amount: string, was: string, usd: string, usdWas: string, includes: string[], featured?: boolean, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ 
      y: -12, 
      scale: 1.02,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }}
    viewport={{ once: false }}
    transition={{ 
      duration: 0.6, 
      delay: index * 0.15,
      ease: [0.23, 1, 0.32, 1] 
    }}
    className={`relative flex-1 max-w-sm p-10 rounded-3xl border-4 transition-colors duration-500 ${
      featured 
        ? 'bg-gradient-to-br from-brand-blue-navy via-brand-blue-navy to-brand-gold/20 border-brand-gold shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)]' 
        : 'bg-brand-blue-navy/40 backdrop-blur-md border-white/90 shadow-2xl'
    }`}
  >
    {featured && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + (index * 0.15) }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-blue-dark text-[10px] font-bold font-mono tracking-[0.2em] uppercase px-6 py-2 rounded-full whitespace-nowrap shadow-xl shadow-brand-gold/30 z-20"
      >
        ⭐ MOST POPULAR
      </motion.div>
    )}
    <div className="relative z-10">
      <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brand-off-white mb-6 font-bold">
        {tier}
      </p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl font-serif text-brand-gold-light">₦</span>
        <span className="text-4xl font-serif font-black text-brand-gold-light leading-none tracking-tighter">
          {amount}
        </span>
        <span className="text-base font-serif text-brand-gold-pale ml-1">(${usd})</span>
      </div>
      <p className="text-xs text-brand-off-white/80 line-through mb-8 font-mono">
        Was ₦{was} (${usdWas})
      </p>
      <div className="space-y-4">
        {includes.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) + (index * 0.15) }}
            className="flex gap-4 items-start text-base text-brand-off-white leading-snug font-normal"
          >
            <div className="bg-brand-gold/10 p-1 rounded-full shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-brand-gold" />
            </div>
            <span>{item}</span>
          </motion.div>
        ))}
      </div>
      {featured && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="premium-button w-full mt-10 py-3 text-base"
        >
          SECURE VIP SPOT
        </button>
      )}
    </div>
    {featured && (
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-gold/5 to-transparent pointer-events-none" />
    )}
  </motion.div>
);

const TestimonialMarquee = () => (
  <div className="testimonial-marquee my-12">
    <div className="marquee-content">
      <img src="https://i.ibb.co/jZRMsYR4/1773935929367.png" alt="Bruno F@lcon – Student, Caramel Digital Academy" />
      <img src="https://i.ibb.co/gZh2WSCt/1773935962632.png" alt="Nnebaby – Social Media Brand Strategist" />
      <img src="https://i.ibb.co/xtz8qhSG/1773935294909.png" alt="Hilkow M. – Student, Caramel Digital Academy" />
      <img src="https://i.ibb.co/dwhhP8xB/1773919299811.png" alt="Hannat Salawu – FT Student, Caramel Academy" />
      <img src="https://i.ibb.co/kgFPRDF6/1773919298161.png" alt="Hope Andy – Plotagon Animation Student" />
      <img src="https://i.ibb.co/FqsWTZhG/1773920783964.png" alt="Adebisi Adetutu – Animation Student, Caramel Academy" />
      <img src="https://i.ibb.co/ch1nn793/1773919289938.png" alt="Senator Temiyemi – Aspiring Graduate Entrepreneur" />
      <img src="https://i.ibb.co/4wYmKLjZ/1773862388854.png" alt="Bimbo Adeoye – Animation Professional" />
      <img src="https://i.ibb.co/cSktPbWs/1773862358922.png" alt="Maiganga – Course Reseller" />
      <img src="https://i.ibb.co/hJ4d2CDc/1773862350318.png" alt="Tunde – Digital Nomads Aspiring" />
      <img src="https://i.ibb.co/5gZ0xqf3/1773862368828.png" alt="Samuel Laughter – Animation Learner Potential" />
      <img src="https://i.ibb.co/gF69wyb8/1773862334827.png" alt="Danny Ajieh – Mentality & Skill Transformation" />
      <img src="https://i.ibb.co/67Y3G7GN/1773862374768.png" alt="Peer Knowledge Commendation" />
      <img src="https://i.ibb.co/SgKWSDm/1773923531264.png" alt="Hope Andy – Spiritual Results Focus" />

      {/* DUPLICATE SET */}
      <img src="https://i.ibb.co/jZRMsYR4/1773935929367.png" alt="Bruno F@lcon" aria-hidden="true" />
      <img src="https://i.ibb.co/gZh2WSCt/1773935962632.png" alt="Nnebaby" aria-hidden="true" />
      <img src="https://i.ibb.co/xtz8qhSG/1773935294909.png" alt="Hilkow M." aria-hidden="true" />
      <img src="https://i.ibb.co/dwhhP8xB/1773919299811.png" alt="Hannat Salawu" aria-hidden="true" />
      <img src="https://i.ibb.co/kgFPRDF6/1773919298161.png" alt="Hope Andy" aria-hidden="true" />
      <img src="https://i.ibb.co/FqsWTZhG/1773920783964.png" alt="Adebisi Adetutu" aria-hidden="true" />
      <img src="https://i.ibb.co/ch1nn793/1773919289938.png" alt="Senator Temiyemi" aria-hidden="true" />
      <img src="https://i.ibb.co/4wYmKLjZ/1773862388854.png" alt="Bimbo Adeoye" aria-hidden="true" />
      <img src="https://i.ibb.co/cSktPbWs/1773862358922.png" alt="Maiganga" aria-hidden="true" />
      <img src="https://i.ibb.co/hJ4d2CDc/1773862350318.png" alt="Tunde" aria-hidden="true" />
      <img src="https://i.ibb.co/5gZ0xqf3/1773862368828.png" alt="Samuel Laughter" aria-hidden="true" />
      <img src="https://i.ibb.co/gF69wyb8/1773862334827.png" alt="Danny Ajieh" aria-hidden="true" />
      <img src="https://i.ibb.co/67Y3G7GN/1773862374768.png" alt="Peer Knowledge" aria-hidden="true" />
      <img src="https://i.ibb.co/SgKWSDm/1773923531264.png" alt="Hope Andy" aria-hidden="true" />
    </div>
  </div>
);

const AuthoritySection = () => (
  <section className="py-16 px-6 max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        className="relative w-full lg:w-1/2 flex justify-center"
      >
        <div className="relative">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-brand-gold shadow-2xl shadow-brand-gold/30 relative z-10">
            <img 
              src="https://i.ibb.co/vSRF0rM/1775691567028.jpg" 
              alt="Elizabeth Emmanuel" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-brand-gold/20 rounded-full -z-0 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-brand-gold/10 rounded-full -z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-brand-gold/5 blur-[60px] rounded-full -z-10" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        className="w-full lg:w-1/2 text-center lg:text-left"
      >
        <SectionBadge>Meet Your Strategist & TUTOR</SectionBadge>
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
          Elizabeth <span className="italic text-brand-gold-light">Emmanuel</span>
        </h2>
        
        <div className="space-y-6 text-brand-off-white/90 text-base leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
          <p>
            <span className="text-brand-off-white font-semibold">Digital Skills Guide, Online Business & AI Monetization Strategist</span> helping professionals reclaim their time and multiply their income.
          </p>
          <p>
            Founder of <span className="text-brand-gold-pale font-medium">Caramel Digital Academy</span>, Elizabeth combines Food Technology expertise with deep mastery of AI workflows.
          </p>
        </div>

        <a 
          href="https://www.linkedin.com/in/elizabeth-emmanuel-carameldigi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-brand-blue-navy border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/5 text-brand-off-white px-8 py-3 rounded-xl transition-all group"
        >
          <div className="bg-[#0077B5] rounded-[2px] p-0.5 flex items-center justify-center">
            <Linkedin className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold">Connect with me on LinkedIn</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(true);
    const whatsappUrl = "https://chat.whatsapp.com/EKtNC2jSnrwI7puLkRMd9P?mode=gi_t";
    setTimeout(() => {
        window.location.href = whatsappUrl;
    }, 1000);
  };

  return (
    <div className="relative min-h-screen selection:bg-brand-gold selection:text-brand-blue-dark">
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <SkillsTicker />
      <div className="noise-overlay" />
      
      {/* --- Hero Section --- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-brand-gold/10 blur-[120px] rounded-full opacity-50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] max-w-4xl mx-auto mb-8 tracking-tight">
            <span className="italic text-brand-gold-light">4 AI Skills</span>
            <br />
            That Pay You
            <br />
            <span className="text-brand-gold">Real Money</span>
          </h1>

          <p className="text-brand-off-white text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-12 px-4">
            Join the waitlist now to lock in your 60% discount before the price jumps.
          </p>

          <WaitlistForm 
            idPrefix="hero" 
            isSubmitted={isSubmitted} 
            isSubmitting={isSubmitting} 
            setIsTermsOpen={setIsTermsOpen} 
            handleSubmit={handleSubmit} 
          />
        </motion.div>
      </header>

      {/* --- Footer (Simplified for brevity in the snippet) --- */}
      <footer className="bg-brand-blue-navy border-t border-brand-gold/10 pt-20 pb-10 px-6 text-center">
          <p className="text-xs text-brand-off-white/50">
            © 2026 <span className="text-brand-gold font-bold">Caramel Digital Academy</span>. All rights reserved.
          </p>
      </footer>

      {/* --- Sticky Mobile CTA --- */}
      <AnimatePresence>
        {showStickyCta && !isSubmitted && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-[90] md:hidden"
          >
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="premium-button w-full shadow-2xl shadow-brand-gold/40"
            >
              JOIN THE WAITLIST <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
