"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./BlogHeader.module.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Link from "next/link";
import { normalizeName, items } from "@/utils/blogData";

const BlogHeader = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [manualChange, setManualChange] = useState(false);

  // swipe refs
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const SWIPE_THRESHOLD = 40; // px

  useEffect(() => {
    setAnimationKey((k) => k + 1);
  }, [activeIndex]);

  // auto-advance (pausa si hubo cambio manual breve)
  useEffect(() => {
    if (!manualChange) {
      const id = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 6000);
      return () => clearInterval(id);
    }
  }, [manualChange]);

  const restartAutoAdvance = () => setManualChange(false);

  const handleNext = useCallback(() => {
    setManualChange(true);
    setActiveIndex((prev) => (prev + 1) % items.length);
    restartAutoAdvance();
  }, []);

  const handlePrev = useCallback(() => {
    setManualChange(true);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    restartAutoAdvance();
  }, []);

  const getNextIndex = (index, offset) => (index + offset) % items.length;

  const handlePreviewClick = (index) => {
    setManualChange(true);
    setActiveIndex(index);
    restartAutoAdvance();
  };

  // accesibilidad: teclado ← →
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  // gestos táctiles
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      className={styles.container}
      style={{ backgroundImage: `url(${items[activeIndex].bg})` }}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Encabezado de blog con carrusel"
      aria-live="polite"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1
          key={`${animationKey}-name`}
          className={`${styles.name} ${styles.textAnimation} delay-1`}
        >
          {items[activeIndex].name}
        </h1>

        <p
          key={`${animationKey}-des`}
          className={`${styles.des} ${styles.textAnimation} delay-2`}
        >
          {items[activeIndex].des}
        </p>

        <Link href={`/blog/${normalizeName(items[activeIndex].name)}`} passHref>
          <button
            key={`${animationKey}-button`}
            className={`${styles.ctaBtn} ${styles.textAnimation} delay-3`}
            aria-label={`Leer más: ${items[activeIndex].name}`}
          >
            Leer más
          </button>
        </Link>
      </div>

      <div className={styles.previewContainer} aria-hidden="true">
        {Array(2)
          .fill(null)
          .map((_, offset) => {
            const nextIndex = getNextIndex(activeIndex, offset + 1);
            return (
              <button
                key={nextIndex}
                className={`${styles.previewItem} ${styles.slideAnimation}`}
                style={{ backgroundImage: `url(${items[nextIndex].bg})` }}
                onClick={() => handlePreviewClick(nextIndex)}
                aria-label={`Ir a: ${items[nextIndex].name}`}
              />
            );
          })}
      </div>

      <div className={styles.navButtons}>
        <button className={styles.prevButton} onClick={handlePrev} aria-label="Anterior">
          <ArrowBackIos fontSize="inherit" />
        </button>
        <button className={styles.nextButton} onClick={handleNext} aria-label="Siguiente">
          <ArrowForwardIos fontSize="inherit" />
        </button>
      </div>
    </section>
  );
};

export default BlogHeader;
