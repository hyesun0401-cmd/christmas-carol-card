"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const PHOTO_SET = [
  {
    src: "/landing/01.jpg",
    alt: "A gift wrapped with ribbon",
  },
  {
    src: "/landing/02.jpg",
    alt: "Christmas greenery",
  },
  {
    src: "/landing/03.jpg",
    alt: "A warm winter drink",
  },
  {
    src: "/landing/04.jpg",
    alt: "A snowy winter landscape",
  },
  {
    src: "/landing/05.jpg",
    alt: "A cozy year-end vibe",
  },
  {
    src: "/landing/06.jpg",
    alt: "A year-end photo",
  },
];

export function LandingHero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) return;

    const setVars = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      const x = (clientX - r.left) / r.width; // 0..1
      const y = (clientY - r.top) / r.height; // 0..1
      const dx = clamp((x - 0.5) * 2, -1, 1);
      const dy = clamp((y - 0.5) * 2, -1, 1);
      el.style.setProperty("--mx", `${dx}`);
      el.style.setProperty("--my", `${dy}`);
    };

    const onMove = (e: PointerEvent) => setVars(e.clientX, e.clientY);
    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <main className="min-h-dvh bg-[#7c0f14] px-6 py-10 text-white sm:py-14">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        <div
          ref={ref}
          onPointerDown={() => setActive(true)}
          onPointerUp={() => setActive(false)}
          className="relative w-full"
          style={
            {
              "--mx": "0",
              "--my": "0",
            } as React.CSSProperties
          }
        >
          {/* doodle star */}
          <svg
            className="pointer-events-none mx-auto mb-2 block h-14 w-14 opacity-90"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M32 8 L34 26 L44 12 L38 28 L56 24 L38 32 L56 40 L38 36 L44 52 L34 38 L32 56 L30 38 L20 52 L26 36 L8 40 L26 32 L8 24 L26 28 L20 12 L30 26 Z"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* collage */}
          <div className="relative mx-auto h-[28rem] w-full max-w-[44rem] sm:h-[34rem]">
            {/* handwritten notes */}
            <div
              className="pointer-events-none absolute left-2 top-24 -rotate-90 text-[13px] text-white/90 sm:left-0 sm:top-32 sm:text-sm"
              style={{
                fontFamily:
                  "Bradley Hand, Apple Chancery, Snell Roundhand, Comic Sans MS, cursive",
              }}
            >
              a gift for you
            </div>
            <div
              className="pointer-events-none absolute right-6 top-24 rotate-12 text-[13px] text-white/90 sm:right-10 sm:top-28 sm:text-sm"
              style={{
                fontFamily:
                  "Bradley Hand, Apple Chancery, Snell Roundhand, Comic Sans MS, cursive",
              }}
            >
              open the envelope
            </div>
            <div
              className="pointer-events-none absolute bottom-14 right-4 rotate-6 text-[13px] text-white/90 sm:bottom-20 sm:right-6 sm:text-sm"
              style={{
                fontFamily:
                  "Bradley Hand, Apple Chancery, Snell Roundhand, Comic Sans MS, cursive",
              }}
            >
              one carol picked for you
            </div>

            {/* base group transform (subtle parallax) */}
            <div
              className={[
                "absolute inset-0 transition-transform duration-150",
                active ? "scale-[0.995]" : "scale-100",
              ].join(" ")}
              style={{
                transform:
                  "perspective(1100px) rotateX(calc(var(--my) * -2.5deg)) rotateY(calc(var(--mx) * 3.5deg)) translateY(calc(var(--my) * -5px))",
              }}
            >
              <Polaroid
                // top: 1
                className="left-[32%] top-[2.5%] rotate-[-6deg] sm:left-[36%] sm:top-[3.5%]"
                floatDelay="0.05s"
                imgSrc={PHOTO_SET[0].src}
                imgAlt={PHOTO_SET[0].alt}
              />
              <Polaroid
                // middle: 2
                className="left-[9%] top-[25%] rotate-[8deg] sm:left-[13%] sm:top-[27%]"
                floatDelay="0.22s"
                imgSrc={PHOTO_SET[1].src}
                imgAlt={PHOTO_SET[1].alt}
              />
              <Polaroid
                className="left-[57%] top-[26%] rotate-[-4deg] sm:left-[61%] sm:top-[27%]"
                floatDelay="0.12s"
                imgSrc={PHOTO_SET[2].src}
                imgAlt={PHOTO_SET[2].alt}
              />
              <Polaroid
                // bottom: 3
                className="left-[0%] top-[56%] rotate-[-7deg] sm:left-[4%] sm:top-[58%]"
                floatDelay="0.36s"
                imgSrc={PHOTO_SET[3].src}
                imgAlt={PHOTO_SET[3].alt}
              />
              <Polaroid
                className="left-[31%] top-[54%] rotate-[2deg] sm:left-[35%] sm:top-[56%]"
                floatDelay="0.18s"
                emphasize
                imgSrc={PHOTO_SET[4].src}
                imgAlt={PHOTO_SET[4].alt}
              />
              <Polaroid
                className="left-[66%] top-[56%] rotate-[10deg] sm:left-[70%] sm:top-[58%]"
                floatDelay="0.28s"
                imgSrc={PHOTO_SET[5].src}
                imgAlt={PHOTO_SET[5].alt}
              />
            </div>

            {/* main title like handwritten */}
            <div
              className="pointer-events-none absolute -bottom-2 left-1/2 w-full -translate-x-1/2 text-center text-3xl text-white/95 sm:-bottom-4 sm:text-4xl"
              style={{
                fontFamily:
                  "Bradley Hand, Apple Chancery, Snell Roundhand, Comic Sans MS, cursive",
              }}
            >
              <span className="inline-block">
                <Typewriter
                  options={{
                    strings: ["merry christmas"],
                    autoStart: true,
                    loop: false,
                    delay: 45,
                    deleteSpeed: 999999,
                    cursor: "",
                  }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* bottom CTA */}
        <div className="mt-2 flex w-full items-center justify-center pb-[max(0px,env(safe-area-inset-bottom))]">
          <Link
            href="/create"
            className="inline-flex w-full max-w-sm items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-[#7c0f14] shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:bg-white/90"
          >
            카드 만들기
          </Link>
        </div>
      </div>
    </main>
  );
}

function Polaroid({
  className,
  imgSrc,
  imgAlt,
  floatDelay,
  emphasize,
}: {
  className: string;
  imgSrc: string;
  imgAlt: string;
  floatDelay: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={[
        "absolute h-[11.5rem] w-[11.5rem] rounded-sm bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-[12.5rem] sm:w-[12.5rem]",
        "p-2",
        "transition-transform duration-200",
        "motion-safe:animate-[posterFloat_5.8s_ease-in-out_infinite]",
        emphasize ? "z-10" : "z-[1]",
        className,
      ].join(" ")}
      style={{
        animationDelay: floatDelay,
      }}
    >
      <div className="h-full w-full rounded-sm bg-white">
        <div className="relative h-[78%] w-full overflow-hidden rounded-sm bg-zinc-200">
          <div className="absolute inset-0">
            <Image
              src={imgSrc}
              alt={imgAlt}
              fill
              sizes="200px"
              className="object-cover"
              style={{ filter: "contrast(1.05) saturate(0.95)" }}
              priority={emphasize === true}
            />
          </div>
        </div>
        {/* photo gloss */}
        <div
          className="pointer-events-none absolute left-2 top-2 rounded-sm opacity-70"
          style={{
            height: "calc(78% - 0px)",
            width: "calc(100% - 16px)",
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%)",
          }}
        />
        <div className="flex h-[22%] items-center justify-center">
          <div
            className="text-[12px] text-zinc-800/80"
            style={{
              fontFamily:
                "Bradley Hand, Apple Chancery, Snell Roundhand, Comic Sans MS, cursive",
            }}
          >
            for you
          </div>
        </div>
      </div>
    </div>
  );
}


