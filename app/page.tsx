"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const sections = [
  {
    src: "/gymslika.png",
    alt: "Fitness background",
    button: "Istraži vježbe",
    heading: "Dobrodošao u FitAI",
    href: "/vjezbe",
  },
  {
    src: "/aitrener.png",
    alt: "AI Trener",
    button: "Kreiraj svoj plan",
    heading: "Tvoj osobni AI Trener",
    href: "/aitrener",
  },
  {
    src: "/kalorijeslika.jpg",
    alt: "Kalorijski kalkulator",
    button: "Prati prehranu",
    heading: "Kalkulator kalorija",
    href: "/prehrana",
  },
];

function Section({ src, alt, button, heading, href }: (typeof sections)[0]) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, transition: { duration: 0.8 } });
    } else {
      controls.start({ opacity: 0.7, transition: { duration: 0.8 } });
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial={{ opacity: 0.7 }}
      className="relative h-screen w-screen flex items-center justify-center"
    >
      <Image src={src} alt={alt} fill className="object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute z-10 flex flex-col items-center text-center px-4">
        {heading && (
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            {heading}
          </h1>
        )}
        <Link href={href}>
          <button className="relative px-6 py-3 font-semibold text-white border-2 border-white overflow-hidden group rounded-xl cursor-pointer transition-colors duration-800">
            <span className="absolute inset-0 w-full h-full bg-blue-700 transform scale-x-0 origin-left rounded-tr-full rounded-br-full group-hover:scale-x-100 transition-transform duration-700 ease-in-out z-0"></span>
            <span className="absolute inset-0 w-full h-full bg-blue-700 transform scale-x-0 origin-right rounded-tl-full rounded-bl-full group-hover:scale-x-100 transition-transform duration-700 ease-in-out z-0"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-800 text-lg">
              {button}
            </span>
          </button>
        </Link>
      </div>
    </motion.section>
  );
}

export default function LandingPage() {
  return (
    <div
      className="h-screen w-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {sections.map((section, i) => (
        <div key={i} className="snap-start">
          <Section {...section} />
        </div>
      ))}
    </div>
  );
}
