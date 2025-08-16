import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Carousel = () => {
  const sliderRef = useRef(null);
  const mainImageContainerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const descriptionContainerRef = useRef(null);
  const counterContainerRef = useRef(null);
  
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollAllowed, setScrollAllowed] = useState(true);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const totalSlides = 7;

  const slideTitles = [
    "Field Unit",
    "Astral Convergence", 
    "Eclipse Core",
    "Luminous",
    "Serenity",
    "Nebula Point",
    "Horizon",
  ];

  const slideDescriptions = [
    "Concept Art",
    "Soundscape",
    "Experimental Film", 
    "Editorial",
    "Music Video",
    "VFX",
    "Set Design",
  ];

  const slideImages = [
    "/slider_img_01.jpg",
    "/slider_img_02.jpg", 
    "/slider_img_03.jpg",
    "/slider_img_04.jpg",
    "/slider_img_05.jpg",
    "/slider_img_06.jpg",
    "/slider_img_07.jpg",
  ];

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = slideImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => reject(src);
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to load:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, []);

  const createSlide = (slideNumber, direction) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    const slideBgImg = document.createElement("div");
    slideBgImg.className = "slide-bg-img";

    const img = document.createElement("img");
    img.src = slideImages[slideNumber - 1];
    img.alt = "";

    slideBgImg.appendChild(img);
    slide.appendChild(slideBgImg);

    if (direction === "down") {
      slideBgImg.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
    } else {
      slideBgImg.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
    }

    return slide;
  };

  const createMainImageWrapper = (slideNumber, direction) => {
    const wrapper = document.createElement("div");
    wrapper.className = "slide-main-img-wrapper";

    const img = document.createElement("img");
    img.src = slideImages[slideNumber - 1];
    img.alt = "";

    wrapper.appendChild(img);

    if (direction === "down") {
      wrapper.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
    } else {
      wrapper.style.clipPath = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
    }

    return wrapper;
  };

  const createTextElements = (slideNumber, direction) => {
    const newTitle = document.createElement("h1");
    newTitle.textContent = slideTitles[slideNumber - 1];
    gsap.set(newTitle, {
      y: direction === "down" ? 50 : -50,
    });

    const newDescription = document.createElement("p");
    newDescription.textContent = slideDescriptions[slideNumber - 1];
    gsap.set(newDescription, {
      y: direction === "down" ? 20 : -20,
    });

    const newCounter = document.createElement("p");
    newCounter.textContent = slideNumber;
    gsap.set(newCounter, {
      y: direction === "down" ? 18 : -18,
    });

    return { newTitle, newDescription, newCounter };
  };

  const animateSlide = (direction) => {
    if (isAnimating || !scrollAllowed || !imagesLoaded) return;

    setIsAnimating(true);
    setScrollAllowed(false);

    const slider = sliderRef.current;
    const currentSlideElement = slider.querySelector(".slide");
    const mainImageContainer = mainImageContainerRef.current;
    const currentMainWrapper = mainImageContainer.querySelector(".slide-main-img-wrapper");

    const titleContainer = titleContainerRef.current;
    const descriptionContainer = descriptionContainerRef.current;
    const counterContainer = counterContainerRef.current;

    const currentTitle = titleContainer.querySelector("h1");
    const currentDescription = descriptionContainer.querySelector("p");
    const currentCounter = counterContainer.querySelector("p");

    let newSlideNumber;
    if (direction === "down") {
      newSlideNumber = currentSlide === totalSlides ? 1 : currentSlide + 1;
    } else {
      newSlideNumber = currentSlide === 1 ? totalSlides : currentSlide - 1;
    }

    setCurrentSlide(newSlideNumber);

    const newSlide = createSlide(newSlideNumber, direction);
    const newMainWrapper = createMainImageWrapper(newSlideNumber, direction);
    const { newTitle, newDescription, newCounter } = createTextElements(newSlideNumber, direction);

    slider.appendChild(newSlide);
    mainImageContainer.appendChild(newMainWrapper);
    titleContainer.appendChild(newTitle);
    descriptionContainer.appendChild(newDescription);
    counterContainer.appendChild(newCounter);

    gsap.set(newMainWrapper.querySelector("img"), {
      y: direction === "down" ? "-50%" : "50%",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        [
          currentSlideElement,
          currentMainWrapper,
          currentTitle,
          currentDescription,
          currentCounter,
        ].forEach((el) => el?.remove());

        setIsAnimating(false);
        setTimeout(() => {
          setScrollAllowed(true);
          setLastScrollTime(Date.now());
        }, 100);
      },
    });

    tl.to(
      newSlide.querySelector(".slide-bg-img"),
      {
        clipPath:
          direction === "down"
            ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.25,
        ease: "power2.inOut",
      },
      0
    )
      .to(
        currentSlideElement.querySelector("img"),
        {
          scale: 1.5,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        newMainWrapper,
        {
          clipPath:
            direction === "down"
              ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
              : "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        currentMainWrapper.querySelector("img"),
        {
          y: direction === "down" ? "50%" : "-50%",
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        newMainWrapper.querySelector("img"),
        {
          y: "0%",
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        currentTitle,
        {
          y: direction === "down" ? -50 : 50,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        newTitle,
        {
          y: 0,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        currentDescription,
        {
          y: direction === "down" ? -20 : 20,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        newDescription,
        {
          y: 0,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        currentCounter,
        {
          y: direction === "down" ? -18 : 18,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        newCounter,
        {
          y: 0,
          duration: 1.25,
          ease: "power2.inOut",
        },
        0
      );
  };

  const handleScroll = (direction) => {
    const now = Date.now();
    if (isAnimating || !scrollAllowed || !imagesLoaded) return;
    if (now - lastScrollTime < 1000) return;
    setLastScrollTime(now);
    animateSlide(direction);
  };

  useEffect(() => {
    if (!imagesLoaded) return; // Don't add event listeners until images are loaded

    const handleWheel = (e) => {
      e.preventDefault();
      const direction = e.deltaY > 0 ? "down" : "up";
      handleScroll(direction);
    };

    let touchStartY = 0;
    let isTouchActive = false;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      isTouchActive = true;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isTouchActive || isAnimating || !scrollAllowed || !imagesLoaded) return;
      const touchCurrentY = e.touches[0].clientY;
      const difference = touchStartY - touchCurrentY;
      if (Math.abs(difference) > 10) {
        isTouchActive = false;
        const direction = difference > 0 ? "down" : "up";
        handleScroll(direction);
      }
    };

    const handleTouchEnd = () => {
      isTouchActive = false;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isAnimating, scrollAllowed, lastScrollTime, imagesLoaded]);

  // Show loading state
  if (!imagesLoaded) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <p>Loading carousel...</p>
      </div>
    );
  }

  return (
    <>
      <footer>
        <p>All Projects</p>
        <div className="slider-counter">
          <div className="count" ref={counterContainerRef}>
            <p>1</p>
          </div>
          <p>/</p>
          <p>{totalSlides}</p>
        </div>
      </footer>
      
      <div className="slider" ref={sliderRef}>
        <div className="slide">
          <div className="slide-bg-img">
            <img src={slideImages[0]} alt="" />
          </div>
        </div>

        <div className="slide-main-img" ref={mainImageContainerRef}>
          <div className="slide-main-img-wrapper">
            <img src={slideImages[0]} alt="" />
          </div>
        </div>

        <div className="slide-copy">
          <div className="slide-title" ref={titleContainerRef}>
            <h1>{slideTitles[0]}</h1>
          </div>
          <div className="slide-description" ref={descriptionContainerRef}>
            <p>{slideDescriptions[0]}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousel; 