import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, ExternalLink, Lightbulb } from "lucide-react";
import { getGoogleMapsUrl } from "../utils/mapsUrl";
import ImageLightbox from "./ImageLightbox";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const priceColor = {
  $: { fg: "var(--sand)", bg: "rgba(198, 169, 107, 0.25)" },
  $$: { fg: "var(--sand)", bg: "rgba(198, 169, 107, 0.25)" },
  $$$: { fg: "var(--sand)", bg: "rgba(198, 169, 107, 0.25)" },
  $$$$: { fg: "var(--sand)", bg: "rgba(198, 169, 107, 0.25)" },
};

export function FoodCard({
  item,
  accent,
  onImageClick,
  compact = false,
  contentOnly = false,
}) {
  const { t } = useTranslation();
  const padding = compact ? "p-4" : "p-6";
  const gap = compact ? "gap-3" : "gap-4";

  const content = (
    <>
      <div className="flex items-start gap-3">
        {item.photo && (
          <img
            src={item.photo}
            alt={item.name}
            {...(!compact && {
              onClick: () => onImageClick?.(item.photo, item.name),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onImageClick?.(item.photo, item.name);
                }
              },
              role: "button",
              tabIndex: 0,
              "aria-label": `View full size photo of ${item.name}`,
              style: { width: 72, height: 72, cursor: "zoom-in" },
            })}
            className="rounded-2xl object-cover flex-shrink-0"
            style={{ width: compact ? 56 : 72, height: compact ? 56 : 72 }}
          />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h4
                className="font-display text-lg leading-snug"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--ink)",
                  fontWeight: 600,
                }}
              >
                {item.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--ink)",
                    opacity: 0.5,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.type}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full budget-pill"
                  style={{
                    background:
                      priceColor[item.price]?.bg ?? "rgba(0,0,0,0.08)",
                    color: priceColor[item.price]?.fg ?? "var(--ink)",
                  }}
                >
                  {item.price}
                </span>
              </div>
              {item.location && (
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
                    {item.location}
                  </span>
                </div>
              )}
              <a
                href={getGoogleMapsUrl(item.name, item.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 hover:opacity-80 transition-opacity"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--ocean)",
                  fontFamily: "var(--font-mono)",
                  textDecoration: "underline",
                }}
                aria-label={`${t("food.viewOnMap")} - ${item.name}`}
              >
                <ExternalLink size={12} />
                {t("food.viewOnMap")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: "var(--mist-card)", border: "1px solid var(--mist-card-border)" }}>
        <div className="flex items-start gap-2">
          <Lightbulb
            size={13}
            color="var(--sand)"
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--ink)",
              opacity: 0.75,
              lineHeight: 1.65,
            }}
          >
            {item.whyGo}
          </p>
        </div>
      </div>
    </>
  );

  const wrapperClass = `${padding} flex flex-col ${gap}`;

  if (contentOnly) {
    return <div className={wrapperClass}>{content}</div>;
  }

  return (
    <motion.div
      variants={compact ? {} : fadeUp}
      className={`rounded-3xl ${wrapperClass}`}
      style={{
        background: "#FAFAFA",
        border: "2px solid var(--card-border)",
      }}
    >
      {content}
    </motion.div>
  );
}

function FoodCategory({ labelKey, items, accent, onImageClick }) {
  const { t } = useTranslation();
  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <h3
          className="font-display text-2xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          {t(labelKey)}
        </h3>
        <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
      </div>
      <div
        className="mb-6 h-px w-full"
        style={{ background: "rgba(27,79,107,0.12)" }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <FoodCard
            key={item.name}
            item={item}
            accent={accent}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function FoodGuide() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [lightbox, setLightbox] = useState({ url: null, alt: "" });

  const foodItems = t("food.items", { returnObjects: true });

  return (
    <section
      id="food"
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
              Eat & Drink
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
              {t("food.title")}
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
              {t("food.subtitle")}
            </p>
          </motion.div>

          {foodItems && (
            <div>
              <FoodCategory
                labelKey="food.localGems"
                items={foodItems.localGems || []}
                accent="var(--sand)"
                onImageClick={(photo, name) =>
                  setLightbox({ url: photo, alt: name })
                }
              />
              <FoodCategory
                labelKey="food.splurge"
                items={foodItems.splurge || []}
                accent="var(--coral)"
                onImageClick={(photo, name) =>
                  setLightbox({ url: photo, alt: name })
                }
              />
              <FoodCategory
                labelKey="food.casual"
                items={foodItems.casual || []}
                accent="var(--ocean)"
                onImageClick={(photo, name) =>
                  setLightbox({ url: photo, alt: name })
                }
              />
            </div>
          )}
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
