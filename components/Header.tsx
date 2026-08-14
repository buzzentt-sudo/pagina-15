"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, siteConfig } from "@/lib/site-config";
import SearchBar from "./SearchBar";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/images/brand/logo-mark.svg");
  const pathname = usePathname();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function loadSiteSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url")
        .eq("id", 1)
        .maybeSingle();

      if (data?.logo_url) {
        setLogoUrl(data.logo_url);
      }
    }

    loadSiteSettings();
  }, [supabase]);

  useEffect(() => {
    async function loadAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data: roleData } =
          await supabase.rpc("get_my_role");

        console.log("ROL SUPABASE:", roleData); setRole(roleData);
      } else {
        setRole(null);
      }
    }

    loadAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAuth();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <div className="h-[3px] w-full bg-gradient-to-r from-brand-700 via-accent-500 to-brand-700" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5 lg:gap-3"
        >
          <Image
            src={logoUrl}
            alt="Escudo de la Escuela N.º 15"
            width={40}
            height={40}
            className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            priority
            unoptimized={logoUrl.startsWith("http")}
          />

          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-base font-bold text-brand-800 lg:text-xl">
              {siteConfig.name}
            </span>

            <span className="hidden truncate text-[11px] text-ink-500 sm:block lg:text-xs">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainNav
            .filter((item) => item.href !== "/login")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(item.href)
                    ? "text-brand-800"
                    : "text-ink-600 hover:text-brand-700"
                }`}
                aria-current={
                  isActive(item.href) ? "page" : undefined
                }
              >
                {item.label}

                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent-500 transition-transform duration-200 ${
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}

          {!user && (
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-semibold"
            >
              Iniciar sesión
            </Link>
          )}

          {user && role === "admin" && (
            <Link
              href="/panel"
              className="px-3 py-2 text-sm font-semibold"
            >
              Panel de administración
            </Link>
          )}

          {user && (
            <Link
              href="/nueva-noticia"
              className="px-3 py-2 text-sm font-semibold"
            >
              Nueva noticia
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1.5 lg:gap-2">
          <div className="hidden w-64 lg:block">
            <SearchBar />
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2.5 text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700 lg:hidden"
            aria-label="Abrir buscador"
            aria-expanded={searchOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2.5 text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700 lg:hidden"
            aria-label={
              menuOpen ? "Cerrar menú" : "Abrir menú"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6 transition-transform duration-200"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="animate-fade-in-up border-t border-ink-100 bg-white px-4 py-3 lg:hidden">
          <SearchBar
            autoFocus
            onSubmitted={() => setSearchOpen(false)}
          />
        </div>
      )}

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navegación móvil"
          className="animate-fade-in-up border-t border-ink-100 bg-white px-4 py-3 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {mainNav
              .filter((item) => item.href !== "/login")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                      isActive(item.href)
                        ? "bg-brand-50 text-brand-800"
                        : "text-ink-700 hover:bg-ink-50"
                    }`}
                    aria-current={
                      isActive(item.href) ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

            {!user && (
              <li>
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Iniciar sesión
                </Link>
              </li>
            )}

            {user && role === "admin" && (
              <li>
                <Link
                  href="/panel"
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Panel de administración
                </Link>
              </li>
            )}

            {user && (
              <li>
                <Link
                  href="/nueva-noticia"
                  className="block rounded-lg px-3 py-2.5 text-base font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Nueva noticia
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
