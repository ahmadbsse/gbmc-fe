import React, { ReactNode } from "react";
export interface Breadcrumb {
  text: string;
  href: string;
}

export interface PageLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: Breadcrumb[];
  isDetailsPage?: boolean;
  paddingTop?: boolean;
}
export type TabProps = {
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};
export type AdminAddItemModalProps = {

  setShowAddItemModal: (
    value: boolean
  ) => void;
  activeTab: tab;
  currentTab: string;
  getData: () => void;
};
type tab = {
  name: string;
  key: string;
};
export type ButtonProps = {
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  btnStyle?: boolean;
  rounded?: boolean;
  id?: string;
  loading: boolean;
  disabled?: boolean;
};

export interface ScrollingMarqueeProps {
  text?: string;
  speed?: number;
}

export interface EngineeringCardProps {
  id: string;
  title: string;
  image: {
    formats: {
      thumbnail: {
        width: number;
        height: number;
        url: string;
      };
    };
  };
  featured: boolean;
  isImage: boolean;
  heroVideo: { url: string; } | null;
}

export type Category = {
  id: number;
  documentId: string;
  name: string;
  type: string;
  media: Media;
  description: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  featured: boolean;
  publishedAt: string;
};
export type Media = {
  id: number,
  documentId: string,
  name: string,
  formats: ImageFormats,
};
export type ImageFormats = {
  small: Format,
  thumbnail: Format;
  actual: Format;
};
export type Format = { url: string, width: number, height: number; };


export type DecodedToken = {
  jwt: string;
  role: string;
  iat: number;
  exp: number;
};

type FormatSec = {
  ext: string | null;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes?: number; // Optional since not all formats have this field
};

type MediaFormats = {
  small: FormatSec;
  thumbnail: FormatSec;
  actual?: FormatSec; // Optional for certain media items
  large?: FormatSec; // Optional for hero image
  medium?: FormatSec; // Optional for hero image
};

type MediaItem = {
  type: string; // e.g., "image"
  id: number;
  documentId: string;
  name: string;
  formats: MediaFormats;
};

type HeroImage = {
  type?: string;
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: MediaFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null; // Adjust this type if you know the structure
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt: string; // ISO date string
};

export type EngineeringComponent = {
  documentId: string;
  name: string;
  description: string; // HTML string
  active: boolean;
  featured: boolean;
  summary: string; // HTML string
  media: MediaItem[];
  hero_image: HeroImage;
  weight: string;
  material: string;
};