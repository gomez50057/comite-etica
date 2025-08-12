"use client";

import React from "react";
import styles from "@/styles/home/Hero.module.css";

/**
 * Hero de ConCiencia Pública
 * - logoSrc: ruta al logo (izquierda)
 * - sideImageSrc: ruta a la imagen (derecha)
 * - tickerItems: array de textos para el carrusel inferior
 */
export default function Hero({
  logoSrc = "/img/conciencia-publica-logo.png",
  sideImageSrc = "/img/conciencia-publica-icon.png",
  tickerItems = ["Desde nuestra plataforma, buscamos llegar a miles de funcionarios comprometidos con la ética y el bienestar social.", "Porque cada acción cuenta para transformar la administración pública desde cualquier lugar.", "Una sola comunidad, miles de soluciones éticas.", "De la teoría a la práctica: contenidos que se viven, no solo se leen"],
}) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          {/* Logo completo como imagen */}
          <img
            src={logoSrc}
            alt="ConCiencia Pública · Planeación Transparente"
            className={styles.logo}
            loading="eager"
          />
        </div>

        <div className={styles.right}>
          {/* Imagen de la derecha */}
          <img
            src={sideImageSrc}
            alt="Ícono ConCiencia Pública"
            className={styles.sideImage}
            loading="eager"
          />
        </div>
      </div>

      {/* Barra inferior con carrusel infinito */}
      <div className={styles.tickerBar} aria-hidden="false">
        <div className={styles.tickerTrack}>
          <ul className={styles.tickerList}>
            {tickerItems.map((txt, i) => (
              <li key={`a-${i}`} className={styles.tickerItem}>
                {txt}
              </li>
            ))}
            {/* duplicado para loop perfecto */}
            {tickerItems.map((txt, i) => (
              <li key={`b-${i}`} className={styles.tickerItem}>
                {txt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
