/**
 * NavigationManager - Centralized navigation logic for Header and MobileMenu
 * 
 * This module consolidates all navigation-related functionality including:
 * - Click handling for desktop and mobile navigation
 * - Active state management and synchronization
 * - Programmatic scrolling coordination
 * - Event dispatching for component synchronization
 * - Special case handling (logo, contact button)
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface NavConfig {
  SCROLL_DURATION: number;
  ANIMATION_DELAY: number;
  MENU_CLOSE_DELAY: number;
  SCROLL_BEHAVIOR: ScrollBehavior;
}

export interface NavigationOptions {
  closeMenu?: boolean;
  menuCloseDelay?: number;
  beforeNavigate?: () => void | Promise<void>;
  afterNavigate?: () => void | Promise<void>;
}

// ============================================================================
// Configuration
// ============================================================================

export const NAV_CONFIG: NavConfig = {
  SCROLL_DURATION: 800,
  ANIMATION_DELAY: 100,
  MENU_CLOSE_DELAY: 120,
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior
};

// ============================================================================
// Internal State
// ============================================================================

interface NavigationState {
  linkMap: Map<string, HTMLElement[]>;
  links: HTMLElement[];
  activeHref: string | null;
  isInitialized: boolean;
}

const state: NavigationState = {
  linkMap: new Map<string, HTMLElement[]>(),
  links: [],
  activeHref: null,
  isInitialized: false
};

// ============================================================================
// Validation and Utility Functions
// ============================================================================

/**
 * Special navigation hrefs that should not be marked as active
 * These include hero (logo destination) and contact sections
 */
const SPECIAL_HREFS_NO_ACTIVE = [
  '#hero',
  '#contact-separator',
  '#mobile-contact-separator'
];

/**
 * Mobile-specific href mappings to their desktop equivalents
 * Used to normalize mobile hrefs for consistent target resolution
 */
const MOBILE_HREF_MAP: Record<string, string> = {
  '#mobile-contact-separator': '#contact-separator',
  '#hero': '#hero'
};

/**
 * Validates if a given href is a valid navigation href
 * 
 * @param href - The href to validate
 * @returns true if valid, false otherwise
 */
export function isValidNavigationHref(href: string): boolean {
  // Type check
  if (typeof href !== 'string') {
    console.warn('NavigationManager: href must be a string', href);
    return false;
  }
  
  // Format check - must start with #
  if (!href.startsWith('#')) {
    console.warn('NavigationManager: href must start with #', href);
    return false;
  }
  
  // Length check - prevent extremely long hrefs
  if (href.length > 100) {
    console.warn('NavigationManager: href is too long', href);
    return false;
  }
  
  // Character whitelist - alphanumeric, dash, underscore only
  if (!/^#[a-zA-Z0-9_-]+$/.test(href)) {
    console.warn('NavigationManager: href contains invalid characters', href);
    return false;
  }
  
  return true;
}

/**
 * Checks if a href should not be marked as active
 * Used for special cases like hero and contact sections
 * 
 * @param href - The href to check
 * @returns true if the href should not be marked as active
 */
function shouldNotMarkAsActive(href: string): boolean {
  return SPECIAL_HREFS_NO_ACTIVE.includes(href);
}

/**
 * Normalizes mobile-specific hrefs to their desktop equivalents
 * This ensures consistent target element resolution
 * 
 * @param href - The href to normalize
 * @returns The normalized href (desktop equivalent if mobile-specific, otherwise original)
 */
function normalizeHref(href: string): string {
  return MOBILE_HREF_MAP[href] || href;
}

/**
 * Removes the hash from the current URL without triggering navigation
 * Uses history.replaceState to clean the URL
 */
export function removeHashFromUrl(): void {
  if (!window.location.hash) return;
  
  try {
    history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  } catch (error) {
    console.warn('NavigationManager: failed to update URL', error);
    // Continue execution - non-critical error
  }
}

/**
 * Gets the target element for a given href
 * Handles mobile-specific hrefs by normalizing them to desktop equivalents
 * 
 * @param href - The href to get the target for (e.g., "#services" or "#mobile-contact-separator")
 * @returns The target element or null if not found
 */
function getTargetElement(href: string): HTMLElement | null {
  // Normalize mobile hrefs to desktop equivalents
  const normalizedHref = normalizeHref(href);
  const id = normalizedHref.slice(1); // Remove the # prefix
  const target = document.getElementById(id);
  
  if (!target) {
    console.warn('NavigationManager: target element not found', id);
    return null;
  }
  
  return target;
}

// ============================================================================
// State Management Functions
// ============================================================================

/**
 * Initializes the NavigationManager with link elements
 * Builds the internal linkMap for efficient state updates
 * 
 * @param linkElements - Array of HTMLElements representing navigation links
 */
export function initialize(linkElements: HTMLElement[]): void {
  // Clear existing state
  state.linkMap.clear();
  state.links = [];
  state.activeHref = null;
  
  // Build link map
  linkElements.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Add to links array
    state.links.push(link);
    
    // Add to link map
    if (!state.linkMap.has(href)) {
      state.linkMap.set(href, []);
    }
    state.linkMap.get(href)!.push(link);
  });
  
  state.isInitialized = true;
}

/**
 * Sets the active navigation href and updates aria-current attributes
 * 
 * @param href - The href to mark as active, or null to clear active state
 */
export function setActiveNavHref(href: string | null): void {
  // Update internal state
  state.activeHref = href;
  
  // Remove aria-current from all links
  state.links.forEach(link => {
    link.removeAttribute('aria-current');
  });
  
  // Set aria-current on matching links
  if (href && state.linkMap.has(href)) {
    const matchingLinks = state.linkMap.get(href)!;
    matchingLinks.forEach(link => {
      link.setAttribute('aria-current', 'page');
    });
  }
  
  // Dispatch sync event
  try {
    const event = new CustomEvent('codezone:setActiveNavHref', {
      detail: href,
      bubbles: true
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('NavigationManager: failed to dispatch setActiveNavHref event', error);
  }
}

/**
 * Gets the current active href
 * 
 * @returns The current active href or null
 */
export function getActiveHref(): string | null {
  return state.activeHref;
}

// ============================================================================
// Event System
// ============================================================================

/**
 * Dispatches navigation-related events
 * 
 * @param href - The href that was navigated to
 */
function dispatchNavigationEvents(href: string): void {
  try {
    // Dispatch setActiveNavHref event (already done in setActiveNavHref)
    // This is for any additional sync needs
    
    // Dispatch trigger-section-animations event
    const sectionId = href.slice(1); // Remove # prefix
    const animationEvent = new CustomEvent('trigger-section-animations', {
      detail: { sectionId },
      bubbles: true
    });
    window.dispatchEvent(animationEvent);
  } catch (error) {
    console.error('NavigationManager: failed to dispatch navigation events', error);
  }
}

// ============================================================================
// Core Navigation Functions
// ============================================================================

/**
 * Handles navigation click events
 * Coordinates the full navigation flow: validation, state update, scroll, events
 * 
 * @param event - The click event
 * @param href - The href to navigate to
 * @param options - Optional navigation options
 */
export async function handleNavigationClick(
  event: Event,
  href: string,
  options: NavigationOptions = {}
): Promise<void> {
  try {
    // 1. Validate href
    if (!isValidNavigationHref(href)) {
      return; // Fail silently with warning
    }
    
    // 2. Prevent default
    event.preventDefault();
    
    // 3. Execute beforeNavigate hook
    if (options.beforeNavigate) {
      try {
        await options.beforeNavigate();
      } catch (error) {
        console.error('NavigationManager: beforeNavigate hook failed', error);
        // Continue navigation despite hook failure
      }
    }
    
    // 4. Get target element
    const target = getTargetElement(href);
    if (!target) {
      return; // Fail silently with warning
    }
    
    // 5. Update active state
    // Special case: don't mark hero or contact sections as active
    // For mobile hrefs, use the original href for active state (not normalized)
    try {
      const activeHref = shouldNotMarkAsActive(href) ? null : href;
      setActiveNavHref(activeHref);
    } catch (error) {
      console.error('NavigationManager: failed to update active state', error);
      // Continue navigation
    }
    
    // 6. Perform scroll
    try {
      target.scrollIntoView({
        behavior: NAV_CONFIG.SCROLL_BEHAVIOR,
        block: 'start'
      });
    } catch (error) {
      console.error('NavigationManager: scroll failed', error);
      // Continue with other operations
    }
    
    // 7. Dispatch animation events (with delay to allow scroll to complete)
    try {
      setTimeout(() => {
        dispatchNavigationEvents(href);
      }, NAV_CONFIG.ANIMATION_DELAY);
    } catch (error) {
      console.error('NavigationManager: failed to dispatch events', error);
    }
    
    // 8. Clean URL hash
    removeHashFromUrl();
    
    // 9. Execute afterNavigate hook
    if (options.afterNavigate) {
      try {
        await options.afterNavigate();
      } catch (error) {
        console.error('NavigationManager: afterNavigate hook failed', error);
      }
    }
    
  } catch (error) {
    console.error('NavigationManager: unexpected error in handleNavigationClick', error);
    // Fail gracefully - don't break the application
  }
}

/**
 * Handles mobile navigation with menu close coordination
 * Closes the menu first, then performs navigation
 * 
 * @param href - The href to navigate to
 * @param closeMenuCallback - Callback to close the mobile menu
 * @param options - Optional navigation options
 */
export async function handleMobileNavigation(
  href: string,
  closeMenuCallback: () => void,
  options: NavigationOptions = {}
): Promise<void> {
  try {
    // 1. Validate href
    if (!isValidNavigationHref(href)) {
      return; // Fail silently with warning
    }
    
    // 2. Execute close callback
    try {
      closeMenuCallback();
    } catch (error) {
      console.error('NavigationManager: closeMenuCallback failed', error);
      // Continue with navigation
    }
    
    // 3. Calculate delay based on menu animation
    const delay = options.menuCloseDelay || NAV_CONFIG.MENU_CLOSE_DELAY;
    
    // 4. Wait for menu close animation
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // 5. Create a synthetic event for handleNavigationClick
    const syntheticEvent = new Event('click', { bubbles: true, cancelable: true });
    
    // 6. Call handleNavigationClick
    await handleNavigationClick(syntheticEvent, href, options);
    
  } catch (error) {
    console.error('NavigationManager: unexpected error in handleMobileNavigation', error);
    // Fail gracefully
  }
}
