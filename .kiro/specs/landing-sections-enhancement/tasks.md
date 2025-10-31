# Implementation Plan

## Overview

Este plan de implementación desglosa el diseño en tareas de código incrementales y manejables. Cada tarea construye sobre las anteriores y hace referencia a los requisitos específicos del documento de requirements.

## ⚠️ IMPORTANT: Preserve Existing Animations

**DO NOT modify or remove existing animations**. The current project has excellent animations that must be preserved:



- **Hero Section**: `animate-spin-slow` (12s neon circles), `animate-logo-pulse` (6s drop-shadow pulse), logo rotate on hover
- **ServiceCard**: Image scale(1.05) on hover (600ms), neon glow effect (600ms)
- **Button**: Gradient background-position animation (600ms), color change on hover



These animations are core to the brand identity and user experience. Only add new animations for new components.

## Tasks

- [x] 1. Setup project structure and utilities


  - Create data files for navigation, services, process, and tech stack content
  - Create TypeScript utility files for validation and sanitization
  - Create shared TypeScript interfaces file for component props
  - _Requirements: 6.1, 6.2, 6.3, 6.4_



- [ ] 1.1 Create data files with TypeScript interfaces
  - Create `src/data/navigation.ts` with NavItem interface and mainNavigation array

  - Create `src/data/services.ts` with ServiceData interface and services array
  - Create `src/data/process.ts` with ProcessStepData interface and processSteps array
  - Create `src/data/techStack.ts` with TechCategoryData interface and techStack array
  - _Requirements: 6.2, 6.3_


- [ ] 1.2 Create validation and sanitization utilities
  - Create `src/utils/validation.ts` with form validation functions and error messages
  - Create `src/utils/sanitization.ts` with input sanitization function to prevent XSS
  - Implement rate limiting utility class for form submissions
  - _Requirements: 3.2, 3.5, 10.1, 10.2, 10.6_

- [ ] 1.3 Create shared TypeScript interfaces
  - Create `src/types/components.ts` with all component prop interfaces
  - Export interfaces for Header, Services, ContactForm, Process, Stack components
  - Include validation and error handling types
  - _Requirements: 6.2, 6.4_

- [x] 2. Implement base reusable components


  - Create GradientText component for gradient headings
  - Create FormInput component with validation styling
  - Enhance Button component if needed for new use cases
  - _Requirements: 6.1, 6.3, 7.1, 7.2_

- [x] 2.1 Create GradientText component

  - Create `src/components/GradientText.astro` with configurable HTML tag and gradient options
  - Implement cyan-purple and purple-cyan gradient presets
  - Add TypeScript interface for props (as, gradient, className)
  - _Requirements: 7.2, 7.3_


- [x] 2.2 Create FormInput component

  - Create `src/components/FormInput.astro` for reusable form inputs
  - Support text, email, tel, and textarea input types
  - Implement error state styling with red border and error message display
  - Add focus state with gradient border effect
  - Include ARIA attributes for accessibility (aria-required, aria-invalid, aria-describedby)
  - _Requirements: 3.3, 3.4, 7.1, 7.2, 11.3, 11.4_


- [x] 2.3 Review and enhance Button component

  - Review existing `src/components/Button.astro` - DO NOT change existing animations
  - PRESERVE gradient animation (background-position with 600ms ease transition)
  - PRESERVE hover effects for both outline and solid variants
  - Only add new variants/sizes if absolutely needed for new sections
  - Ensure existing button animations continue working
  - _Requirements: 6.1, 7.1_




- [ ] 3. Implement Header with mobile menu
  - Enhance Header component with mobile menu support
  - Create MobileMenu component with overlay and navigation
  - Implement hamburger menu icon and close functionality


  - Add responsive behavior (hamburger on mobile, horizontal nav on desktop)
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ] 3.1 Create MobileMenu component
  - Create `src/components/MobileMenu.astro` with full-screen overlay
  - Implement semi-transparent dark background (rgba(10, 14, 39, 0.95)) with backdrop blur
  - Add vertical navigation list with large touch targets (min 44x44px)
  - Include close button (X icon) in top right corner


  - Implement smooth fade-in/fade-out transitions (300ms)
  - Add click outside to close functionality with JavaScript
  - Implement focus trap for keyboard navigation accessibility
  - _Requirements: 1.5, 1.6, 1.7, 11.4_

- [x] 3.2 Enhance Header component with mobile menu


  - Update `src/sections/Header.astro` to include hamburger menu icon for mobile
  - Add state management for mobile menu open/close
  - Implement responsive display (hamburger < 768px, horizontal nav >= 1024px)
  - Integrate MobileMenu component with toggle functionality
  - Prevent body scroll when mobile menu is open
  - Ensure logo and navigation items use data from navigation.ts


  - _Requirements: 1.1, 1.2, 1.4, 1.8_

- [ ] 4. Enhance Services section with responsive grid
  - Update Services component with new responsive grid layout
  - Implement special tablet layout (center card full-width)
  - Enhance ServiceCard component with improved hover effects
  - Integrate services data from services.ts

  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_


- [ ] 4.1 Update Services section component
  - Update `src/sections/Services.astro` with responsive grid classes
  - Implement mobile layout (1 column, < 640px)
  - Implement tablet layout (center card full-width, others 2-col, 640-1023px)


  - Implement desktop layout (3 columns, >= 1024px)
  - Use GradientText component for "Tech Your Vibes" heading
  - Load services data from `src/data/services.ts`
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.7_

- [ ] 4.2 Enhance ServiceCard component
  - Review `src/components/ServiceCard.astro` - DO NOT change existing animations
  - PRESERVE existing neon glow effect (.outer-glow-fx with 600ms transition)


  - PRESERVE existing image zoom on hover (scale 1.05 with 600ms ease-in-out)
  - PRESERVE existing card styling and transitions
  - Only update if needed for responsive grid compatibility
  - Ensure responsive image loading with srcset continues working
  - _Requirements: 2.4, 2.8, 7.2, 7.3, 7.4, 9.1_


- [-] 5. Implement ContactForm section

  - Create ContactForm section with two-column layout
  - Implement form with validation and error handling
  - Add contact information display (logo, phone, email)
  - Implement client-side validation with TypeScript
  - Add input sanitization for security
  - Implement rate limiting for form submissions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 10.1, 10.2, 10.6_


- [ ] 5.1 Create ContactForm section component
  - Create `src/sections/ContactForm.astro` with two-column grid layout
  - Left column: heading, subtitle, logo, and contact info (phone, email)
  - Right column: form with FormInput components
  - Implement responsive layout (single column on mobile, two columns on desktop)
  - Use GradientText component for heading


  - _Requirements: 3.1, 3.7, 8.1, 8.2_

- [ ] 5.2 Implement form validation and submission logic
  - Add client-side validation using validation.ts utilities
  - Implement real-time validation on input blur
  - Display error messages below each input field
  - Implement form submission handler with sanitization


  - Add success/error message display after submission
  - Implement rate limiting using RateLimiter utility (max 5 submissions per minute)
  - Clear form fields on successful submission
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 10.1, 10.2, 10.6_

- [ ] 5.3 Style form inputs with gradient borders
  - Apply dark background with gradient border on focus

  - Implement error state styling (red border)

  - Ensure input height 48px, border-radius 12px
  - Style textarea with min-height 120px
  - Style submit button with gradient background and hover animation
  - _Requirements: 7.1, 7.2, 7.3_


- [x] 6. Enhance Process section with animations

  - Update Process component with alternating layout
  - Create or enhance ProcessCard component
  - Implement scroll-triggered fade-in animations
  - Add numbered badges with gradient styling
  - Integrate process data from process.ts

  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_


- [ ] 6.1 Update Process section component
  - Update `src/sections/Process.astro` with alternating left-right layout
  - Implement desktop alternating layout (odd: image left, even: image right)
  - Implement mobile stacking (single column)

  - Use GradientText component for heading "¿Cómo lo hacemos?"

  - Add subtitle "Design Thinking + Scrum"
  - Load process steps data from `src/data/process.ts`
  - _Requirements: 4.1, 4.2, 4.5, 4.6_

- [ ] 6.2 Create or enhance ProcessCard component
  - Create/update `src/components/ProcessCard.astro` for individual process steps
  - Display numbered badge (64x64px circle) with gradient border

  - Display step image with border-radius 24px, max-width 400px
  - Display step title with cyan-300 gradient using GradientText
  - Display step description with neutral-100 text
  - Implement responsive layout (flex with gap 2rem)
  - _Requirements: 4.2, 4.3, 7.2_

- [ ] 6.3 Implement scroll-triggered animations
  - Add Intersection Observer for scroll-triggered animations

  - Implement fade-in animation with translateY(20px) to translateY(0)
  - Add staggered animation timing (150ms delay between steps)
  - Ensure animations trigger when 20% of element is visible
  - Add CSS classes for fade-in states
  - _Requirements: 4.4, 9.3_

- [x] 7. Enhance Stack section with tech cards

  - Update Stack component with responsive grid
  - Create TechStackCard component
  - Implement hover scale animation
  - Integrate tech stack data from techStack.ts
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_


- [ ] 7.1 Update Stack section component
  - Update `src/sections/Stack.astro` with responsive grid layout
  - Implement mobile grid (2 columns, < 768px)
  - Implement tablet grid (3 columns, 768-1023px)
  - Implement desktop grid (4 columns, >= 1024px)
  - Use GradientText component for heading "Nuestro Stack Tenológico"

  - Add subtitle "Herramientas"
  - Load tech stack data from `src/data/techStack.ts`
  - _Requirements: 5.1, 5.2, 5.5, 5.6, 5.7_

- [ ] 7.2 Create TechStackCard component
  - Create `src/components/TechStackCard.astro` for individual tech categories
  - Display circular icon container (80x80px) with gradient border
  - Display icon (48x48px) centered in container
  - Display category name with cyan-300 color

  - Display technologies list (comma-separated, text-sm)
  - Display optional description if provided
  - Implement hover scale effect (1.05) with 300ms transition
  - _Requirements: 5.3, 5.4, 7.2_

- [ ] 8. Implement responsive images and optimization
  - Ensure all images use WebP format with fallbacks
  - Implement lazy loading for below-the-fold images

  - Add responsive srcset for all images
  - Optimize image dimensions and compression
  - _Requirements: 8.6, 9.1, 9.2_

- [ ] 8.1 Optimize service images
  - Verify service images use WebP format
  - Add srcset with 1x and 2x versions

  - Implement lazy loading for service cards
  - Add appropriate sizes attribute for responsive loading
  - _Requirements: 9.1, 9.2, 8.6_


- [ ] 8.2 Optimize process and stack images
  - Verify process step images use WebP format
  - Verify tech stack icons use SVG format
  - Implement lazy loading for process images
  - Add error handling for missing images with fallback
  - _Requirements: 9.1, 9.2_


- [x] 9. Implement accessibility features

  - Add ARIA labels to all interactive elements
  - Ensure semantic HTML structure
  - Implement keyboard navigation support
  - Add focus indicators for all focusable elements
  - Verify color contrast ratios
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_


- [ ] 9.1 Add ARIA attributes and semantic HTML
  - Add role attributes to header, main, and footer sections
  - Add aria-label to navigation elements
  - Add aria-labelledby to section headings
  - Ensure form inputs have associated labels with for/id attributes
  - Add aria-required, aria-invalid, and aria-describedby to form inputs
  - Add role="alert" and aria-live="polite" to error messages
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 9.2 Implement keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Add visible focus indicators (outline or border) to all focusable elements
  - Implement focus trap in mobile menu
  - Ensure tab order is logical and follows visual flow


  - Add keyboard shortcuts for closing mobile menu (Escape key)
  - _Requirements: 11.4_

- [ ] 9.3 Verify and fix color contrast
  - Verify all text meets WCAG AA contrast requirements (4.5:1 for normal, 3:1 for large)
  - Ensure interactive elements have 3:1 contrast ratio
  - Test gradient text for sufficient contrast


  - Fix any contrast issues found
  - _Requirements: 11.5_

- [ ] 10. Add design system utilities to Tailwind config
  - Extend Tailwind config with custom colors


  - Add custom spacing and border radius values
  - Add custom animation utilities

  - Create utility classes for gradient borders and neon effects
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10.1 Extend Tailwind config with custom theme
  - Update `tailwind.config.js` or create if not exists
  - Add custom color palette (primary, accent, neutral)
  - Add custom spacing scale
  - Add custom border radius values

  - Add custom font sizes and line heights
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 10.2 Add custom utility classes
  - Create custom CSS file for gradient border utility
  - Create custom CSS file for neon glow utility

  - Create custom CSS file for gradient text utility
  - Create custom CSS file for gradient animation utility
  - Import custom utilities in main layout or global CSS
  - _Requirements: 7.2, 7.3, 7.4_

- [ ] 11. Integrate all sections into main page
  - Update main page layout to include all new/enhanced sections

  - Ensure proper section ordering
  - Add section IDs for anchor navigation
  - Verify responsive behavior across all sections
  - Test navigation links
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 8.1, 8.2, 8.3, 8.4_


- [ ] 11.1 Update main page with all sections
  - Update `src/pages/index.astro` to import all section components
  - Add sections in order: Header, Hero, Services, ContactForm, Process, Stack, Footer
  - PRESERVE all existing Hero animations (spin-slow, logo-pulse)
  - PRESERVE all existing Services animations (card hover effects)
  - Add section IDs for anchor navigation (#services, #contact, #process, #stack)

  - Ensure proper spacing between sections
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [ ] 11.2 Test responsive behavior
  - Test all sections at mobile breakpoint (< 640px)
  - Test all sections at tablet breakpoint (640-1023px)

  - Test all sections at desktop breakpoint (>= 1024px)
  - Verify special tablet layout for services section
  - Verify mobile menu functionality
  - Test on actual devices if possible
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 12. Performance optimization and final polish
  - Minimize JavaScript bundle size
  - Implement code splitting with Astro islands
  - Add loading states and transitions
  - Verify all animations run at 60fps
  - Test page load performance
  - _Requirements: 9.3, 9.4, 9.5_

- [ ] 12.1 Implement Astro islands for interactivity
  - Add client:load directive to MobileMenu for immediate interactivity
  - Add client:visible directive to ContactForm for lazy loading
  - Add client:idle directive to Process animations for deferred loading
  - Minimize client-side JavaScript by keeping most components static
  - _Requirements: 9.5_

- [ ] 12.2 Optimize and test performance
  - Run Lighthouse audit and aim for 90+ performance score
  - Verify LCP < 2.5s, FID < 100ms, CLS < 0.1
  - Check JavaScript bundle size (target < 100KB initial)
  - Verify all animations run smoothly at 60fps
  - Test on slow 3G network simulation
  - _Requirements: 9.3, 9.4_

- [ ] 13. Write component documentation
  - Document all component props and usage examples
  - Create README with component overview
  - Document data file structures
  - Add JSDoc comments to utility functions
  - _Requirements: 6.4, 6.5_

- [ ] 14. Write unit tests for utilities
  - Write tests for validation.ts functions
  - Write tests for sanitization.ts functions
  - Write tests for RateLimiter class
  - Ensure 80%+ code coverage for utilities
  - _Requirements: 3.2, 3.5, 10.1, 10.2_

- [ ] 15. Perform visual regression testing
  - Compare rendered components with Figma designs
  - Verify pixel-perfect implementation (2px tolerance)
  - Test all responsive breakpoints
  - Document any intentional deviations from design
  - _Requirements: 7.5_

- [ ] 16. Conduct accessibility audit
  - Run automated accessibility tests with axe-core
  - Perform manual keyboard navigation testing
  - Test with screen reader (NVDA or JAWS)
  - Verify all WCAG 2.1 Level AA requirements
  - Fix any accessibility issues found
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

## Notes
- Each task builds incrementally on previous tasks
- All tasks reference specific requirements from the requirements document
- Implementation should follow Clean Code principles and TypeScript best practices
- Security considerations (OWASP) should be applied throughout implementation
- All code should be well-commented and maintainable
