/**
 * Shared TypeScript interfaces for all components
 * Provides type safety and documentation for component props
 */

import type { ImageMetadata } from 'astro';

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderProps {
  logoSrc?: string;
  logoAlt?: string;
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
}

export interface MobileMenuProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose?: () => void;
}

// Services types
export interface ServiceItem {
  title: string;
  description: string;
  image: string | ImageMetadata;
  ctaText?: string;
  ctaHref?: string;
}

export interface ServicesProps {
  title?: string;
  subtitle?: string[];
  services: ServiceItem[];
}

export interface ServiceCardProps {
  title: string;
  description: string;
  image: string | ImageMetadata;
  cta?: string;
  ctaHref?: string;
  className?: string;
}

// Contact form types
export interface ContactInfo {
  phone: string;
  email: string;
  logo: string;
}

export interface ContactFormProps {
  title?: string;
  subtitle?: string;
  contactInfo?: ContactInfo;
}

export interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

export interface FormInputProps {
  type: 'text' | 'email' | 'tel' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
}

// Process types
export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  image: string | ImageMetadata;
}

export interface ProcessProps {
  title?: string;
  subtitle?: string;
  steps: ProcessStep[];
}

export interface ProcessCardProps {
  number: number;
  title: string;
  description: string;
  image: string | ImageMetadata;
  isEven?: boolean;
}

// Tech stack types
export interface TechCategory {
  name: string;
  icon: string;
  technologies: string[];
  description?: string;
}

export interface StackProps {
  title?: string;
  subtitle?: string;
  categories: TechCategory[];
}

export interface TechStackCardProps {
  name: string;
  icon: string;
  technologies: string[];
  description?: string;
}

// Shared component types
export interface ButtonProps {
  variant?: 'outline' | 'solid';
  size?: 'small' | 'medium' | 'large';
  href: string;
  icon?: string;
}

export interface GradientTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  gradient?: 'cyan-purple' | 'purple-cyan' | 'custom';
  className?: string;
}
