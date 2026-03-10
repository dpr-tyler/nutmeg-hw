import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Lightbulb, ChevronDown, Sunrise, Sun, Moon } from "lucide-react";
import LinkableContent from "./LinkableContent";
import EntityPopover from "./EntityPopover";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function TimeBlock({ icon: Icon, label, content, onEntityClick }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center pt-1">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(27,79,107,0.08)" }}
        >
          <Icon size={15} color="var(--ocean)" strokeWidth={1.5} />
        </div>
        <div
          className="w-px flex-1 mt-2"
          style={{ background: "rgba(27,79,107,0.1)" }}
        />
      </div>
      <div className="pb-6">
        <span
          className="text-xs uppercase tracking-widest block mb-2"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--sand-dark)",
            letterSpacing: "0.15em",
          }}
        >
          {label}
        </span>
        <p
          style={{
            color: "var(--ink)",
            opacity: 0.8,
            lineHeight: 1.75,
            fontSize: "0.9rem",
          }}
        >
          <LinkableContent text={content} onEntityClick={onEntityClick} />
        </p>
      </div>
    </div>
  );
}

function DayCard({ day, isOpen, onToggle, onEntityClick }) {
  const { t } = useTranslation();

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: "white",
        border: "1px solid rgba(27,79,107,0.1)",
        boxShadow: isOpen
          ? "0 8px 40px rgba(27,79,107,0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
        style={{ background: "transparent", border: "none" }}
      >
        <div className="flex items-center gap-5">
          <span
            className="font-mono-accent text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--ocean)",
              opacity: 0.75,
              letterSpacing: "0.15em",
              minWidth: "4rem",
            }}
          >
            {day.day}
          </span>
          <div>
            <h3
              className="font-display text-xl leading-snug"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink)",
                fontWeight: 600,
              }}
            >
              {day.title}
            </h3>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={20} color="var(--ocean)" strokeWidth={1.5} />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-6 pb-6"
              style={{ borderTop: "1px solid rgba(27,79,107,0.06)" }}
            >
              <div className="pt-6">
                <TimeBlock
                  icon={Sunrise}
                  label={t("itinerary.morning")}
                  content={day.morning}
                  onEntityClick={onEntityClick}
                />
                <TimeBlock
                  icon={Sun}
                  label={t("itinerary.afternoon")}
                  content={day.afternoon}
                  onEntityClick={onEntityClick}
                />
                <TimeBlock
                  icon={Moon}
                  label={t("itinerary.evening")}
                  content={day.evening}
                  onEntityClick={onEntityClick}
                />

                {/* Local tip */}
                <div
                  className="flex gap-3 p-4 rounded-2xl mt-2"
                  style={{
                    background: "rgba(198,169,107,0.1)",
                    border: "1px solid rgba(198,169,107,0.2)",
                  }}
                >
                  <Lightbulb
                    size={16}
                    color="var(--sand-dark)"
                    strokeWidth={1.5}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <span
                      className="text-xs uppercase tracking-widest block mb-1"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--sand-dark)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {t("itinerary.localTip")}
                    </span>
                    <p
                      style={{
                        color: "var(--ink)",
                        opacity: 0.75,
                        fontSize: "0.85rem",
                        lineHeight: 1.7,
                      }}
                    >
                      <LinkableContent
                        text={day.tip}
                        onEntityClick={onEntityClick}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Itinerary() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const days = t("itinerary.days", { returnObjects: true });
  const [openDays, setOpenDays] = useState(() =>
    Array.isArray(days) ? new Set(days.map((_, i) => i)) : new Set(),
  );
  const [popoverEntity, setPopoverEntity] = useState(null);

  return (
    <section
      id="itinerary"
      ref={ref}
      className="py-24 px-6"
      style={{ background: "var(--ivory)" }}
    >
      <div className="max-w-3xl mx-auto">
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
              Day by Day
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
              {t("itinerary.title")}
            </h2>
            <p
              style={{
                color: "var(--ink)",
                opacity: 0.6,
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              {t("itinerary.subtitle")}
            </p>
          </motion.div>

          <motion.div variants={stagger} className="flex flex-col gap-4">
            {Array.isArray(days) &&
              days.map((day, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <DayCard
                    day={day}
                    isOpen={openDays.has(i)}
                    onToggle={() =>
                      setOpenDays((prev) => {
                        const next = new Set(prev);
                        if (next.has(i)) next.delete(i);
                        else next.add(i);
                        return next;
                      })
                    }
                    onEntityClick={setPopoverEntity}
                  />
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      </div>
      <EntityPopover
        entity={popoverEntity}
        onClose={() => setPopoverEntity(null)}
      />
    </section>
  );
}
