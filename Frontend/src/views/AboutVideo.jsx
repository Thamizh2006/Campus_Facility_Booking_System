import React, { useRef } from "react";
import videoSource from "../assets/a.mp4";

const AboutVideo = () => {
  const videoRef = useRef(null);

  return (
    <div>
      <style>{CSS}</style>

      <section className="hero">
        <video
          ref={videoRef}
          src={videoSource}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="hero-video"
        />
        <div className="hero-overlay" />
        <div className="hero-content fade-up">
          <h1>Smart Campus Facility Booking</h1>
          <p>
            AI-powered scheduling that eliminates conflicts, optimizes space usage, 
            and delivers seamless booking experiences for your entire campus community.
          </p>
          <a href="#book" className="cta-button glow">Book Now</a>
        </div>
        <div className="orbs">
          <span className="orb o1" />
          <span className="orb o2" />
          <span className="orb o3" />
        </div>
      </section>
    </div>
  );
};

const CSS = `
.hero { 
  position:relative; 
  height: 72vh; 
  min-height:520px; 
  overflow:hidden; 
  margin: 8px 14px 0; 
  border-radius:18px; 
}
.hero-video { 
  position:absolute; 
  width:100%; 
  height:100%; 
  object-fit:cover; 
  inset:0; 
  z-index:1; 
}
.hero-overlay { 
  position:absolute; 
  inset:0; 
  background:rgba(6,10,22,0.72); /* SAME as Home.jsx overlay */
  backdrop-filter: blur(2px);     /* adds the frosted overlay effect */
  z-index:2; 
}
.hero-content { 
  position:relative; 
  z-index:3; 
  height:100%; 
  display:flex; 
  flex-direction:column; 
  align-items:center; 
  justify-content:center; 
  text-align:center; 
  padding:0 16px; 
}
.hero h1 { 
  font-size:clamp(28px, 5.5vw, 56px); 
  margin:0 0 12px; 
  text-shadow: 0 6px 24px rgba(0,0,0,0.6); 
  color:white;
}
.hero p { 
  max-width:860px; 
  color:var(--text2); 
  margin:0 0 24px; 
  font-size:clamp(14px, 2.2vw, 18px); 
}
.cta-button { 
  display:inline-block; 
  padding:12px 20px; 
  border-radius:12px; 
  background: linear-gradient(130deg, var(--primary), var(--secondary)); 
  color:white; 
  font-weight:700; 
  box-shadow: 0 12px 30px rgba(108,92,231,0.35); 
  transition: all 0.3s ease;
}
.cta-button:hover { 
  transform: translateY(-2px) scale(1.02); 
}

/* Glow effect */
.glow { position:relative; }
.glow::after { 
  content:""; 
  position:absolute; 
  inset:-2px; 
  border-radius:inherit; 
  padding:2px; 
  background:linear-gradient(120deg, rgba(108,92,231,0.7), rgba(142,124,246,0.6), transparent 60%); 
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); 
  -webkit-mask-composite:xor; 
  mask-composite:exclude; 
  pointer-events:none; 
  animation:borderGlow 4s ease-in-out infinite; 
}
@keyframes borderGlow {
  0% { opacity:.4 } 
  50% { opacity:.9 } 
  100% { opacity:.4 } 
}

/* Floating orbs */
.orbs .orb { 
  position:absolute; 
  z-index:2; 
  filter:blur(30px); 
  opacity:.35; 
  background:radial-gradient(closest-side, var(--primary), transparent); 
}
.orbs .o1 { width:220px; height:220px; top:8%; left:8%; animation:float 9s ease-in-out infinite; }
.orbs .o2 { width:160px; height:160px; bottom:14%; right:12%; animation:float 11s ease-in-out infinite reverse; }
.orbs .o3 { width:120px; height:120px; top:20%; right:25%; animation:float 13s ease-in-out infinite; }

@keyframes float { 
  0%, 100% { transform:translateY(0) } 
  50% { transform:translateY(-10px) } 
}
`;

export default AboutVideo;
