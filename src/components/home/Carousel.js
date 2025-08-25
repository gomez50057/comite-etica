"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/home/Carousel.module.css";

const IMAGES = ["/img/Recurso 1.png", "/img/Recurso 2.png"];

export default function Carousel({
  ariaLabel = "Carrusel de imágenes",
  transitionMs = 420,
  dragThresholdPx = 60,
  loop = true,
  autoplayMs = 6000, // cada 6 segundos
}) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const dragRef = useRef({ startX: 0, dragging: false });
  const autoplayRef = useRef(null);
  const indexRef = useRef(index); // referencia al índice actual

  const total = IMAGES.length;

  // sincroniza el ref con el estado
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = (next) => {
    if (!loop) {
      const bounded = Math.max(0, Math.min(total - 1, next));
      setIndex(bounded);
      return;
    }
    const wrapped = (next + total) % total; // asegura loop
    setIndex(wrapped);
  };

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    goTo(indexRef.current + 1);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    goTo(indexRef.current - 1);
  };

  // Quitar animación después de terminar transición
  useEffect(() => {
    if (!isAnimating) return;
    const t = setTimeout(() => setIsAnimating(false), transitionMs);
    return () => clearTimeout(t);
  }, [isAnimating, transitionMs]);

  // Autoplay infinito
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      next();
    }, autoplayMs);

    return () => clearInterval(autoplayRef.current);
  }, [autoplayMs]);

  // Drag
  const onStart = (clientX) => {
    dragRef.current = { startX: clientX, dragging: true };
    setIsAnimating(false);
    clearInterval(autoplayRef.current); // pausa autoplay al arrastrar
  };

  const onMove = (clientX) => {
    if (!dragRef.current.dragging) return;
    const delta = clientX - dragRef.current.startX;
    setOffset(delta);
  };

  const onEnd = () => {
    if (!dragRef.current.dragging) return;
    const delta = offset;
    dragRef.current.dragging = false;
    setOffset(0);

    if (Math.abs(delta) > dragThresholdPx) {
      if (delta < 0) next();
      else prev();
    } else {
      setIsAnimating(true);
      const t = setTimeout(() => setIsAnimating(false), transitionMs);
      return () => clearTimeout(t);
    }

    // reanudar autoplay
    autoplayRef.current = setInterval(() => next(), autoplayMs);
  };

  // Eventos
  const handleMouseDown = (e) => onStart(e.clientX);
  const handleMouseMove = (e) => onMove(e.clientX);
  const handleMouseUp = () => onEnd();
  const handleMouseLeave = () => onEnd();

  const handleTouchStart = (e) => onStart(e.touches[0].clientX);
  const handleTouchMove = (e) => onMove(e.touches[0].clientX);
  const handleTouchEnd = () => onEnd();

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const translateX = `calc(${(-index * 100)}% + ${offset}px)`;

  return (
    <section
      className={styles.carousel}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`${styles.track} ${isAnimating ? styles.animate : ""}`}
        style={{
          transform: `translateX(${translateX})`,
          transitionDuration: `${transitionMs}ms`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {IMAGES.map((src, i) => (
          <div className={styles.slide} key={i}>
            <img
              className={styles.image}
              src={src}
              alt={`Slide ${i + 1}`}
              draggable="false"
            />
          </div>
        ))}
      </div>

      <button
        className={`${styles.navBtn} ${styles.prev}`}
        onClick={prev}
        type="button"
      >
        ‹
      </button>
      <button
        className={`${styles.navBtn} ${styles.next}`}
        onClick={next}
        type="button"
      >
        ›
      </button>

      <div className={styles.dots}>
        {IMAGES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => goTo(i)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
