import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "./PillNav.css";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  const handleLoginClick = () => {
    window.open('https://app.trylo.space/', '_blank');
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#demo", label: "Demo" },
    { href: "#reviews", label: "Reviews" },
    { href: "#pricing", label: "Pricing" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
    { href: "/refund", label: "Refund" },
  ];

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease: "power3.easeOut", overwrite: "auto" },
          0
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease: "power3.easeOut", overwrite: "auto" },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease: "power3.easeOut", overwrite: "auto" },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => { });
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1 });
    }

    // Initial load animation
    const logo = logoRef.current;
    const navItems = navItemsRef.current;

    if (logo) {
      gsap.set(logo, { scale: 0 });
      gsap.to(logo, {
        scale: 1,
        duration: 0.6,
        ease: "power3.easeOut",
      });
    }

    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: "hidden" });
      gsap.to(navItems, {
        width: "auto",
        duration: 0.6,
        ease: "power3.easeOut",
      });
    }

    return () => window.removeEventListener("resize", onResize);
  }, [navItems]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: "power3.easeOut" });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: "power3.easeOut" });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: "power3.easeOut" });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: "power3.easeOut" });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease: "power3.easeOut",
            transformOrigin: "top center",
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease: "power3.easeOut",
          transformOrigin: "top center",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }
  };

  const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href: string) => href && !isExternalLink(href);

  const cssVars: React.CSSProperties = {
    ["--base" as any]: "#fff",
    ["--pill-bg" as any]: "#fbbf24",
    ["--hover-text" as any]: "#000",
    ["--pill-text" as any]: "#fff",
  };

  return (
    <div className="pill-nav-container">
      <nav
        className="pill-nav"
        aria-label="Primary"
        style={cssVars}
      >
        <Link
          className="pill-logo"
          to="/"
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          role="menuitem"
                     ref={logoRef}
        >
          <img 
            src="/ChatGPT Image Aug 26, 2025, 08_24_33 PM.png" 
            alt="Trylo Logo" 
            ref={logoImgRef}
          />
        <span style={{ fontFamily: "Raleway, Arial, sans-serif", fontWeight: 300, fontSize: "40px", letterSpacing: "2px" }}>
          Trylo
        </span>

        </Link>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {navItems.slice(1, 5).map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  className="pill"
                                     aria-label={item.label}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
            <li role="none">
              <button
                onClick={handleLoginClick}
                className="pill"
                style={{ background: "transparent", border: "1px solid #fbbf24", color: "#fbbf24" }}
              >
                <span className="pill-label">Login</span>
              </button>
            </li>
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div
        className="mobile-menu-popover mobile-only"
        ref={mobileMenuRef}
        style={cssVars}
      >
        <ul className="mobile-menu-list">
          {navItems.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`}>
              {isRouterLink(item.href) ? (
                <Link
                  to={item.href}
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                handleLoginClick();
                setIsMobileMenuOpen(false);
              }}
              className="mobile-menu-link"
              style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer" }}
            >
              Login
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;