import React from "react";
import Link from "next/link";

import type { PageLayoutProps } from "@/types";

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
  paddingTop = true,
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${paddingTop ? "pt-20" : ""}`}>
      <div className="mx-auto max-w-7xl">
        <div className="container mx-auto px-4 pb-12 pt-4">
          <div className="mb-4">
            <div className="mb-8 flex items-center gap-2 text-sm capitalize text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <p
                  className={`${index == 2 ? "max-w-[100px] truncate text-nowrap md:max-w-[200px]" : ""}`}
                  key={index}
                >
                  <Link href={crumb.href} className="pr-2 hover:text-secondary">
                    {crumb.text}
                  </Link>
                  {index < breadcrumbs.length - 1 && <span>/</span>}
                </p>
              ))}
            </div>
            <h1 className="text-2xl font-bold lg:text-3xl">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
export default PageLayout;
