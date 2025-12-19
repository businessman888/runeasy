import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, shadows, borderRadius } from '../theme';
import { TabBarIcon } from './TabBarIcon';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const isCenterTab = route.name === 'Badges'; // Trophy is the center tab

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Get icon name based on route
                    const getIconName = () => {
                        switch (route.name) {
                            case 'Home': return 'home';
                            case 'Calendar': return 'calendar';
                            case 'Badges': return 'trophy';
                            case 'Evolution': return 'chart';
                            case 'Settings': return 'profile';
                            default: return 'home';
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                        >
                            {/* Active indicator glow line at top - only for non-center tabs */}
                            {isFocused && !isCenterTab && (
                                <View style={styles.activeIndicatorContainer}>
                                    <View style={styles.activeIndicatorLine} />
                                    <View style={styles.activeIndicatorGlow} />
                                </View>
                            )}

                            {/* Icon container - center tab always has circle */}
                            <View style={[
                                styles.iconContainer,
                                isCenterTab && styles.centerIconContainer
                            ]}>
                                <TabBarIcon
                                    name={getIconName()}
                                    color={isCenterTab ? '#FFFFFF' : (isFocused ? '#FFFFFF' : colors.textMuted)}
                                    size={isCenterTab ? 25 : 24}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingHorizontal: 20,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#15152A',
        borderRadius: 40,
        paddingVertical: 14,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: 360,
        ...shadows.lg,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    activeIndicatorContainer: {
        position: 'absolute',
        top: -14,
        alignItems: 'center',
    },
    activeIndicatorLine: {
        width: 27,
        height: 6,
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    activeIndicatorGlow: {
        width: 27,
        height: 4,
        backgroundColor: colors.primary,
        ...(Platform.OS === 'web' ? {
            filter: 'blur(4px)',
        } : {
            opacity: 0.5,
        }),
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerIconContainer: {
        backgroundColor: '#00C4E8',
        ...(Platform.OS === 'web' ? {
            background: 'linear-gradient(180deg, #00D4FF 0%, #007F99 100%)',
            boxShadow: '0px 0px 12px 2px rgba(0, 212, 255, 0.6)',
        } : {}),
    },
});

export default CustomTabBar;
