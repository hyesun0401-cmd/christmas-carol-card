import type { ReactNode } from "react";

type Props = {
  variant?: "red" | "green";
  kicker?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function PosterLayout({ variant = "red", kicker, title, subtitle, children, footer }: Props) {
  const isGreen = variant === "green";
  return (
    <main
      className={[
        "min-h-dvh px-6 py-10 text-white sm:py-14",
        isGreen ? "bg-[#064E3B]" : "bg-[#7c0f14]",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative mx-auto flex w-full flex-col items-center gap-7">
          {/* background decorations */}
          {isGreen ? (
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div
                className="absolute inset-0 opacity-100"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 10% 20%, rgba(212,175,55,0.14) 0%, transparent 30%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.06) 0%, transparent 45%), radial-gradient(circle at 45% 55%, rgba(153,27,27,0.10) 0%, transparent 55%)",
                }}
              />
              <div
                className="absolute top-[10%] -left-12 whitespace-nowrap text-7xl font-black tracking-[0.25em] opacity-[0.07] sm:text-8xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#D4AF37" }}
              >
                CHRISTMAS
              </div>
              <div
                className="absolute top-[40%] -right-20 whitespace-nowrap text-6xl font-black tracking-[0.22em] opacity-[0.06] sm:text-7xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#991B1B" }}
              >
                YEAR-END
              </div>
              <div
                className="absolute bottom-[12%] left-[-60px] whitespace-nowrap text-8xl font-black opacity-[0.03] sm:text-9xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#FFFFFF" }}
              >
                WISH
              </div>
              <div className="absolute top-20 left-10 text-2xl text-white/70 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                ✦
              </div>
              <div className="absolute top-40 right-12 text-xl text-[#D4AF37]/70 drop-shadow-[0_0_8px_rgba(212,175,55,0.45)]">
                ✨
              </div>
              <div className="absolute bottom-40 left-8 text-4xl text-[#D4AF37]/40">✱</div>
              <div className="absolute top-1/2 right-4 text-lg text-white/25">❄</div>
              <div className="absolute bottom-20 right-20 text-3xl text-white/25">❄</div>
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.65) 0.7px, transparent 0.8px)",
                  backgroundSize: "28px 28px",
                  backgroundPosition: "0 0",
                }}
              />
            </div>
          ) : null}

          {/* doodle star */}
          <svg
            className="pointer-events-none block h-12 w-12 opacity-90"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M32 8 L34 26 L44 12 L38 28 L56 24 L38 32 L56 40 L38 36 L44 52 L34 38 L32 56 L30 38 L20 52 L26 36 L8 40 L26 32 L8 24 L26 28 L20 12 L30 26 Z"
              stroke={isGreen ? "rgba(212,175,55,0.95)" : "rgba(255,255,255,0.9)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {(kicker || title || subtitle) && (
            <header className="w-full max-w-2xl space-y-3 text-center">
              {kicker ? (
                <p className="text-xs tracking-widest text-white/80">{kicker}</p>
              ) : null}
              {title ? (
                <div className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  {title}
                </div>
              ) : null}
              {subtitle ? <div className="text-sm text-white/80">{subtitle}</div> : null}
            </header>
          )}

          <div className="w-full">{children}</div>

          {footer ? <footer className="text-center text-xs text-white/70">{footer}</footer> : null}
        </div>
      </div>
    </main>
  );
}


