import { cn } from "../utils/cn";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e4d8c6] bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-7",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 space-y-1.5">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a3b3b]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold text-[#2c2420] sm:text-3xl">{title}</h2>
      {description && <p className="max-w-3xl text-[#5c5349]">{description}</p>}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "bad" | "warn";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[#efe6d8] text-[#5c5349] border-[#e0d3bd]",
    good: "bg-[#e7efe1] text-[#3a5c2d] border-[#c9ddc0]",
    bad: "bg-[#f6e3e0] text-[#8a3b3b] border-[#edc7c1]",
    warn: "bg-[#faeccb] text-[#7a5a14] border-[#f0d898]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl bg-[#7a2e2e] px-5 py-2.5 text-sm font-semibold text-[#fbf4e8] shadow-sm transition hover:bg-[#6a2626] disabled:cursor-not-allowed disabled:bg-[#c9b8a4] disabled:text-[#fbf4e8]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl border border-[#c9b8a4] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#5c5349] transition hover:bg-[#efe6d8] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function NotificationCard({
  title,
  children,
  icon = "⚠️",
}: {
  title: string;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="animate-[fadein_0.5s_ease] rounded-2xl border-2 border-[#8a3b3b] bg-[#fbf0ea] p-5 shadow-md sm:p-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[#7a2e2e]">{title}</h3>
          <div className="text-[#5c4b40]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-[#d8c9b2] bg-white px-3 py-2 text-[#2c2420] outline-none focus:border-[#7a2e2e] focus:ring-2 focus:ring-[#7a2e2e]/20",
        props.className
      )}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-[#d8c9b2] bg-white px-3 py-2 text-[#2c2420] outline-none focus:border-[#7a2e2e] focus:ring-2 focus:ring-[#7a2e2e]/20",
        props.className
      )}
    />
  );
}
