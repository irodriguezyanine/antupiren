import Image from "next/image";
import Link from "next/link";

type SiteFooterProps = {
  instagramUrl: string;
  facebookUrl: string;
  address: string;
};

export function SiteFooter({ instagramUrl, facebookUrl, address }: SiteFooterProps) {
  return (
    <footer className="mt-20 border-t border-amber-100 bg-amber-50/50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
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
          <p className="mt-2 text-xs text-zinc-500">
            Centro de eventos en Peñalolén para matrimonios, empresas y celebraciones.
          </p>
        </div>
        <div className="text-sm text-zinc-600">
          <p className="font-medium text-amber-900">Navegación</p>
          <div className="mt-2 grid gap-1">
            <Link href="/matrimonios" className="hover:text-amber-800">
              Matrimonios
            </Link>
            <Link href="/eventos-corporativos" className="hover:text-amber-800">
              Corporativos
            </Link>
            <Link href="/galeria" className="hover:text-amber-800">
              Galería
            </Link>
            <Link href="/contacto" className="hover:text-amber-800">
              Contacto
            </Link>
          </div>
        </div>
        <div className="text-sm text-zinc-600 sm:text-right">
          <p className="font-medium text-amber-900">Síguenos en redes</p>
          <div className="mt-2 flex gap-3 sm:justify-end">
            <Link className="hover:text-amber-800" href={instagramUrl} target="_blank">
              Instagram
            </Link>
            <Link className="hover:text-amber-800" href={facebookUrl} target="_blank">
              Facebook
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            © {new Date().getFullYear()} Eventos Antupirén. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
