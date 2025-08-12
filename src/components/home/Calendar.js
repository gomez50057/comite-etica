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
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      <div className={styles.legend}>
        <h3><span className="spanDoarado">Celebremos</span> la <span className="spanVino">Inclusión</span> y la <span className="spanVino">Ética</span> Todo el Año</h3>
        <p>
          Cada fecha es más que un día en el calendario: es una oportunidad para reflexionar,
          actuar y construir un mundo más justo.
        </p>
        <p>
          Desde el <strong>Día Mundial de la Ética</strong>, que nos invita a poner nuestros valores en acción,
          hasta jornadas dedicadas a la <strong>diversidad cultural</strong>, la <strong>no discriminación</strong>
          y la <strong>solidaridad</strong>, cada conmemoración nos recuerda que la verdadera transformación
          empieza en nuestras decisiones diarias.
        </p>
        <p>
          <strong>Marca estas fechas, compártelas y vívelas.</strong>
          La inclusión y la ética no son eventos aislados: son el camino hacia una sociedad
          donde todas las voces cuentan y cada persona importa.
        </p>
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