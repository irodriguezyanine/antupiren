import Link from "next/link";

type WhatsappFloatProps = {
  href: string;
};

export function WhatsappFloat({ href }: WhatsappFloatProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/25 transition hover:bg-green-700"
    >
      Chatea con nosotros
    </Link>
  );
}
