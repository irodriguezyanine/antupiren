import Link from "next/link";

type CtaBannerProps = {
  title: string;
  description: string;
  href: string;
  label: string;
};

export function CtaBanner({ title, description, href, label }: CtaBannerProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <p className="text-lg font-semibold text-amber-900">{title}</p>
      <p className="mt-2 text-sm text-zinc-700">{description}</p>
      <Link
        href={href}
        target="_blank"
        className="mt-4 inline-flex rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800"
      >
        {label}
      </Link>
    </section>
  );
}
