"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./Team.module.css";

gsap.registerPlugin(ScrollTrigger);
const Team = ({ teamName, teamSubName, teamMembers = [] }) => {
  const teamRef = useRef(null);

  useEffect(() => {
    if (!teamRef.current || typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduce) return;

    const cards = teamRef.current.querySelectorAll(`.${styles.card}`);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section ref={teamRef} className={styles.wrapper} aria-label={teamName || "Equipo"}>
      {teamName && <h2 className={styles.title}>{teamName}</h2>}
      {teamSubName && <h3 className={styles.subtitle}>{teamSubName}</h3>}

      <div className={styles.grid}>
        {teamMembers.map((m, i) => (
          <article key={`${m.name}-${i}`} className={styles.card}>
            {/* MARCO AZUL */}
            <div className={styles.frame}>
              {/* “VENTANA” CUADRADA INTERNA */}
              <div className={styles.window}>
                <img
                  src={m.image}
                  alt={`Fotografía de ${m.name}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* PIE AZUL */}
              <footer className={styles.footer}>
                <div className={styles.role}>{m.role}</div>
                <div className={styles.name}>{m.name}</div>
                {m.email && (
                  <a
                    href={`mailto:${m.email}`}
                    className={styles.email}
                    aria-label={`Enviar correo a ${m.name}`}
                  >
                    {m.email}
                  </a>
                )}
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Team;
