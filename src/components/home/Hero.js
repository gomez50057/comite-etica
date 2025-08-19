"use client";

import React from "react";
import styles from "@/styles/home/Hero.module.css";

export default function Hero({
  logoSrc = "/img/conciencia-publica-logo.png",
  sideImageSrc = "/img/conciencia-publica-icon.png",
  imgRight = "/img/r.png",
  imgCenter = "/img/c.png",
  imgLeft = "/img/l.png",
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <img
            src={logoSrc}
            alt="ConCiencia Pública · Planeación Transparente"
            className={styles.logo}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className={styles.right}>
          <img
            src={sideImageSrc}
            alt="Ícono ConCiencia Pública"
            className={styles.sideImage}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      <div className={styles.imgContainer}>
        <div className={styles.imgLeft}>
          <img src={imgLeft} alt="Imagen Izquierda" className={styles.imgLaterales} loading="eager" decoding="async" />
        </div>

        <div className={styles.imgCenter}>
          <img src={imgCenter} alt="Imagen Central" className={styles.imgCentral} loading="eager" decoding="async" />
        </div>

        <div className={styles.imgRight}>
          <img src={imgRight} alt="Imagen Derecha" className={styles.imgLaterales} loading="eager" decoding="async" />
        </div>
      </div>
    </section>
  );
}
