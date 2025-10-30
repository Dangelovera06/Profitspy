import { useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { AnimatedGridPattern } from './AnimatedGridPattern';
import './InfiniteHero.css';

export default function InfiniteHero() {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-in');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, index * 200);
      });
    }
  }, []);

  return (
    <div className="infinite-hero-root">
      <div className="infinite-hero-bg">
        <AnimatedGridPattern
          numSquares={80}
          maxOpacity={0.2}
          duration={4}
          repeatDelay={1}
          className="hero-grid-pattern"
        />
      </div>

      <div className="infinite-hero-vignette" />

      <div className="infinite-hero-content">
        <div className="infinite-hero-text" ref={contentRef}>
          <h1 className="infinite-hero-title animate-in">
            ProfitSpy
          </h1>
          <p className="infinite-hero-description animate-in">
            Discover high-performing ads and recreate them for your campaigns. Analyze winning strategies and unlock profitable insights.
          </p>

          <div className="infinite-hero-cta animate-in">
            <Link to="/dashboard" className="btn-hero">
              Get Started
            </Link>

            <Link to="/dashboard" className="btn-hero-link">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
