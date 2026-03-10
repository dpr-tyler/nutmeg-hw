import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Car,
  MapPin,
  CreditCard,
  Sun,
  ShieldCheck,
  Package,
  Plane,
  Calendar,
} from "lucide-react";

const ICONS = {
  Car,
  MapPin,
  CreditCard,
  Sun,
  ShieldCheck,
  Package,
  Plane,
  Calendar,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function TipCard({ item }) {
  const Icon = ICONS[item.icon] || Package;
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-4 p-6 rounded-3xl"
      style={{
        background: "white",
        border: "1px solid rgba(27,79,107,0.08)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex gap-5 items-center">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(27,79,107,0.08)" }}
        >
          <Icon size={20} color="var(--ocean)" strokeWidth={1.5} />
        </div>
        <h4
          className="font-display text-lg"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          {item.title}
        </h4>
      </div>
      <p
        style={{
          color: "var(--ink)",
          opacity: 0.72,
          fontSize: "0.875rem",
          lineHeight: 1.75,
        }}
      >
        {item.body}
      </p>
    </motion.div>
  );
}

export default function PracticalTips() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const items = t("tips.items", { returnObjects: true });
  const overviewItems = [
    {
      icon: "Sun",
      title: t("overview.bestTime.title"),
      body: t("overview.bestTime.body"),
    },
    {
      icon: "Plane",
      title: t("overview.getting.title"),
      body: t("overview.getting.body"),
    },
  ];
  const allItems = [...overviewItems, ...(Array.isArray(items) ? items : [])];

  return (
    <section
      id="tips"
      ref={ref}
      className="py-24 px-6"
      style={{ background: "var(--ivory)" }}
    >
      <div className="max-w-4xl mx-auto">
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
                color: "var(--sand)",
                letterSpacing: "0.2em",
              }}
            >
              Essentials
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
              {t("tips.title")}
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
              {t("tips.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allItems.map((item, i) => (
              <TipCard key={i} item={item} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-24 text-center"
      >
        <div
          className="inline-block h-px w-24 mb-8"
          style={{ background: "var(--sand)", opacity: 0.4 }}
        />
        <p
          className="font-display text-xl"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ocean)",
            opacity: 0.5,
            fontStyle: "italic",
          }}
        >
          Mahalo. Enjoy your week in paradise.
        </p>
      </motion.div>
    </section>
  );
}
