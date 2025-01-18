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
export type AdminModalProps = {
  isOpen: boolean;
  onClose: (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  type: string;
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
  description: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  featured: boolean;
  publishedAt: string;
};
export type Categories = {
  tractors: Category[];
  tractor_parts: Category[];
  sub_assemblies: Category[];
} | null;
