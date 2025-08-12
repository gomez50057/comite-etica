"use client";
import { useState, useEffect } from "react";
import styles from "./BlogHeader.module.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Link from "next/link";
import { normalizeName, items } from "../../utils/blogData";

const BlogHeader = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [manualChange, setManualChange] = useState(false);

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [activeIndex]);

  useEffect(() => {
    if (!manualChange) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [manualChange]);

  const handleNext = () => {
    setManualChange(true);
    setActiveIndex((prev) => (prev + 1) % items.length);
    restartAutoAdvance();
  };

  const handlePrev = () => {
    setManualChange(true);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    restartAutoAdvance();
  };

  const restartAutoAdvance = () => {
    setManualChange(false);
  };

  const getNextIndex = (index, offset) => {
    return (index + offset) % items.length;
  };

  const handlePreviewClick = (index) => {
    setManualChange(true);
    setActiveIndex(index);
    restartAutoAdvance();
  };

  return (
    <div
      className={`${styles.container}`}
      style={{ backgroundImage: `url(${items[activeIndex].bg})` }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div
          key={`${animationKey}-name`}
          className={`${styles.name} ${styles.textAnimation} delay-1`}
        >
          {items[activeIndex].name}
        </div>
        <div
          key={`${animationKey}-des`}
          className={`${styles.des} ${styles.textAnimation} delay-2`}
        >
          {items[activeIndex].des}
        </div>
        <Link href={`/noticias/${normalizeName(items[activeIndex].name)}`} passHref>
          <button
            key={`${animationKey}-button`}
            className={`${styles.textAnimation} delay-3`}
          >
            Leer más
          </button>
        </Link>
      </div>
      <div className={styles.previewContainer}>
        {Array(2)
          .fill(null)
          .map((_, offset) => {
            const nextIndex = getNextIndex(activeIndex, offset + 1);
            return (
              <div
                key={nextIndex}
                className={`${styles.previewItem} ${styles.slideAnimation}`}
                style={{ backgroundImage: `url(${items[nextIndex].bg})` }}
                onClick={() => handlePreviewClick(nextIndex)}
              ></div>
            );
          })}
      </div>
      <div className={styles.button}>
        <button className={styles.prevButton} onClick={handlePrev}>
          <ArrowBackIos />
        </button>
        <button className={styles.nextButton} onClick={handleNext}>
          <ArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default BlogHeader;
