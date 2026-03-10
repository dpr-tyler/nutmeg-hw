import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, ExternalLink } from "lucide-react";
import { getGoogleMapsUrl } from "../utils/mapsUrl";
import ImageLightbox from "./ImageLightbox";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function CrowdBar({ level }) {
  const pct = (level / 3) * 100;
  const colors = {
    1: "#4ade80",
    2: "var(--sand)",
    3: "var(--coral)",
  };
  return (
    <div className="crowd-bar" style={{ width: "80px" }}>
      <div
        className="crowd-bar-fill"
        style={{ width: `${pct}%`, background: colors[level] }}
      />
    </div>
  );
}

export function BeachCard({
  beach,
  onImageClick,
  compact = false,
  contentOnly = false,
}) {
  const { t } = useTranslation();
  const padding = compact ? "p-4" : "p-6";
  const gap = compact ? "gap-3" : "gap-4";

  const content = (
    <div className={`${padding} flex flex-col ${gap} flex-1`}>
      {/* Thumbnail + content row */}
      <div className="flex gap-4">
        {beach.photo && (
          <img
            src={beach.photo}
            alt={beach.name}
            {...(!compact && {
              onClick: () => onImageClick?.(beach.photo, beach.name),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onImageClick?.(beach.photo, beach.name);
                }
              },
              role: "button",
              tabIndex: 0,
              "aria-label": t("ui.aria.viewFullSizePhoto", { name: beach.name }),
              style: { width: 72, height: 72, cursor: "zoom-in" },
            })}
            className="rounded-2xl object-cover flex-shrink-0"
            style={{ width: compact ? 56 : 72, height: compact ? 56 : 72 }}
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className="font-display text-xl leading-snug"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--ink)",
                  fontWeight: 600,
                }}
              >
                {beach.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} color="var(--coral)" />
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--ink)",
                    opacity: 0.5,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {beach.location}
                </span>
              </div>
              <a
                href={
                  beach.mapUrl || getGoogleMapsUrl(beach.name, beach.location)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 hover:opacity-80 transition-opacity"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--ocean)",
                  fontFamily: "var(--font-mono)",
                  textDecoration: "underline",
                }}
                aria-label={`${t("beaches.viewOnMap")} - ${beach.name}`}
              >
                <ExternalLink size={12} />
                {t("beaches.viewOnMap")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          color: "var(--ink)",
          opacity: 0.72,
          fontSize: "0.875rem",
          lineHeight: 1.7,
          flex: 1,
        }}
      >
        {beach.desc}
      </p>

      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background: "var(--mist-card)",
          border: "1px solid var(--mist-card-border)",
        }}
      >
        <div>
          <span
            className="text-xs uppercase tracking-widest block mb-1"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ocean)",
              opacity: 0.6,
              letterSpacing: "0.12em",
            }}
          >
            {t("beaches.bestFor")}
          </span>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--ink)",
              opacity: 0.75,
              lineHeight: 1.5,
            }}
          >
            {beach.bestFor}
          </p>
        </div>
        <div>
          <span
            className="text-xs uppercase tracking-widest block mb-1.5"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ocean)",
              opacity: 0.6,
              letterSpacing: "0.12em",
            }}
          >
            {t("beaches.crowdLevel")}
          </span>
          <CrowdBar level={beach.crowd} />
        </div>
      </div>
    </div>
  );

  if (contentOnly) {
    return content;
  }

  return (
    <motion.div
      variants={compact ? {} : fadeUp}
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: "#FAFAFA",
        border: "2px solid var(--card-border)",
      }}
    >
      {content}
    </motion.div>
  );
}

export default function BeachGuide() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [lightbox, setLightbox] = useState({ url: null, alt: "" });

  const beaches = t("beaches.list", { returnObjects: true });

  return (
    <section
      id="beaches"
      ref={ref}
      className="py-24 px-6"
      style={{ background: "var(--mist)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeUp} className="mb-16 text-center">
            <span
              className="inline-block text-xs tracking-widest uppercase mb-4"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--coral)",
                letterSpacing: "0.2em",
              }}
            >
              {t("ui.sectionEyebrows.beaches")}
            </span>
            <h2
              className="font-display mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                color: "var(--ocean)",
                lineHeight: 1.1,
              }}
            >
              {t("beaches.title")}
            </h2>
            <p
              style={{
                color: "var(--ink)",
                opacity: 0.6,
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              {t("beaches.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(beaches) &&
              beaches.map((beach) => (
                <BeachCard
                  key={beach.name}
                  beach={beach}
                  onImageClick={(photo, name) =>
                    setLightbox({ url: photo, alt: name })
                  }
                />
              ))}
          </div>
        </motion.div>
      </div>
      <ImageLightbox
        src={lightbox.url || ""}
        alt={lightbox.alt}
        isOpen={!!lightbox.url}
        onClose={() => setLightbox({ url: null, alt: "" })}
      />
    </section>
  );
}
