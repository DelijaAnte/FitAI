"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "./context/auth-context";
import Login from "./components/Login";
import DownArrow from "./components/DownArrow";

const sections = [
  {
    src: "/naslovnaslika.jpg",
    alt: "Uvodna slika",
    heading: "Dobrodošao u FitAI",
    description:
      "Platforma koja ti donosi sve što trebaš za fitness – treninge, prehranu i praćenje na jednom mjestu.",
    showButton: false,
    showArrow: true,
  },
  {
    src: "/gymslika2.jpg",
    alt: "Fitness background",
    button: "Istraži vježbe",
    heading: "Trening po tvom izboru",
    href: "/vjezbe",
    showButton: true,
  },
  {
    src: "/trening7.jpg",
    alt: "Trening",
    heading: "Dnevnik treninga",
    button: "Prati napredak",
    href: "/trening",
    showButton: true,
  },
  {
    src: "/aitrener6.png",
    alt: "AI Trener",
    button: "Kreiraj plan",
    heading: "Tvoj AI Trener",
    href: "/aitrener",
    showButton: true,
  },
  {
    src: "/kalorijeslika6.jpg",
    alt: "Kalorijski kalkulator",
    button: "Prati prehranu",
    heading: "Kalkulator kalorija",
    href: "/prehrana",
    showButton: true,
  },
];

function Section({
  src,
  alt,
  button,
  heading,
  href,
  description,
  showButton = true,
  showArrow = false,
}: {
  src: string;
  alt: string;
  heading: string;
  href?: string;
  button?: string;
  description?: string;
  showButton?: boolean;
  showArrow?: boolean;
}) {
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
      <div className="absolute z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        {showArrow ? (
          <div className="flex flex-row items-center justify-center w-full gap-6">
            <div className="flex-1 flex flex-col items-center text-center">
              {heading && (
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-white">
                  {heading}
                </h1>
              )}
              {description && (
                <p className="text-white text-lg md:text-xl leading-relaxed max-w-2xl mb-8 px-4 font-medium">
                  {description}
                </p>
              )}
            </div>
            <DownArrow className="mb-4" size={36} />
          </div>
        ) : (
          <>
            {heading && (
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-white">
                {heading}
              </h1>
            )}
            {description && (
              <p className="text-white text-lg md:text-xl leading-relaxed max-w-2xl mb-8 px-4 font-medium">
                {description}
              </p>
            )}
          </>
        )}
        {showButton && button && href && (
          <Link href={href}>
            <button className="relative px-6 py-3 font-semibold text-white border-2 border-white overflow-hidden group rounded-xl cursor-pointer transition-colors duration-800">
              <span className="absolute inset-0 w-full h-full bg-blue-500 transform scale-x-0 origin-left rounded-tr-full rounded-br-full group-hover:scale-x-100 transition-transform duration-700 ease-in-out z-0"></span>
              <span className="absolute inset-0 w-full h-full bg-blue-500 transform scale-x-0 origin-right rounded-tl-full rounded-bl-full group-hover:scale-x-100 transition-transform duration-700 ease-in-out z-0"></span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-800 text-lg">
                {button}
              </span>
            </button>
          </Link>
        )}
      </div>
    </motion.section>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Login />
      </div>
    );
  }

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
