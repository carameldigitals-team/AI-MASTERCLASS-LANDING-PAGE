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
  Timer,
  Gift,
  Award
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
    viewport={{ once: true }}
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
  
  // Duplicate the list to ensure seamless looping
  const tickerItems = [...skills, ...skills, ...skills, ...skills];

  return (
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
            <p>BY SUBMITTING THIS FORM AND JOINING OUR WAITLIST, You agree to the following terms:</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>To receive relevant AI business tips and updates via your WhatsApp DM in the future.</li>
              <li>That the information shared during the masterclass is for your personal or internal business purposes only, and not to be reshared commercially, redistributed, or resold.</li>
              <li>We may revoke access if you violate these terms.</li>
            </ol>
            <p className="pt-4 border-t border-brand-gold/10 font-medium">
              THE 4 AI SKILLS MASTERCLASS is exclusively intellectual property of CARAMEL DIGITALS and is protected under copyright law.
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
  <div className="max-w-md mx-auto">
    {!isSubmitted ? (
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="relative group">
            <input 
              required
              name="name"
              type="text" 
              placeholder="Your first name" 
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

        <button 
          disabled={isSubmitting}
          className="premium-button w-full"
        >
          {isSubmitting ? 'SUBMITTING...' : 'JOIN THE WAITLIST NOW'} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-brand-off-white/90 font-medium flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-gold" /> No spam. Your privacy is our priority.
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
          href="https://chat.whatsapp.com/ILf8UoOCCuvEsomvo5sQx1?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-brand-gold text-brand-blue-dark font-bold py-3 rounded-xl shadow-lg hover:bg-brand-gold-light transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          JOIN WHATSAPP GROUP NOW
        </a>
      </motion.div>
    )}
  </div>
);

const SkillRow = ({ num, title, description, income }: { num: string, title: string, description: string, income: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
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
    viewport={{ once: true }}
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
      {/* ORIGINAL SET (14 cards) */}
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

      {/* DUPLICATE SET — seamless infinite loop */}
      <img src="https://i.ibb.co/jZRMsYR4/1773935929367.png" alt="Bruno F@lcon – Student, Caramel Digital Academy" aria-hidden="true" />
      <img src="https://i.ibb.co/gZh2WSCt/1773935962632.png" alt="Nnebaby – Social Media Brand Strategist" aria-hidden="true" />
      <img src="https://i.ibb.co/xtz8qhSG/1773935294909.png" alt="Hilkow M. – Student, Caramel Digital Academy" aria-hidden="true" />
      <img src="https://i.ibb.co/dwhhP8xB/1773919299811.png" alt="Hannat Salawu – FT Student, Caramel Academy" aria-hidden="true" />
      <img src="https://i.ibb.co/kgFPRDF6/1773919298161.png" alt="Hope Andy – Plotagon Animation Student" aria-hidden="true" />
      <img src="https://i.ibb.co/FqsWTZhG/1773920783964.png" alt="Adebisi Adetutu – Animation Student, Caramel Academy" aria-hidden="true" />
      <img src="https://i.ibb.co/ch1nn793/1773919289938.png" alt="Senator Temiyemi – Aspiring Graduate Entrepreneur" aria-hidden="true" />
      <img src="https://i.ibb.co/4wYmKLjZ/1773862388854.png" alt="Bimbo Adeoye – Animation Professional" aria-hidden="true" />
      <img src="https://i.ibb.co/cSktPbWs/1773862358922.png" alt="Maiganga – Course Reseller" aria-hidden="true" />
      <img src="https://i.ibb.co/hJ4d2CDc/1773862350318.png" alt="Tunde – Digital Nomads Aspiring" aria-hidden="true" />
      <img src="https://i.ibb.co/5gZ0xqf3/1773862368828.png" alt="Samuel Laughter – Animation Learner Potential" aria-hidden="true" />
      <img src="https://i.ibb.co/gF69wyb8/1773862334827.png" alt="Danny Ajieh – Mentality & Skill Transformation" aria-hidden="true" />
      <img src="https://i.ibb.co/67Y3G7GN/1773862374768.png" alt="Peer Knowledge Commendation" aria-hidden="true" />
      <img src="https://i.ibb.co/SgKWSDm/1773923531264.png" alt="Hope Andy – Spiritual Results Focus" aria-hidden="true" />
    </div>
  </div>
);

const AuthoritySection = () => (
  <section className="py-16 px-6 max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
      {/* Image Column */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
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
          {/* Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-brand-gold/20 rounded-full -z-0 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-brand-gold/10 rounded-full -z-0" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-brand-gold/5 blur-[60px] rounded-full -z-10" />
        </div>
      </motion.div>

      {/* Content Column */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="w-full lg:w-1/2 text-center lg:text-left"
      >
        <SectionBadge>Meet Your Strategist & TUTOR</SectionBadge>
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
          Elizabeth <span className="italic text-brand-gold-light">Emmanuel</span>
        </h2>
        
        <div className="space-y-6 text-brand-off-white/90 text-base leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
          <p>
            <span className="text-brand-off-white font-semibold">Digital Skills Guide, Online Business & AI Monetization Strategist</span> helping professionals reclaim their time and multiply their income through intelligent automations.
          </p>
          <p>
            As the visionary founder of <span className="text-brand-gold-pale font-medium">Caramel Digital Academy</span>, Elizabeth combines a professional foundation in Food Technology with deep expertise in Video Animation, AI systems, and profitable digital workflows.
          </p>
          <p>
            Through her flagship <span className="italic text-brand-gold-light">Sovereign Income Multiplier System</span>, she is empowering thousands of ambitious minds across Africa to transition from being "busy" to building highly profitable businesses beyond salary dependency.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 gap-6 mb-10 max-w-lg mx-auto lg:mx-0 text-left">
          {[
            { title: 'Proven Frameworks', desc: 'Creator of the Sovereign Income Multiplier System' },
            { title: 'Global Impact', desc: 'Helping 1,000+ professionals achieve digital freedom this year' },
            { title: 'Result-Oriented', desc: 'Expert in Video Animation & systems that scale digital income' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start bg-brand-blue-navy/40 p-4 rounded-xl border border-brand-gold/10">
              <div className="bg-brand-gold/10 p-2 rounded-lg">
                <Star className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h4 className="text-brand-off-white font-bold text-lg">{item.title}</h4>
                <p className="text-brand-off-white/80 text-base">{item.desc}</p>
              </div>
            </div>
          ))}
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
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 23, minutes: 59, seconds: 59 });
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      wnopfx: formData.get('wnopfx'),
      waphone: formData.get('waphone'),
    };

    try {
      // 1. CAPTURE LEAD FIRST
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // 2. SHOW SUCCESS STATE
        setIsSubmitted(true);
        console.log("Lead captured successfully. Initiating redirect...");
        
        const whatsappUrl = "https://chat.whatsapp.com/ILf8UoOCCuvEsomvo5sQx1?mode=gi_t";
        
        // 3. REDIRECT IMMEDIATELY (New tab is best to keep the form available for next lead)
        try {
          const newWindow = window.open(whatsappUrl, "_blank");
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // If popup is blocked, try top-level redirect as fallback
            console.warn("Popup blocked, falling back to top-level redirect");
            if (window.top && window.top !== window) {
              window.top.location.href = whatsappUrl;
            } else {
              window.location.href = whatsappUrl;
            }
          }
        } catch (e) {
          console.error("Redirect failed, using fallback:", e);
          window.location.href = whatsappUrl;
        }

        // 4. RESET FORM FOR ANOTHER LEAD CAPTURE
        // We wait 3 seconds so they see the success message before the form resets
        setTimeout(() => {
          setIsSubmitted(false);
          form.reset();
        }, 3000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-brand-gold selection:text-brand-blue-dark">
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <SkillsTicker />
      <div className="noise-overlay" />
      
      {/* --- Hero Section --- */}
      <header className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
        {/* Background Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-brand-gold/10 blur-[120px] rounded-full opacity-50" />
          <div className="absolute bottom-0 right-0 w-[60%] h-[40%] bg-brand-gold/5 blur-[100px] rounded-full opacity-30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full px-5 py-2 mb-8">
            <span className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-brand-gold-light">
              ⭐ INTRODUCING THE AI W.A.V.E. MASTERCLASS — LIMITED SEATS AVAILABLE
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] max-w-4xl mx-auto mb-8 tracking-tight">
            <span className="italic text-brand-gold-light">4 AI Skills</span>
            <br />
            That Pay You
            <br />
            <span className="text-brand-gold">Real Money</span>
          </h1>

    <p className="text-brand-off-white text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-12 px-4">
      Watch me build the exact AI systems Ambitious African Professionals use to earn <span className="text-brand-gold-pale font-bold border-b border-brand-gold/30">₦200K–₦800K+ ($133–$533+)</span> monthly. <span className="text-brand-gold-light font-bold">Join the waitlist now to lock in your 60% discount</span> before the price jumps to ₦25,000.
    </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 max-w-3xl mx-auto px-4">
            {['Build Websites with AI', 'Create Professional Videos Without Camera', 'Build & Sell Digital Products', 'Automate Business Systems'].map((skill, i) => (
              <div key={i} className="bg-brand-blue-navy/40 backdrop-blur-sm border border-brand-gold/10 rounded-full px-4 py-2 text-xs md:text-sm font-medium text-brand-gold-pale flex items-center gap-2">
                <span className="font-mono text-[10px] text-brand-gold font-bold bg-brand-gold/10 w-5 h-5 rounded-full flex items-center justify-center">0{i+1}</span>
                {skill}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-brand-blue-navy/40 backdrop-blur-md border border-brand-gold/10 rounded-2xl p-6 md:p-8 mb-16 shadow-2xl shadow-black/50">
            {[
              { amount: '₦200K–500K ($133–$333)', label: 'Per website built' },
              { amount: '₦500K–2M+ ($333–$1,333+)', label: 'Monthly (video creators)' },
              { amount: '₦3K–50K ($2–$33)', label: 'Per digital product' },
              { amount: '₦800K+ ($533+)', label: 'Automation retainers' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <span className="block font-serif text-sm md:text-base font-bold text-brand-gold-light group-hover:scale-105 transition-transform duration-300">{item.amount}</span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-brand-off-white/80 font-mono mt-1 block">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div className="mb-8">
            <p className="text-xs font-mono tracking-widest uppercase text-brand-off-white/90 mb-4">Early bird pricing closes in</p>
            <div className="flex justify-center gap-2 md:gap-3">
              {[
                { val: timeLeft.days, lbl: 'Days' },
                { val: timeLeft.hours, lbl: 'Hours' },
                { val: timeLeft.minutes, lbl: 'Mins' },
                { val: timeLeft.seconds, lbl: 'Secs' }
              ].map((unit, i) => (
                <div key={i} className="bg-brand-blue-navy border border-brand-gold/20 rounded-lg p-2 min-w-[64px] md:min-w-[72px]">
                  <span className="block font-mono text-xl md:text-2xl font-bold text-brand-gold-light leading-none">{String(unit.val).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-tighter text-brand-off-white/80 mt-1">{unit.lbl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-4 max-w-lg mx-auto mb-12">
            <p className="text-base text-brand-gold-pale font-medium">
              🎯 Only <span className="text-brand-gold-light font-bold">50 early-bird spots</span> available at the founding price — once they're gone, the price goes up.
            </p>
          </div>

          {/* Form */}
          <WaitlistForm 
            idPrefix="hero" 
            isSubmitted={isSubmitted} 
            isSubmitting={isSubmitting} 
            setIsTermsOpen={setIsTermsOpen} 
            handleSubmit={handleSubmit} 
          />
        </motion.div>
      </header>

      {/* --- Proof Strip --- */}
      <div className="bg-brand-blue-navy/80 backdrop-blur-md border-y border-brand-gold/10 py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 opacity-30" />
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 relative z-10">
          {[
            { num: '1,000+', lbl: 'Professionals Trained' },
            { num: '5+', lbl: 'YEARS COACHING ONLINE' },
            { num: '4', lbl: 'Live Builds on Screen' },
            { num: '0', lbl: 'Prior Tech Skills Needed' }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <span className="block font-serif text-2xl md:text-3xl font-black text-brand-gold-light mb-2 group-hover:scale-105 transition-transform duration-500">{stat.num}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-brand-off-white/90 font-mono font-bold">{stat.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- The Problem Section --- */}
      <section className="py-24 px-6 bg-brand-blue-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SectionBadge>The Hard Truth</SectionBadge>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
              Why Most Professionals are <span className="italic text-brand-gold-light">Working Harder</span> but Earning Less.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                icon: TrendingDown, 
                title: "Inflation is Eating Your Salary", 
                desc: "Your fixed income is losing value every single day. If you aren't earning in a way that scales, you're falling behind." 
              },
              { 
                icon: AlertCircle, 
                title: "Traditional Skills are Fading", 
                desc: "The 'old way' of doing business is slow and expensive. AI is replacing tasks, but it's empowering those who know how to use it." 
              },
              { 
                icon: Clock, 
                title: "The 'Busy' Trap", 
                desc: "You're spending 10+ hours a day on manual tasks that an AI could do in 30 seconds. You don't have a time problem; you have a system problem." 
              },
              { 
                icon: Zap, 
                title: "The AI Gap is Widening", 
                desc: "There are two types of professionals in 2026: those who use AI to multiply their output, and those who are replaced by them." 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 p-6 rounded-2xl bg-brand-blue-navy/30 border border-white/5 hover:border-brand-gold/20 transition-all duration-300"
              >
                <div className="bg-brand-gold/10 p-3 rounded-xl h-fit">
                  <item.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-brand-off-white font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-brand-off-white/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Who This Is For --- */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionBadge>This Is For You</SectionBadge>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 leading-[1.1] tracking-tight">
            You Don't Need a Tech Background.<br />
            You Need the <span className="italic text-brand-gold-light">Right System.</span>
          </h2>
          <p className="text-brand-off-white text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            This masterclass was built for Ambitious African Professionals who know AI is the future — but haven't figured out how to turn it into actual income yet.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Briefcase, title: 'The 9-5 Professional', desc: 'You want a second income stream without quitting your job. You just need a clear, doable path.' },
            { icon: GraduationCap, title: 'The Fresh Graduate', desc: 'No connections, no capital — but you have time, a smartphone, and the hunger to build something real.' },
            { icon: Building2, title: 'The Small Business Owner', desc: 'You want to automate processes, cut costs, and serve more clients without hiring more staff.' },
            { icon: Laptop, title: 'The Aspiring Freelancer', desc: 'You want high-paying skills clients will pay for — without spending years learning to code.' },
            { icon: Video, title: 'The Content Creator', desc: 'You want to produce professional videos and digital products faster, with less stress, for more income.' },
            { icon: Globe, title: 'The Diaspora Nigerian', desc: 'You want to build something back home or earn a global income using skills you can learn remotely.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 md:p-10 hover:bg-brand-blue-navy/60 hover:border-brand-gold/30 transition-all duration-500 group"
            >
              <div className="bg-brand-gold/10 w-14 h-14 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all duration-500">
                <item.icon className="w-7 h-7 text-brand-gold" />
              </div>
              <h4 className="text-brand-off-white font-bold mb-4 text-xl tracking-tight">{item.title}</h4>
              <p className="text-brand-off-white/90 text-sm leading-relaxed font-normal">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Authority Section --- */}
      <AuthoritySection />

      {/* --- Skills Breakdown --- */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionBadge>What You'll Learn</SectionBadge>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 leading-[1.1] tracking-tight">
            Four Skills. Four <span className="italic text-brand-gold-light">Live Builds.</span><br />
            Zero Pre-Made Shortcuts.
          </h2>
          <p className="text-brand-off-white text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Every skill is built from scratch, on my screen, in real time. You see every prompt, every tool, every step.
          </p>
        </div>

        <div className="space-y-8">
          <SkillRow 
            num="W" 
            title="AI-Built Websites" 
            description="Fast-track your online presence."
            income="₦200,000 – ₦500,000 ($133 – $333) per site"
          />
          <SkillRow 
            num="A" 
            title="Business Automation" 
            description="Reclaim your time and scale your operations."
            income="₦50,000 – ₦800,000 ($33 – $533) per project"
          />
          <SkillRow 
            num="V" 
            title="Realistic AI Videos" 
            description="Create engaging content without being on camera."
            income="₦30,000 – ₦100,000 ($20 – $66) per video"
          />
          <SkillRow 
            num="E" 
            title="Digital Products" 
            description="Turn your expertise into passive income."
            income="₦3,000 – ₦50,000 ($2 – $33) per product"
          />
        </div>

        {/* --- The Timeline Section --- */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionBadge>The Afternoon Roadmap</SectionBadge>
            <h3 className="font-serif text-2xl md:text-4xl font-bold mb-4">What Happens During the <span className="italic text-brand-gold-light">Live Build?</span></h3>
            <p className="text-brand-off-white/70 text-sm md:text-base">We don't just talk. We build. Here is the exact schedule.</p>
          </div>

          <div className="relative border-l-2 border-brand-gold/20 ml-4 md:ml-0 md:left-1/2 md:-translate-x-px space-y-12">
            {[
              { time: "2:00 PM", title: "AI Foundations & Command Center", desc: "Setting up the exact tools and prompts I use to run my entire digital academy." },
              { time: "3:00 PM", title: "The 15-Minute AI Website Build", desc: "Watch me build a professional, high-converting website live on screen using AI." },
              { time: "4:00 PM", title: "Viral AI Video & Content Creation", desc: "How to create professional videos and social content without ever showing your face." },
              { time: "5:00 PM", title: "Monetization Systems & Live Q&A", desc: "The exact steps to turn these skills into a consistent income stream starting today." }
            ].map((step, i) => (
              <div key={i} className="relative pl-8 md:pl-0">
                <div className="absolute -left-[9px] md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 rounded-full bg-brand-gold border-4 border-brand-blue-dark shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                <div className={`md:w-[45%] ${i % 2 === 0 ? 'md:mr-auto md:text-right md:pr-12' : 'md:ml-auto md:text-left md:pl-12'}`}>
                  <span className="inline-block font-mono text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full mb-2">{step.time}</span>
                  <h4 className="text-brand-off-white font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-brand-off-white/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Marquee --- */}
      <section className="pt-10 pb-4 overflow-hidden">
        <div className="text-center mb-8 px-6">
          <SectionBadge>Wall of Love</SectionBadge>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Real Results from <span className="italic text-brand-gold-light">Real Students.</span>
          </h2>
        </div>
        <TestimonialMarquee />
      </section>

      {/* --- Bonuses Section --- */}
      <section className="py-20 px-6 bg-brand-gold/5 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SectionBadge>Waitlist Exclusives</SectionBadge>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Stacking the Value for <span className="italic text-brand-gold-light">Your Success.</span>
            </h2>
            <p className="text-brand-off-white/80 text-base md:text-lg max-w-2xl mx-auto">
              Join the waitlist today and get these high-value bonuses for <span className="text-brand-gold-light font-bold">FREE</span> when you eventually register.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "The AI Prompt Vault", 
                val: "₦15,000", 
                desc: "50+ high-converting prompts for marketing, sales, and content creation.",
                icon: Gift
              },
              { 
                title: "The Professional's AI Starter Kit", 
                val: "₦20,000", 
                desc: "The essential software and AI tools every professional needs to automate their workflow and boost productivity.",
                icon: Briefcase
              },
              { 
                title: "Private Community Access", 
                val: "₦25,000", 
                desc: "90 days of priority support and networking with other Ambitious Professionals.",
                icon: Users
              }
            ].map((bonus, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-2xl border-t-4 border-t-brand-gold relative group"
              >
                <div className="absolute -top-4 -right-4 bg-brand-gold text-brand-blue-dark text-[10px] font-bold px-3 py-1 rounded-lg shadow-lg">
                  VALUE: {bonus.val}
                </div>
                <div className="bg-brand-gold/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <bonus.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h4 className="text-brand-off-white font-bold text-xl mb-3">{bonus.title}</h4>
                <p className="text-brand-off-white/70 text-sm leading-relaxed">{bonus.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-6 md:p-8">
              <p className="text-brand-gold-light font-serif text-xl md:text-2xl font-bold mb-2">Total Bonus Value: ₦60,000 ($40)</p>
              <p className="text-brand-off-white/80 text-sm">Yours <span className="text-brand-gold font-bold">FREE</span> just for joining the waitlist today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section className="pt-8 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionBadge>Investment</SectionBadge>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 leading-[1.1] tracking-tight">
            Simple Pricing.<br /><span className="italic text-brand-gold-light">Exceptional</span> Value.
          </h2>
          <p className="text-brand-off-white text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            This 60% discount is <span className="text-brand-gold-light font-bold underline">exclusive</span> to waitlist members. Once the timer hits zero, the price returns to ₦25,000 for everyone else.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          <PriceCard 
            index={0}
            tier="Standard Access"
            amount="9,999"
            was="25,000"
            usd="7"
            usdWas="17"
            includes={[
              'Live masterclass access',
              'Recorded replay (48-hour access)',
              'Resource templates & prompts',
              'WhatsApp community access (30 days)'
            ]}
          />
          <PriceCard 
            index={1}
            featured
            tier="VIP Access"
            amount="19,999"
            was="50,000"
            usd="13"
            usdWas="33"
            includes={[
              'Everything in Standard',
              'Lifetime replay access',
              '1-on-1 WhatsApp Q&A with Elizabeth (30 mins)',
              'Done-for-you prompt library (50+ prompts)',
              'Priority WhatsApp support group (90 days)',
              'Certificate of completion'
            ]}
          />
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="pt-16 pb-8 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <SectionBadge>Common Questions</SectionBadge>
          <h2 className="font-serif text-3xl font-bold mb-6 leading-tight">
            Before You Ask —<br /><span className="italic text-brand-gold-light">Here's</span> What People Want to Know
          </h2>
        </div>

        <div className="space-y-2">
          <FaqItem 
            question="Do I need any tech skills or coding experience?" 
            answer="Zero. If you can use WhatsApp and a smartphone, you have all the technical skill you need. Everything is shown from scratch, step by step, on screen."
          />
          <FaqItem 
            question="Will I get the recording if I miss the live session?" 
            answer="Yes. Standard access includes a 48-hour replay. VIP access includes lifetime access so you can re-watch as many times as you need at your own pace."
          />
          <FaqItem 
            question="What tools will I need? Are they free?" 
            answer="Most of the tools used are free or have very affordable paid tiers. A full tools list is sent to all registered attendees before the masterclass."
          />
          <FaqItem 
            question="I already have a 9-5. Can I still use these skills?" 
            answer="That's exactly who this was built for. These skills can be monetized as a freelancer, used to start a side business, or applied to make your current job easier."
          />
          <FaqItem 
            question="When is the masterclass holding?" 
            answer="The exact date and link will be sent to your WhatsApp once registration opens. Joining the waitlist guarantees you're the first to know."
          />
        </div>
      </section>

      {/* --- Bottom CTA --- */}
      <section className="relative pt-12 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-gold/5 blur-[100px] rounded-full translate-y-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionBadge>Last Chance</SectionBadge>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Stop Watching AI Make Other People Rich.<br /><span className="italic text-brand-gold-light">Your Spot is Waiting.</span>
          </h2>
          <p className="text-brand-off-white/90 text-lg mb-12 max-w-xl mx-auto leading-relaxed font-normal">
            Don't pay ₦25,000 later. Join the waitlist now to <span className="text-brand-gold-light font-bold">lock in your 60% discount</span> and secure your spot for just ₦9,999.
          </p>

          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-brand-gold text-brand-blue-dark font-bold py-3 px-8 rounded-xl shadow-xl hover:bg-brand-gold-light transition-all"
          >
            JOIN THE WAITLIST NOW
          </button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-brand-blue-navy border-t border-brand-gold/10 pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="font-serif text-2xl font-bold">
                <span className="text-brand-gold">Caramel</span>
                <span className="text-brand-off-white"> Digital Academy</span>
              </div>
              <p className="text-brand-off-white/70 text-sm leading-relaxed max-w-xs">
                Empowering Ambitious African Professionals to reclaim their time and multiply their income through the power of AI and intelligent automation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/elizabeth-emmanuel-carameldigi" target="_blank" rel="noopener noreferrer" className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold hover:bg-brand-gold hover:text-brand-blue-dark transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold hover:bg-brand-gold hover:text-brand-blue-dark transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="mailto:support@carameldigital.com" className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold hover:bg-brand-gold hover:text-brand-blue-dark transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-brand-off-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-sm text-brand-off-white/70">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-brand-gold transition-colors">Join Waitlist</button></li>
                <li><a href="#about" className="hover:text-brand-gold transition-colors">About Elizabeth</a></li>
                <li><a href="#skills" className="hover:text-brand-gold transition-colors">W.A.V.E. Skills</a></li>
                <li><a href="#pricing" className="hover:text-brand-gold transition-colors">Pricing Tiers</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-brand-off-white font-bold mb-6 uppercase tracking-widest text-xs">Support & Legal</h4>
              <ul className="space-y-4 text-sm text-brand-off-white/70">
                <li><a href="#" className="hover:text-brand-gold transition-colors flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Earnings Disclaimer</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Contact Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-brand-off-white font-bold mb-6 uppercase tracking-widest text-xs">Get In Touch</h4>
              <p className="text-brand-off-white/70 text-sm leading-relaxed mb-4">
                Have questions about the AI W.A.V.E. Masterclass?
              </p>
              <a 
                href="https://wa.link/7srq2i" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-gold font-bold text-sm hover:underline"
              >
                Chat with us on WhatsApp <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-brand-off-white/50 text-center md:text-left">
              © 2026 <span className="text-brand-gold font-bold">Caramel Digital Academy</span>. All rights reserved. Built by Elizabeth O. Emmanuel.
            </p>
            <p className="text-[10px] text-brand-off-white/30 max-w-md text-center md:text-right leading-relaxed">
              Disclaimer: The income figures mentioned are potential earnings based on industry standards. Your results may vary depending on your effort, skill level, and market conditions.
            </p>
          </div>
        </div>
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
