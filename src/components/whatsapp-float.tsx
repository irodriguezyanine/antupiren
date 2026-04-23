import { MessageCircleMore } from "lucide-react";
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
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/25 transition hover:scale-[1.02] hover:bg-green-700"
    >
      <span className="absolute -left-1 -top-1 h-3 w-3 animate-ping rounded-full bg-green-300" />
      <MessageCircleMore size={16} />
      Chatea con nosotros
    </Link>
  );
}
