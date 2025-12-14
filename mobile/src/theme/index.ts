// Design System Colors (from telas frontend mockups)
export const colors = {
    // Backgrounds
    background: '#F5F7FA',  // canvas - soft white
    white: '#FFFFFF',
    card: '#FFFFFF',
    highlight: '#F1F5F9',  // very light grey

    // Primary & Accent
    primary: '#00D4FF',  // neon-cyan - electric blue
    primaryLight: '#3B82F6',  // electric-blue
    primaryDark: '#0099CC',

    // Status Colors
    success: '#10B981',  // neon-success
    error: '#EF4444',
    warning: '#FFC400',  // neon-alert
    info: '#3B82F6',

    // Text
    text: '#0F172A',  // text-main - dark slate
    textSecondary: '#64748B',  // text-muted - slate 500
    textMuted: '#94A3B8',

    // UI Elements  
    border: '#E2E8F0',
    borderLight: '#F1F5F9',

    // Glassmorphism overlay
    glassWhite: 'rgba(255, 255, 255, 0.8)',
    glassLight: 'rgba(255, 255, 255, 0.6)',
};

// Typography based on Plus Jakarta Sans
export const typography = {
    fontSizes: {
        xs: 10,
        sm: 12,
        md: 14,
        base: 14,
        lg: 16,
        xl: 18,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    fontWeights: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },
    lineHeights: {
        none: 1,
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};

// Spacing scale
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
};

// Border radius
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
};

// Shadows with neon glow effects
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    neon: {
        shadowColor: '#00D4FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 6,
    },
    neonStrong: {
        shadowColor: '#00D4FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
    },
};

export default {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
};
