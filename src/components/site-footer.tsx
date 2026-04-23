import Image from "next/image";
import Link from "next/link";

type SiteFooterProps = {
  instagramUrl: string;
  facebookUrl: string;
  address: string;
};

export function SiteFooter({ instagramUrl, facebookUrl, address }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-amber-100 bg-amber-50/50">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/logo-antupiren.png"
              alt="Logo Antupirén"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <p className="text-sm font-semibold text-amber-900">Eventos Antupirén</p>
          </div>
          <p className="mt-2 text-sm text-zinc-600">{address}</p>
        </div>
        <div className="text-sm text-zinc-600 sm:text-right">
          <p>Síguenos en redes</p>
          <div className="mt-2 flex gap-3 sm:justify-end">
            <Link className="hover:text-amber-800" href={instagramUrl} target="_blank">
              Instagram
            </Link>
            <Link className="hover:text-amber-800" href={facebookUrl} target="_blank">
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
