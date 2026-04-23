type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-900">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="headline mt-3 text-2xl font-semibold text-amber-900 sm:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-3xl text-sm text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}
