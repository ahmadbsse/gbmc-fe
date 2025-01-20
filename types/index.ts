import React, { ReactNode } from "react";
export interface Breadcrumb {
  text: string;
  href: string;
}

export interface PageLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: Breadcrumb[];
}
export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  featured: boolean;
}

export type TabProps = {
  active: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};
export type AdminAddItemModalProps = {

  onClose: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
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
};

export interface ScrollingMarqueeProps {
  text?: string;
  speed?: number;
}

export interface EngineeringCardProps {
  title: string;
  description: string;
  image: string;
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
export type Categories = {
  tractors: Category[];
  tractor_parts: Category[];
  sub_assemblies: Category[];
} | null;

export type DecodedToken = {
  jwt: string;
  role: string;
  iat: number;
  exp: number;
};