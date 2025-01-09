import React from "react";
import Link from "next/link";

import type { PageLayoutProps } from "@/types";

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, breadcrumbs = [] }) => {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 pb-8 pt-4">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-black">
            {breadcrumbs.map((crumb, index) => (
              <p key={index}>
                <Link href={crumb.href} className="pr-2 hover:text-secondary">
                  {crumb.text}
                </Link>
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </p>
            ))}
          </div>
          <h1 className="text-2xl font-bold xl:text-3xl">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};
export default PageLayout;
