"use client";

import styles from "@/styles/home/DualBanner.module.css";

export default function DualBanner({
  leftSrc = "/img/banner-left.png",
  rightSrc = "/img/banner-right.png",
  leftAlt = "Imagen izquierda",
  rightAlt = "Imagen derecha",
}) {
  return (
    <section className={styles.container}>
      <div className={styles.cardLeft}>
        <img
          src={leftSrc}
          alt={leftAlt}
          className={styles.image}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>

      <div className={styles.cardRight}>
        <img
          src={rightSrc}
          alt={rightAlt}
          className={styles.image}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
    </section>
  );
}
