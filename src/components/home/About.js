"use client";

import React from "react";
import styles from "@/styles/home/About.module.css";

export default function About() {
  return (
    <section className={styles.container}>
      {/* Imagen a la izquierda */}
      <div className={styles.imageContainer}>
        <img
          src="/img/about-image.png"
          alt="Ilustración ConCiencia Pública"
          className={styles.image}
        />
      </div>

      {/* Texto a la derecha */}
      <div className={styles.textContainer}>
        <span className={styles.bienvenida}>Bienvenido a </span>
        <h2><span className="spanDoarado">ConCiencia</span>  <span className="spanvino">Pública</span> </h2>
        <p className={styles.description}>
          En ConCiencia Pública impulsamos una administración pública ética y transparente mediante contenido dinámico e informativo. Nuestra misión es generar una cultura comprometida con la integridad y responsabilidad social, ofreciendo recursos prácticos y educativos que promuevan valores esenciales para una mejor gestión pública.
        </p>
      </div>
    </section>
  );
}
