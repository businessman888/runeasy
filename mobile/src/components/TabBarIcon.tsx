import React from 'react';
import { View, Platform } from 'react-native';

interface TabBarIconProps {
    name: 'home' | 'calendar' | 'trophy' | 'chart' | 'profile';
    color: string;
    size?: number;
}

// SVG paths for each icon
const iconPaths: Record<string, { viewBox: string; path: string }> = {
    home: {
        viewBox: '0 0 20 22',
        path: 'M0 19.375V8.125C0 7.72917 0.0887498 7.35417 0.26625 7C0.44375 6.64583 0.688334 6.35417 1 6.125L8.5 0.5C8.9375 0.166667 9.4375 0 10 0C10.5625 0 11.0625 0.166667 11.5 0.5L19 6.125C19.3125 6.35417 19.5575 6.64583 19.735 7C19.9125 7.35417 20.0008 7.72917 20 8.125V19.375C20 20.0625 19.755 20.6513 19.265 21.1413C18.775 21.6313 18.1867 21.8758 17.5 21.875H13.75C13.3958 21.875 13.0992 21.755 12.86 21.515C12.6208 21.275 12.5008 20.9783 12.5 20.625V14.375C12.5 14.0208 12.38 13.7242 12.14 13.485C11.9 13.2458 11.6033 13.1258 11.25 13.125H8.75C8.39583 13.125 8.09917 13.245 7.86 13.485C7.62083 13.725 7.50083 14.0217 7.5 14.375V20.625C7.5 20.9792 7.38 21.2762 7.14 21.5162C6.9 21.7562 6.60333 21.8758 6.25 21.875H2.5C1.8125 21.875 1.22417 21.6304 0.735 21.1413C0.245833 20.6521 0.000833333 20.0633 0 19.375Z',
    },
    calendar: {
        viewBox: '0 0 24 24',
        path: 'M7 11H9V13H7V11ZM21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.1 3 21 3.9 21 5ZM5 7H19V5H5V7ZM19 19V9H5V19H19ZM15 13H17V11H15V13ZM11 13H13V11H11V13Z',
    },
    trophy: {
        viewBox: '0 0 18 20',
        path: 'M18 4H15V2C15 0.9 14.1 0 13 0H5C3.9 0 3 0.9 3 2V4H0V8C0 9.66 1.34 11 3 11H3.77C4.28 12.92 5.89 14.4 7.88 14.84V18H5V20H13V18H10.12V14.84C12.11 14.4 13.72 12.92 14.23 11H15C16.66 11 18 9.66 18 8V4ZM3 9C2.45 9 2 8.55 2 8V6H3V9ZM16 8C16 8.55 15.55 9 15 9V6H16V8Z',
    },
    chart: {
        viewBox: '0 0 24 24',
        path: 'M22 21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z',
    },
    profile: {
        viewBox: '0 0 24 24',
        path: 'M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z',
    },
};

export function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
    const icon = iconPaths[name];

    if (Platform.OS === 'web') {
        return (
            <svg
                width={size}
                height={size}
                viewBox={icon.viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d={icon.path} fill={color} />
            </svg>
        );
    }

    // For native, use a simple View placeholder
    // In production, you'd use react-native-svg
    return (
        <View
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                opacity: 0.8,
                borderRadius: size / 4,
            }}
        />
    );
}

export default TabBarIcon;
