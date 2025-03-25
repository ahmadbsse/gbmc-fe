import { appData } from "@/constants";
import { useEffect, useState } from "react";
import Head from "next/head";
import { SEOkeywords, SEODescription, SEOLogo } from "@/data/seo";

const SeoHead = ({ title }) => {
  const [pageTitle, setPageTitle] = useState(appData.name);

  useEffect(() => {
    if (title) {
      setPageTitle(`${title} | ${appData.name}`);
    }
  }, [title]);
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={SEODescription} />
      <meta name="keywords" content={SEOkeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={SEODescription} />
      <meta property="og:site_name" content={appData.name} />
      <meta property="og:image" content={SEOLogo} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={SEODescription} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default SeoHead;
