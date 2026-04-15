import React, {  useRef } from "react";
import videoSource from "../assets/S.mp4";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../App";
import Header from "../components/layout/Header";

const COLORS = {
  primary: "#6C5CE7",
  secondary: "#8E7CF6",
  background: "#0B1220",
  surface: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.18)",
  textPrimary: "#E6EEF8",
  textSecondary: "#C0C8D8",
  success: "#14b8a6",
  danger: "#ef4444",
  warning: "#f59e0b",
};

const Home = () => {
  const videoRef = useRef(null);
  const introRef = useRef(null);

  return (
    <div style={bodyStyle}>
       <style>{CSS}</style>
       <Header/>
      <section className="hero">
     
        <div className="hero-overlay" />
        <div className="hero-content fade-up">
          <h1>Smart Campus Facility Booking</h1>
          <p>
            AI-powered scheduling that eliminates conflicts, optimizes space usage, and delivers
            seamless booking experiences for your entire campus community.
          </p>
          <a href="#book" className="cta-button glow">Book Now</a>
        </div>
        <div className="orbs">
          <span className="orb o1" />
          <span className="orb o2" />
          <span className="orb o3" />
        </div>
      </section>
      <section style={sectionWrapper}>
  <div style={gridWrapper}>
    <GlassCard
      title="AI-Powered Scheduling"
      icon="⚡"
      desc="Select event types and receive AI-suggested time slots to avoid conflicts."
    />
    <GlassCard
      title="Smart Usage Records"
      icon="📊"
      desc="Track and optimize facility usage over time with integrated reports."
    />
  </div>
</section>

<section style={sectionWrapper}>
  <div style={gridWrapper}>
    <GlassCard
      title="Multi-User Access"
      icon="👥"
      desc="Students, faculty, and admins access the system with role-based permissions."
    />
    <GlassCard
      title="Real-Time Updates"
      icon="⏰"
      desc="Instant confirmations and email/SMS alerts keep everyone informed."
    />
  </div>
</section>



      <Footer />
    </div>
  );
};

const GlassCard = ({ title, icon, desc }) => (
  <div style={glassCardStyle}>
    <div style={iconStyle}>{icon}</div>
    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>{title}</h3>
    <p style={{ fontSize: "1rem", color: "#e0e0e0" }}>{desc}</p>
  </div>
);


const CSS = `
:root{
  --primary:${COLORS.primary};
  --secondary:${COLORS.secondary};
  --bg:${COLORS.background};
  --surface:${COLORS.surface};
  --border:${COLORS.border};
  --text:${COLORS.textPrimary};
  --text2:${COLORS.textSecondary};
  --success:${COLORS.success};
  --danger:${COLORS.danger};
  --warning:${COLORS.warning};
}

*{ box-sizing:border-box }
html, body, #root { height:100%; }
body { margin:0; background: radial-gradient(1200px 600px at 15% 10%, rgba(108,92,231,0.15), transparent 60%),
                      radial-gradient(1000px 500px at 85% 20%, rgba(142,124,246,0.12), transparent 60%),
                      var(--bg); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
a { color:inherit; text-decoration:none }

.page-root { min-height:100vh; display:flex; flex-direction:column; }

/* Glass + Elevation */
.glass { background: var(--surface); border:1px solid var(--border); backdrop-filter: blur(12px); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
.glass-subtle { background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px); border-radius: 14px; }
.lift { transition: transform .3s ease, box-shadow .3s ease; }
.lift:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(0,0,0,0.35); }
.glow { position:relative; }
.glow::after { content:""; position:absolute; inset:-2px; border-radius:inherit; padding:2px; background:linear-gradient(120deg, rgba(108,92,231,0.7), rgba(142,124,246,0.6), transparent 60%); -webkit-mask: 
  linear-gradient(#000 0 0) content-box, 
  linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events:none; animation: borderGlow 4s ease-in-out infinite; }
@keyframes borderGlow {
  0% { opacity: .4 }
  50% { opacity: .9 }
  100% { opacity: .4 }
}

/* Header */
.header { position:sticky; top:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:14px 28px; margin:14px; background:rgba(10,15,30,0.6); }
.brand { display:flex; align-items:center; gap:12px; }
.logo { width:42px; height:42px; object-fit:contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)); }
.title { font-weight:800; letter-spacing:.3px; font-size: clamp(14px, 2.5vw, 18px); }
.nav { display:flex; align-items:center; gap:18px; }
.nav a { padding:8px 12px; border-radius:10px; color:var(--text2); transition: background .2s; }
.nav a:hover { background: rgba(255,255,255,0.06); color:var(--text); }
.nav .active { background: rgba(108,92,231,0.2); color:white; }

/* Hero */
.hero { position:relative; height: 72vh; min-height:520px; overflow:hidden; margin: 8px 14px 0; border-radius:18px; }
.hero-video { position:absolute; width:100%; height:100%; object-fit:cover; inset:0; z-index:1; }
.hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(6,10,22,0.5), rgba(6,10,22,0.85)); z-index:2; }
.hero-content { position:relative; z-index:3; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 16px; }
.hero h1 { font-size:clamp(28px, 5.5vw, 56px); margin:0 0 12px; text-shadow: 0 6px 24px rgba(0,0,0,0.6); }
.hero p { max-width:860px; color:var(--text2); margin:0 0 24px; font-size:clamp(14px, 2.2vw, 18px); }
.cta-button { display:inline-block; padding:12px 20px; border-radius:12px; background: linear-gradient(130deg, var(--primary), var(--secondary)); color:white; font-weight:700; box-shadow: 0 12px 30px rgba(108,92,231,0.35); }
.cta-button:hover { transform: translateY(-1px); }

/* Floating orbs */
.orbs .orb { position:absolute; z-index:2; filter: blur(30px); opacity:.35; background: radial-gradient(closest-side, var(--primary), transparent); }
.orbs .o1 { width:220px; height:220px; top:8%; left:8%; animation: float 9s ease-in-out infinite; }
.orbs .o2 { width:160px; height:160px; bottom:14%; right:12%; animation: float 11s ease-in-out infinite reverse; }
.orbs .o3 { width:120px; height:120px; top:20%; right:25%; animation: float 13s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }

/* Intro */
.intro { display:flex; justify-content:center; padding:42px 16px 24px; }
.intro .card { max-width:980px; padding:24px; }

/* Gallery */
.gallery { padding: 10px 18px 0; }
.slide img { width:100%; height: 420px; object-fit: cover; border-radius: 16px; }

/* Form */
.form-wrap { display:flex; justify-content:center; padding: 54px 16px 24px; }
.form-wrap .card { width: min(1100px, 96%); padding: 24px; }
.form-head { display:flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.form-head h3 { margin:0; font-size: clamp(18px, 3vw, 24px); }
.form-head p { margin:0; color:var(--warning); opacity:.95; }

.grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display:flex; flex-direction:column; gap:8px; }
.field span.req { color:#ff6b6b; margin-left:4px; }
.field input, .field select, .field textarea { width:100%; padding:12px 14px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.16); color:var(--text); outline:none; }
.field input::placeholder, .field textarea::placeholder { color:#94a3b8; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(142,124,246,0.25); }
.field .hint { color:#9aa8bf; font-size: 12px; }
.field .muted { color:#98a4ba; font-size:14px; }
.field .error-text { color: var(--danger); font-size: 12px; }
.error { border-color: var(--danger) !important; }

.span-2 { grid-column: span 2; }

.resources { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:12px; padding: 10px; background: rgba(255,255,255,0.04); border:1px dashed rgba(255,255,255,0.14); border-radius:14px; }
.res-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:12px; background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); }
.res-item input[type="checkbox"] { width:18px; height:18px; accent-color: var(--primary); }
.res-item.qty { justify-content: space-between; gap:14px; }
.res-item.qty input[type="number"] { width: 120px; text-align:right; }
.res-item .hint { color:#9aa8bf; font-size:12px; }
.res-item.disabled { opacity:.5; pointer-events:none; }

.route { display:flex; gap:10px; flex-wrap:wrap; padding:10px; }
.pill { display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; background: rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.14); font-size:13px; color:var(--text2); }
.pill .dot { width:8px; height:8px; border-radius:999px; background: var(--success); display:inline-block; }

.actions { display:flex; align-items:center; gap:12px; }
.primary { border:0; padding:12px 16px; border-radius:12px; background: linear-gradient(130deg, var(--primary), var(--secondary)); color:white; font-weight:800; letter-spacing:.3px; cursor:pointer; box-shadow: 0 14px 36px rgba(108,92,231,0.35); }
.primary:hover { transform: translateY(-1px); }
.toast { padding:10px 12px; border-radius:12px; font-size:14px; }
.toast.success { background: rgba(20,184,166,0.15); border: 1px solid rgba(20,184,166,0.35); color:#99f6e4; }
.toast.error { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); color:#fecaca; }

/* Quick Links */
.quick-links { padding: 28px 16px 60px; text-align:center; }
.quick-links h2 { margin: 8px 0 18px; }
.quick-links .btns { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
.quick-links button { padding:10px 14px; border-radius:12px; background: rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.16); color:var(--text); cursor:pointer; transition: .2s; }
.quick-links button:hover { background: rgba(255,255,255,0.12); transform: translateY(-1px); }

/* Footer */
.footer { padding: 24px 18px 40px; text-align:center; color:var(--text2); }

/* Animations */
.fade-up { animation: fadeUp .8s ease both; }
@keyframes fadeUp { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }

/* Responsive */
@media (max-width: 880px) {
  .grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
  .resources { grid-template-columns: 1fr; }
  .hero { height: 60vh; }
  .slide img { height: 280px; }
}
`;
export const headerStyle = {
  padding: "20px 40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(8px)",
  color: COLORS.textPrimary,
  position: "sticky",
  top: 0,
  zIndex: 1000,
  fontSize: "1rem",
  transition: "all 0.3s ease-in-out",
};
export const bodyStyle = {
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
  margin: 0,
  background: COLORS.background,
  color: COLORS.textPrimary,
  transition: "background 0.3s ease-in-out, color 0.3s ease-in-out",
};




const sectionWrapper = {
  padding: "60px 20px",
  background: COLORS.background,
  display: "flex",
  justifyContent: "center",
};

const gridWrapper = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2.5rem",
  width: "100%",
  maxWidth: "1200px",
};



const glassCardStyle = {
  borderRadius: "20px",
  padding: "30px",
  background: COLORS.surface,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",  // <-- This centers the contents
  textAlign: "center",   // <-- This centers the text
  gap: "15px",
  border: `1px solid ${COLORS.border}`,
};



const iconStyle = {
  fontSize: "2.5rem",
  background: COLORS.iconBg,
  padding: "12px",
  borderRadius: "12px",
  color: COLORS.textPrimary,
};

const videoHeroTitle = {
  fontSize: "3.5rem",
  fontWeight: "800",
  marginBottom: "20px",
  textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
  color: COLORS.textPrimary,
};

const videoHeroDesc = {
  fontSize: "1.2rem",
  maxWidth: "800px",
  margin: "0 auto 40px",
  color: COLORS.textSecondary,
  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
};


export default Home;
