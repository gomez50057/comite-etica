"use client";

import styles from "@/styles/home/CampaignTripleSpread.module.css";

export default function CampaignTripleSpread({
  leftPosterSrc = "/img/poster-vertical-1.png",
  leftPosterAlt = "Póster vertical 1",
  centerPosterSrc = "/img/poster-vertical-2.png",
  centerPosterAlt = "Póster vertical 2",
  rightWideSrc = "/img/poster-horizontal.png",
  rightWideAlt = "Póster horizontal",
  linkHref = "/blog",
  linkTarget = "_blank",
}) {
  return (
    <section className={styles.frame}>
      <div className={styles.inner}>
        {/* Texto izquierdo */}
        <div className={styles.textCard}>
          <p className={styles.paragraph}>
            La <strong>Comisión de Capacitación y Sensibilización</strong> del Comité de Ética y
            Prevención de Conflictos de Interés de la Unidad de Planeación y Prospectiva realizó
            una convocatoria de infografías para visibilizar y prevenir la violencia laboral,
            <em> promoviendo una cultura de integridad, respeto y transparencia como esfuerzo colectivo.</em>
          </p>
        </div>

        <div className={styles.gallery}>
          <div className={styles.posterTallWrap}>
            <a
              href={linkHref}
              target={linkTarget}
              rel="noopener noreferrer"
              className={styles.posterLink}
              aria-label="Abrir imagen relacionada"
              title="Abrir imagen"
            >
              <img
                src={leftPosterSrc}
                alt={leftPosterAlt}
                className={styles.posterTall}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </a>
          </div>

          <div className={`${styles.posterTallWrap} ${styles.narrow}`}>
            <a
              href={linkHref}
              target={linkTarget}
              rel="noopener noreferrer"
              className={styles.posterLink}
              aria-label="Abrir imagen relacionada"
              title="Abrir imagen"
            >
              <img
                src={centerPosterSrc}
                alt={centerPosterAlt}
                className={styles.posterTall}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </a>
          </div>

          <div className={styles.posterWideWrap}>
            <a
              href={linkHref}
              target={linkTarget}
              rel="noopener noreferrer"
              className={styles.posterLink}
              aria-label="Abrir imagen relacionada"
              title="Abrir imagen"
            >
              <img
                src={rightWideSrc}
                alt={rightWideAlt}
                className={styles.posterWide}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
