import Link from "next/link";
import { categories } from "@/data/categories";
import { CategorySlug } from "@/types/news";

interface CategoryNavProps {
  activeSlug?: CategorySlug;
}

export default function CategoryNav({ activeSlug }: CategoryNavProps) {
  return (
    <nav aria-label="Categorías" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max min-w-full gap-2 sm:w-full sm:flex-wrap">
        {categories.map((category) => {
          const isActive = category.slug === activeSlug;
          return (
            <li key={category.slug}>
              <Link
                href={`/categoria/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
