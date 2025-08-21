import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Carousel from './components/Carousel';

function App() {
  const containerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuPreviewImgRef = useRef(null);
  const menuLinksRef = useRef([]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const menuToggle = menuToggleRef.current;
    const menuOverlay = menuOverlayRef.current;
    const menuContent = menuContentRef.current;
    const menuPreviewImg = menuPreviewImgRef.current;

    if (!container || !menuToggle || !menuOverlay || !menuContent || !menuPreviewImg) {
      return;
    }

    const cleanupPreviewImages = () => {
      const previewImages = menuPreviewImg.querySelectorAll("img");
      if (previewImages.length > 3) {
        for (let i = 0; i < previewImages.length - 3; i++) {
          menuPreviewImg.removeChild(previewImages[i]);
        }
      }
    };

    const resetPreviewImage = () => {
      menuPreviewImg.innerHTML = "";
      const defaultPreviewImg = document.createElement("img");
      defaultPreviewImg.src = "/slide-img-1.jpg";
      menuPreviewImg.appendChild(defaultPreviewImg);
    };

    const animateMenuToggle = (isOpening) => {
      const open = document.querySelector("p#menu-open");
      const close = document.querySelector("p#menu-close");
      
      if (!open || !close) return;

      gsap.to(isOpening ? open : close, {
        x: isOpening ? -5 : 5,
        y: isOpening ? -10 : 10,
        rotation: isOpening ? -5 : 5,
        opacity: 0,
        delay: 0.25,
        duration: 0.5,
        ease: "power2.out"
      });

      gsap.to(isOpening ? close : open, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        delay: 0.5,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const openMenu = () => {
      if (isAnimating || isOpen) return;
      setIsAnimating(true);

      animateMenuToggle(true);

      gsap.to(container, {
        rotation: 10,
        x: 300,
        y: 450,
        scale: 1.5,
        duration: 1.25,
        ease: "power4.inOut"
      });

      gsap.to(menuContent, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut"
      });
     
      gsap.to([".link a", ".social a"], {
        y: "0%",
        opacity: 1,
        duration: 1,
        delay: 0.75,
        stagger: 0.1,
        ease: "power3.out"
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%,0% 100%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          setIsOpen(true);
          setIsAnimating(false);
        },  
      });
    };

    const closeMenu = () => {
      if (isAnimating || !isOpen) return;
      setIsAnimating(true);

      gsap.to(container, {
        rotation: 0,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.25,
        ease: "power4.inOut"
      }); 

      animateMenuToggle(false);

      gsap.to(menuContent, {
        rotation: -15,
        x: -100,
        y: -100,
        scale: 1.5,
        opacity: 0.25,
        duration: 1.25,
        ease: "power4.inOut",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%,0% 0%)",
        duration: 1.25,
        ease: "power4.inOut",
        onComplete: () => {
          setIsOpen(false);
          setIsAnimating(false);
          gsap.set([".link a", ".social a"], { y: "120%" });
          resetPreviewImage();
        },
      });
    };

    const handleMenuToggle = () => {
      if (!isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    };

    // Add click event listener to menu toggle
    if (menuToggle) {
      menuToggle.addEventListener("click", handleMenuToggle);
    }

    // Add hover event listeners to menu links
    menuLinksRef.current.forEach((link) => {
      if (link) {
        link.addEventListener("mouseover", () => {
          if (!isOpen || isAnimating) return;

          const imgSrc = link.getAttribute("data-img");
          if (!imgSrc) return;

          const previewImages = menuPreviewImg.querySelectorAll("img");

          if (
            previewImages.length > 0 &&
            previewImages[previewImages.length - 1].src.endsWith(imgSrc)
          ) {
            return;
          }

          const newPreviewImg = document.createElement("img");
          newPreviewImg.src = imgSrc;
          newPreviewImg.style.opacity = "0";
          newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";

          menuPreviewImg.appendChild(newPreviewImg);
          cleanupPreviewImages();

          gsap.to(newPreviewImg, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.75,
            ease: "power2.out",
          });
        });
      }
    });

    // Cleanup function
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener("click", handleMenuToggle);
      }
    };
  }, [isOpen, isAnimating]);

  return (
    <div className="App">
      <nav>
        <div className="logo">
          <a href="#">Elegance</a>
        </div>
        <div className={`menu-toggle ${isOpen ? 'menu-open' : ''}`} ref={menuToggleRef}>
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="menu-text">
            <p id="menu-open">Menu</p>
            <p id="menu-close">Close</p>
          </div>
        </div>
      </nav>

      <div className="menu-overlay" ref={menuOverlayRef}>
        <div className="menu-content" ref={menuContentRef}>
          <div className="menu-items">
            <div className="col-lg">
              <div className="menu-preview-img" ref={menuPreviewImgRef}>
                <img src="/slide-img-1.jpg" alt="" />
              </div>
            </div>
            <div className="col-sm">
              <div className="menu-links">
                <div className="link">
                  <a href="#" data-img="/slide-img-1.jpg" ref={el => menuLinksRef.current[0] = el}>
                    Visions
                  </a>
                </div>
                <div className="link">
                  <a href="#" data-img="/slide-img-2.jpg" ref={el => menuLinksRef.current[1] = el}>
                    Core
                  </a>
                </div>
                <div className="link">
                  <a href="#" data-img="/slide-img-3.jpg" ref={el => menuLinksRef.current[2] = el}>
                    Signals
                  </a>
                </div>
                <div className="link">
                  <a href="#" data-img="/slide-img-4.jpg" ref={el => menuLinksRef.current[3] = el}>
                    Connect
                  </a>
                </div>
              </div>
              <div className="menu-socials">
                <div className="social">Instagram</div>
                <div className="social">Twitter</div>
                <div className="social">Github</div>
                <div className="social">Linkedin</div>
              </div>
            </div>
          </div>
          <div className="menu-footer">
            <div className="col-lg">
              <a href="#">Run Sequence</a>
            </div>
            <div className="col-sm">
              <a href="#">Origin</a>
              <a href="#">Join Signal</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container" ref={containerRef}>
        <Carousel />
        
        <section className="features">
          <div className="features-content">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>Pushing boundaries with cutting-edge digital solutions that transform the way we interact with technology.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <h3>Design</h3>
              <p>Creating intuitive and beautiful interfaces that seamlessly blend form and function.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3>Performance</h3>
              <p>Optimized solutions that deliver lightning-fast performance and exceptional user experiences.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App; 