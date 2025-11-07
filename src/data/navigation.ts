/**
 * Navigation data for the Codezone landing page
 * Contains main navigation items and their configuration
 */

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export const mainNavigation: NavItem[] = [
  {
    label: 'Tecnología a medida',
    href: '#services',
    isActive: false
  },
  {
    label: 'Cómo lo hacemos',
    href: '#process',
    isActive: false
  },
  {
    label: 'Nuestro stack tecnológico',
    href: '#stack',
    isActive: false
  }
];
