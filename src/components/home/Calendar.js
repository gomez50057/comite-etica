"use client";

import { useMemo, useState } from "react";
import styles from "@/styles/home/Calendar.module.css";
import { eventos } from "@/utils/calendarEvents";

export default function Calendar({ events, initialDate = new Date() }) {
  const [viewDate, setViewDate] = useState(new Date(initialDate));
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  const locale = "es-MX";

  // Recurrentes mensuales (día 9 y 25 de cada mes)
  const monthlyEvents = useMemo(() => {
    const year = viewDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, m) => m);
    const recurring = [
      { day: 25, title: "Día internacional para erradicación de la violencia contra la mujer", color: "#FFB3BA" },
      { day: 9, title: "Día por la integridad", color: "#B3E6FF" },
    ];
    const generated = [];
    months.forEach((m) => {
      recurring.forEach((r) => {
        const date = new Date(year, m, r.day);
        if (date.getMonth() === m) {
          generated.push({ date: formatKey(date), title: r.title, color: r.color });
        }
      });
    });
    return generated;
  }, [viewDate]);

  const defaultEvents = useMemo(() => [...eventos, ...monthlyEvents], [eventos, monthlyEvents]);
  const resolvedEvents = Array.isArray(events) && events.length ? events : defaultEvents;

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of resolvedEvents) {
      if (!ev?.date) continue;
      const key = ev.date; // YYYY-MM-DD
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return map;
  }, [resolvedEvents]);

  const monthMatrix = useMemo(() => buildMonthMatrix(viewDate), [viewDate]);

  const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

  const weekDays = startOfWeek(viewDate).map((d) => capitalize(weekdayFormatter.format(d)).replace(".", ""));

  const todayKey = formatKey(new Date());

  function go(deltaMonths) {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + deltaMonths);
    setViewDate(d);
  }

  function openDayPanel(key) {
    if (eventsByDay.has(key)) setSelectedDayKey(key);
  }

  function closeDayPanel() { setSelectedDayKey(null); }

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <button className={styles.navBtn} onClick={() => go(-1)} aria-label="Mes anterior">←</button>
          <h2 className={styles.monthTitle}>{capitalize(monthFormatter.format(viewDate))}</h2>
          <button className={styles.navBtn} onClick={() => go(1)} aria-label="Mes siguiente">→</button>
          <button className={styles.todayBtn} onClick={() => setViewDate(new Date())}>Hoy</button>
        </header>

        <div className={styles.calendar} role="grid" aria-label="Calendario mensual">
          <div className={styles.weekHeader} role="row">
            {weekDays.map((wd) => (
              <div className={styles.weekDay} role="columnheader" key={wd}>{wd}</div>
            ))}
          </div>

          <div className={styles.grid}>
            {monthMatrix.map((day) => {
              const key = formatKey(day.date);
              const isToday = key === todayKey;
              const inMonth = day.inCurrentMonth;
              const dayEvents = eventsByDay.get(key) || [];

              return (
                <button
                  key={key}
                  className={[
                    styles.cell,
                    !inMonth && styles.outMonth,
                    isToday && styles.today,
                    dayEvents.length > 0 && styles.hasEvents,
                  ].filter(Boolean).join(" ")}
                  onClick={() => openDayPanel(key)}
                  onMouseEnter={(e) => {
                    if (dayEvents.length > 0) {
                      const tip = e.currentTarget.querySelector(`.${styles.tooltip}`);
                      if (tip) tip.setAttribute("data-visible", "true");
                    }
                  }}
                  onMouseLeave={(e) => {
                    const tip = e.currentTarget.querySelector(`.${styles.tooltip}`);
                    if (tip) tip.removeAttribute("data-visible");
                  }}
                  aria-label={`${key}${dayEvents.length ? `, ${dayEvents.length} evento(s)` : ""}`}
                >
                  <span className={styles.dayNumber}>{day.date.getDate()}</span>

                  {dayEvents.length > 0 && (
                    <div className={styles.dots}>
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <span key={i} className={styles.dot} style={{ backgroundColor: ev.color || "var(--acc)" }} title={ev.title} />
                      ))}
                      {dayEvents.length > 3 && <span className={styles.more}>+{dayEvents.length - 3}</span>}
                    </div>
                  )}

                  {dayEvents.length > 0 && (
                    <div className={styles.tooltip} role="tooltip">
                      {dayEvents.slice(0, 3).map((ev, i) => (
                        <div key={i} className={styles.tipItem}>
                          <span className={styles.tipDot} style={{ backgroundColor: ev.color || "var(--acc)" }} />
                          <span className={styles.tipText}>{ev.title}</span>
                        </div>
                      ))}
                      {dayEvents.length > 3 && <div className={styles.tipMore}>y {dayEvents.length - 3} más…</div>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDayKey && (
          <aside className={styles.sidePanel} aria-live="polite">
            <div className={styles.sideHeader}>
              <strong className={styles.sideTitle}>{formatHuman(selectedDayKey, locale)}</strong>
              <button className={styles.closeBtn} onClick={closeDayPanel} aria-label="Cerrar">✕</button>
            </div>
            <ul className={styles.eventList}>
              {(eventsByDay.get(selectedDayKey) || []).map((ev, i) => (
                <li key={i} className={styles.eventItem}>
                  <span className={styles.eventBullet} style={{ backgroundColor: ev.color || "var(--acc)" }} />
                  <span className={styles.eventTitle}>{ev.title}</span>

                  {/* Acciones por evento */}
                  <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}>
                    <a
                      href={buildGoogleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Agregar a Google Calendar"
                      title="Agregar a Google Calendar"
                      style={{
                        textDecoration: "none",
                        fontSize: ".8rem",
                        padding: ".3rem .5rem",
                        borderRadius: "8px",
                        border: "1px solid var(--glass-border)",
                        background: "var(--glass-card)",
                      }}
                    >
                      Google
                    </a>
                    <button
                      onClick={() => downloadICS(ev)}
                      aria-label="Descargar archivo .ics para Apple Calendar"
                      title="Agregar a Apple/iOS (ICS)"
                      style={{
                        fontSize: ".8rem",
                        padding: ".3rem .5rem",
                        borderRadius: "8px",
                        border: "1px solid var(--glass-border)",
                        background: "var(--glass-card)",
                        cursor: "pointer",
                      }}
                    >
                      iOS
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* -------- Leyenda + Acciones para TODO el calendario -------- */}
      <div className={styles.legend}>
        <h3><span className="spanDoarado">Celebremos</span> la <span className="spanVino">Inclusión</span> y la <span className="spanVino">Ética</span> Todo el Año</h3>
        <p>
          Cada fecha es más que un día en el calendario: es una oportunidad para reflexionar,
          actuar y construir un mundo más justo.
        </p>
        <p>
          <strong>Marca estas fechas, compártelas y vívelas.</strong>
          La inclusión y la ética no son eventos aislados: son el camino hacia una sociedad
          donde todas las voces cuentan y cada persona importa.
        </p>

        <div className={styles.legendActionsRow}>
          <button
            onClick={() => downloadAllICS(resolvedEvents)}
            aria-label="Descargar .ics con todos los eventos"
            title="Descargar .ics (Apple/Outlook/iOS/macOS)"
            className={styles.legendButton}
          >
            Descargar .ics (todos)
          </button>
        </div>


        <small className={styles.legendNote}>
          {resolvedEvents.length} eventos en total · El archivo en formato <strong>.ics</strong> es compatible con la mayoría de calendarios
          (Google Calendar, Apple Calendar en iOS/macOS, Outlook y otros).
          Al exportar, podrás abrirlo directamente o importarlo en tu aplicación de calendario preferida.
        </small>
      </div>
    </section>
  );
}

/* ---------------- Helpers ---------------- */
function buildMonthMatrix(anchorDate) {
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7; // 0=Lunes … 6=Domingo
  const start = new Date(year, month, 1 - firstWeekday);

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({ date: d, inCurrentMonth: d.getMonth() === month });
  }
  return days;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Lunes=0
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return x;
  });
}

function formatKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatHuman(key, locale) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

/* -------- Add to Calendar helpers (Google & iOS/ICS) -------- */

/** Convierte "YYYY-MM-DD" a "YYYYMMDD" (todo el día). */
function ymdCompact(dateStr) {
  return dateStr.replaceAll("-", "");
}

/** Suma n días a "YYYY-MM-DD" y devuelve "YYYYMMDD". */
function addDaysCompact(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  const y2 = dt.getFullYear();
  const m2 = String(dt.getMonth() + 1).padStart(2, "0");
  const d2 = String(dt.getDate()).padStart(2, "0");
  return `${y2}${m2}${d2}`;
}

/** URL de Google Calendar para evento de TODO EL DÍA. */
function buildGoogleCalendarUrl(ev) {
  const title = encodeURIComponent(ev.title || "Evento");
  const start = ymdCompact(ev.date);
  const end = addDaysCompact(ev.date, 1); // fin exclusivo
  const details = encodeURIComponent("Añadido desde el calendario del comité.");
  const location = ""; // si tienes ubicación, colócala aquí
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/** ICS de un solo evento (todo el día). */
function buildICS(ev) {
  const uid = `${ev.date}-${slugify(ev.title)}@comite-ethics`;
  const dtstamp = toIcsTimestamp(new Date());
  const dtstart = ymdCompact(ev.date);
  const dtend = addDaysCompact(ev.date, 1);
  const summary = escapeICS(ev.title || "Evento");
  const description = escapeICS("Añadido desde el calendario del comité.");

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
  ].join("\r\n");
}

/** Descarga .ics de 1 evento. */
function downloadICS(ev) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Comité de Ética//Calendario//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    buildICS(ev),
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = `${slugify(ev.title || "evento")}-${ev.date}.ics`;
  a.href = url;
  a.download = safeName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Construye un ICS con TODOS los eventos (dedup por fecha+titulo). */
function buildICSAll(events) {
  const seen = new Set();
  const vevents = [];
  for (const ev of events) {
    if (!ev?.date || !ev?.title) continue;
    const key = `${ev.date}::${ev.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    vevents.push(buildICS(ev));
  }
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Comité de Ética//Calendario completo//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...vevents,
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Descarga .ics con TODOS los eventos. */
function downloadAllICS(events) {
  const ics = buildICSAll(events);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `calendario-comite.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* -------- Utilidades ICS -------- */
function toIcsTimestamp(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

function slugify(str) {
  return String(str)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeICS(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
