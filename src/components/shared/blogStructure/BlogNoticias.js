"use client";
import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import styles from "@/styles/blog/BlogNoticias.module.css";
import FeaturedPosts from "@/components/shared/blogStructure/FeaturedPosts";
import Link from "next/link";
import { normalizeName, renderDescription } from "@/utils/renderText";

const MAX_LENGTH = 120;

// Convierte description (string | array | object) a texto plano para poder recortar por caracteres
const toPlainText = (desc) => {
  if (!desc) return "";
  if (typeof desc === "string") return desc;

  // Si tu description es un array tipo [{ type:'p', text:'...' }, ...]
  if (Array.isArray(desc)) {
    return desc
      .map((block) => {
        if (!block) return "";
        if (typeof block === "string") return block;
        // intenta campos comunes
        return String(block.text ?? block.content ?? block.value ?? "");
      })
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  // Fallback para objetos
  try {
    return JSON.stringify(desc);
  } catch {
    return String(desc);
  }
};

const BlogNoticias = ({
  posts = [],
  featuredPosts = [],
  categoryFilters = [],
  nameLink = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [fadeEffect, setFadeEffect] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, []);

  const handleCategoryChange = useCallback((event) => {
    const nextValue = event.target.value;

    setFadeEffect(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setSelectedCategory(nextValue);
      setFadeEffect(false);
    }, 300);
  }, []);

  const filteredPosts = useMemo(() => {
    const safePosts = Array.isArray(posts) ? posts : [];

    if (selectedCategory === "ALL") return safePosts;

    const conf = categoryFilters.find((c) => c.value === selectedCategory);
    const matchValues = (conf?.matchValues?.length ? conf.matchValues : [selectedCategory]).map(
      (v) => String(v).trim()
    );

    return safePosts.filter((post) =>
      matchValues.includes(String(post?.category ?? "").trim())
    );
  }, [posts, selectedCategory, categoryFilters]);

  // Base de ruta para el detalle (compatibilidad con /hacks por defecto)
  const linkBase = useMemo(() => {
    const clean = String(nameLink || "").trim().replace(/^\/+|\/+$/g, "");
    return clean || "hacks";
  }, [nameLink]);

  return (
    <section className={styles.blogNoticias}>
      {/* Columna principal */}
      <section className={styles.newsSection}>
        <header className={styles.newsHeader}>
          <h2 className={styles.headerTitle}>
            <span>Blog | </span>
            <span className={styles.spanDoarado}>ConCiencia Público</span>
          </h2>

          <label htmlFor="catSelect" className={styles.srOnly}>
            Filtrar por categoría
          </label>

          <select
            id="catSelect"
            className={styles.orderSelect}
            onChange={handleCategoryChange}
            value={selectedCategory}
            aria-label="Filtrar por categoría"
          >
            {categoryFilters.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </header>

        <div className={`${styles.newsGrid} ${fadeEffect ? styles.fadeOut : styles.fadeIn}`}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => {
              const slug = normalizeName(post?.name ?? "");
              const href = `/${linkBase}/${slug}`;

              const plain = toPlainText(post?.description);
              const preview = plain.length > MAX_LENGTH ? `${plain.slice(0, MAX_LENGTH)}...` : plain;

              return (
                <article key={`${post?.name ?? "post"}-${index}`} className={styles.newsItem}>
                  {post?.image && (
                    <img
                      src={post.image}
                      alt={post.name}
                      className={styles.newsImage}
                      loading="lazy"
                      decoding="async"
                    />
                  )}

                  <div className={styles.newsContent}>
                    <p className={styles.newsMeta}>
                      {post?.category} · <time dateTime={post?.date}>{post?.date}</time>
                    </p>

                    <h3 className={styles.newsTitle}>{post?.name}</h3>

                    <div className={styles.newsDescription}>
                      {renderDescription(preview)}
                    </div>
                  </div>

                  <Link
                    href={href}
                    className={styles.readMoreBtn}
                    aria-label={`Leer más sobre: ${post?.name ?? "publicación"}`}
                  >
                    Leer más
                  </Link>
                </article>
              );
            })
          ) : (
            <p className={styles.noResults}>No se encontraron publicaciones para esta categoría.</p>
          )}
        </div>
      </section>

      {/* Sidebar (destacadas) */}
      <aside className={styles.sidebar} aria-label="Publicaciones destacadas">
        <FeaturedPosts featuredPosts={featuredPosts} nameLink={linkBase} />
      </aside>
    </section>
  );
};

export default BlogNoticias;