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
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  const pathname = usePathname();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    async function loadSiteSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url")
        .eq("id", 1)
        .maybeSingle();

      // Logo local de la Escuela 15
      void data;
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
        const { data: roleData } = await supabase.rpc("get_my_role");
        setRole(roleData);
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
    async function loadNotifications() {
      if (!user) {
        setUnreadNotifications(0);
        return;
      }

      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (!error) {
        setUnreadNotifications(count ?? 0);
      }
    }

    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, supabase]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="h-1 w-full bg-gradient-to-r from-brand-800 via-accent-500 to-brand-800" />

      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[76px] lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
            <Image
              src={logoUrl}
              alt="Escudo de la Escuela N.º 15"
              width={56}
              height={56}
              className="h-10 w-10 object-contain sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              priority
              unoptimized={logoUrl.startsWith("http")}
            />
          </div>

          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-[17px] font-bold tracking-tight text-brand-900 sm:text-lg lg:text-xl">
              {siteConfig.name}
            </span>

            <span className="hidden truncate text-[10px] font-medium uppercase tracking-wide text-ink-400 sm:block lg:text-[11px]">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-0.5 xl:flex"
        >
          {mainNav
            .filter((item) => item.href !== "/login")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative rounded-lg px-3 py-2 text-[13px] font-bold transition-all ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-600 hover:bg-ink-50 hover:text-brand-700"
                }`}
                aria-current={
                  isActive(item.href) ? "page" : undefined
                }
              >
                {item.label}

                <span
                  className={`absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent-500 transition-all duration-200 ${
                    isActive(item.href)
                      ? "w-5"
                      : "w-0 group-hover:w-5"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}

          {!user && (
            <Link
              href="/login"
              className="ml-2 rounded-lg border border-brand-700 px-3.5 py-2 text-[13px] font-bold text-brand-700 transition-all hover:bg-brand-700 hover:text-white"
            >
              Iniciar sesión
            </Link>
          )}

          {user && (
            <div className="ml-2 flex items-center gap-1 border-l border-ink-100 pl-2">
              {role === "admin" && (
                <Link
                  href="/panel"
                  className="rounded-lg bg-brand-700 px-3 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-800"
                >
                  Panel
                </Link>
              )}

              <Link
                href="/mis-noticias"
                className="rounded-lg px-3 py-2 text-[13px] font-bold text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700"
              >
                Mis noticias
              </Link>

              <Link
                href="/nueva-noticia"
                className="rounded-lg bg-accent-500 px-3 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-600"
              >
                + Nueva noticia
              </Link>

              <Link
                href="/notificaciones"
                aria-label="Notificaciones"
                className="relative ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M18.75 9.75a6.75 6.75 0 0 0-13.5 0c0 7.125-3 7.125-3 9h19.5c0-1.875-3-1.875-3-9ZM13.5 21a1.5 1.5 0 0 1-3 0"
                  />
                </svg>

                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadNotifications > 99
                      ? "99+"
                      : unreadNotifications}
                  </span>
                )}
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden w-56 2xl:block">
            <SearchBar />
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-xl p-2.5 text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700 lg:p-3 2xl:hidden"
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
            className="rounded-xl p-2.5 text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700 lg:p-3 xl:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
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
        <div className="animate-fade-in-up border-t border-ink-100 bg-white px-4 py-3 shadow-sm lg:hidden 2xl:hidden">
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
          className="animate-fade-in-up border-t border-ink-100 bg-white px-4 py-3 shadow-lg xl:hidden"
        >
          <ul className="flex flex-col gap-1">
            {mainNav
              .filter((item) => item.href !== "/login")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-base font-bold transition-colors ${
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
              <li className="mt-1 border-t border-ink-100 pt-2">
                <Link
                  href="/login"
                  className="block rounded-xl border border-brand-700 px-4 py-3 text-center text-base font-bold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
                >
                  Iniciar sesión
                </Link>
              </li>
            )}

            {user && (
              <>
                <li className="mt-1 border-t border-ink-100 pt-2">
                  {role === "admin" && (
                    <Link
                      href="/panel"
                      className="mb-1 block rounded-xl bg-brand-700 px-4 py-3 text-base font-bold text-white"
                    >
                      Panel de administración
                    </Link>
                  )}
                </li>

                <li>
                  <Link
                    href="/mis-noticias"
                    className="block rounded-xl px-4 py-3 text-base font-bold text-ink-700 hover:bg-ink-50"
                  >
                    Mis noticias
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nueva-noticia"
                    className="block rounded-xl bg-accent-500 px-4 py-3 text-base font-bold text-white"
                  >
                    + Nueva noticia
                  </Link>
                </li>

                <li>
                  <Link
                    href="/notificaciones"
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-ink-700 hover:bg-ink-50"
                  >
                    <span className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M18.75 9.75a6.75 6.75 0 0 0-13.5 0c0 7.125-3 7.125-3 9h19.5c0-1.875-3-1.875-3-9ZM13.5 21a1.5 1.5 0 0 1-3 0"
                        />
                      </svg>
                      Notificaciones
                    </span>

                    {unreadNotifications > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-2 text-xs font-bold text-white">
                        {unreadNotifications > 99
                          ? "99+"
                          : unreadNotifications}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
