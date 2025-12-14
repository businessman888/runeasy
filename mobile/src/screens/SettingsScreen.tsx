import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useGamificationStore, useAuthStore } from '../stores';

export function SettingsScreen({ navigation }: any) {
    const { badges, stats, fetchBadges, fetchStats } = useGamificationStore();
    const { user, logout } = useAuthStore();

    React.useEffect(() => {
        fetchBadges();
        fetchStats();
    }, []);

    const unlockedBadges = badges.filter(b => b.unlocked);
    const lockedBadges = badges.filter(b => !b.unlocked);

    const currentLevel = stats?.current_level || 1;
    const totalPoints = stats?.total_points || 0;
    const pointsToNext = stats?.points_to_next_level || 1000;
    const progress = Math.min((totalPoints / (totalPoints + pointsToNext)) * 100, 100);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarRing}>
                            <Image
                                source={{ uri: user?.profile?.profile_pic || 'https://via.placeholder.com/112' }}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={styles.cameraButton}>
                            <Text style={styles.cameraIcon}>📷</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>{user?.profile?.firstname || 'Alex'} {user?.profile?.lastname || 'Runner'}</Text>
                    <Text style={styles.userSubtitle}>Marathon Enthusiast</Text>
                    <Text style={styles.memberSince}>Member since 2023</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Text style={styles.statIcon}>⚡</Text>
                        </View>
                        <Text style={styles.statLabel}>TOTAL XP</Text>
                        <Text style={styles.statValue}>{totalPoints.toLocaleString()}</Text>
                        <View style={styles.statTrend}>
                            <Text style={styles.trendIcon}>📈</Text>
                            <Text style={styles.trendText}>+150 this week</Text>
                        </View>
                    </View>

                    <View style={[styles.statCard, styles.levelCard]}>
                        <View style={styles.levelBlur} />
                        <View style={styles.statIconContainerLevel}>
                            <Text style={styles.statIcon}>🏅</Text>
                        </View>
                        <Text style={styles.statLabel}>LEVEL</Text>
                        <Text style={styles.statValue}>Level {currentLevel}</Text>
                        <Text style={styles.levelTitle}>Elite Sprinter</Text>
                    </View>
                </View>

                {/* Level Progress */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Progress to Level {currentLevel + 1}</Text>
                        <Text style={styles.progressPercent}>{progress.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressRemaining}>{pointsToNext.toLocaleString()} XP remaining</Text>
                </View>

                {/* Achievements Section */}
                <View style={styles.achievementsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Achievements</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.badgesGrid}>
                        {unlockedBadges.slice(0, 2).map((badge, index) => (
                            <View key={index} style={styles.badgeUnlocked}>
                                <View style={styles.badgeIconUnlocked}>
                                    <Text style={styles.badgeEmoji}>{badge.icon || '🏃'}</Text>
                                </View>
                                <Text style={styles.badgeName}>{badge.name}</Text>
                                <Text style={styles.badgeStatus}>Unlocked</Text>
                            </View>
                        ))}

                        {lockedBadges.slice(0, 1).map((badge, index) => (
                            <View key={`locked-${index}`} style={styles.badgeLocked}>
                                <View style={styles.lockIcon}>
                                    <Text style={styles.lockText}>🔒</Text>
                                </View>
                                <View style={styles.badgeIconLocked}>
                                    <Text style={styles.badgeEmojiLocked}>🏆</Text>
                                </View>
                                <Text style={styles.badgeNameLocked}>{badge.name || 'Marathoner'}</Text>
                                <Text style={styles.badgeRequirement}>{badge.description || 'Run 42km'}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Settings & History */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuTitle}>Settings & History</Text>

                    <View style={styles.menuList}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => navigation.navigate('Evolution')}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, styles.menuIconBlue]}>
                                    <Text style={styles.menuIconText}>📊</Text>
                                </View>
                                <View style={styles.menuTextContainer}>
                                    <Text style={styles.menuLabel}>Training History</Text>
                                    <Text style={styles.menuSubtext}>View your past runs</Text>
                                </View>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, styles.menuIconPurple]}>
                                    <Text style={styles.menuIconText}>✨</Text>
                                </View>
                                <View style={styles.menuTextContainer}>
                                    <Text style={styles.menuLabel}>AI Feedbacks</Text>
                                    <Text style={styles.menuSubtext}>Analysis of your performance</Text>
                                </View>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, styles.menuIconOrange]}>
                                    <Text style={styles.menuIconText}>🔄</Text>
                                </View>
                                <View style={styles.menuTextContainer}>
                                    <Text style={styles.menuLabel}>Strava Integration</Text>
                                    <Text style={styles.menuConnected}>Connected</Text>
                                </View>
                            </View>
                            <View style={styles.menuItemRight}>
                                <Text style={styles.manageText}>Manage</Text>
                                <Text style={styles.chevron}>›</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.menuIcon, styles.menuIconGray]}>
                                    <Text style={styles.menuIconText}>⚙️</Text>
                                </View>
                                <View style={styles.menuTextContainer}>
                                    <Text style={styles.menuLabel}>Settings</Text>
                                    <Text style={styles.menuSubtext}>Subscription & App preferences</Text>
                                </View>
                            </View>
                            <Text style={styles.chevron}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.spacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: `${colors.background}CC`,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: colors.text,
    },
    headerTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIcon: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarRing: {
        width: 112,
        height: 112,
        borderRadius: 56,
        padding: 4,
        ...(Platform.OS === 'web' ? {
            backgroundImage: 'linear-gradient(135deg, #00D4FF 0%, #00FFFF 100%)',
        } : {
            backgroundColor: colors.primary,
        }),
    },
    avatar: {
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: colors.highlight,
        borderWidth: 4,
        borderColor: colors.background,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 4,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    cameraIcon: {
        fontSize: 16,
    },
    userName: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        marginTop: spacing.md,
    },
    userSubtitle: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        color: colors.primary,
        marginTop: 4,
    },
    memberSince: {
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.borderLight,
        gap: spacing.md,
        ...shadows.sm,
    },
    levelCard: {
        position: 'relative',
        overflow: 'hidden',
    },
    levelBlur: {
        position: 'absolute',
        top: -16,
        right: -16,
        width: 80,
        height: 80,
        backgroundColor: colors.primary,
        opacity: 0.1,
        borderRadius: 40,
    },
    statIconContainer: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.lg,
        backgroundColor: '#FFF4E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIconContainerLevel: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.lg,
        backgroundColor: `${colors.primary}33`,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
    },
    statIcon: {
        fontSize: 20,
    },
    statLabel: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.semibold,
        color: colors.textMuted,
        letterSpacing: 1.5,
    },
    statValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        letterSpacing: -0.5,
    },
    statTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendIcon: {
        fontSize: 14,
    },
    trendText: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.success,
    },
    levelTitle: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.primary,
        position: 'relative',
        zIndex: 10,
    },
    progressCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.sm,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    progressTitle: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
    },
    progressPercent: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: colors.highlight,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: borderRadius.full,
        ...(Platform.OS === 'web' ? {
            backgroundImage: 'linear-gradient(90deg, #00D4FF 0%, #00FFFF 100%)',
        } : {
            backgroundColor: colors.primary,
        }),
    },
    progressRemaining: {
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing.sm,
        textAlign: 'right',
    },
    achievementsSection: {
        paddingHorizontal: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    viewAllText: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
        color: colors.primary,
    },
    badgesGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    badgeUnlocked: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: borderRadius['2xl'],
        padding: spacing.sm,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: `${colors.primary}4D`,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    badgeIconUnlocked: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${colors.primary}33`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    badgeEmoji: {
        fontSize: 24,
    },
    badgeName: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        textAlign: 'center',
    },
    badgeStatus: {
        fontSize: 10,
        color: colors.textMuted,
        marginTop: 4,
    },
    badgeLocked: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: borderRadius['2xl'],
        padding: spacing.sm,
        backgroundColor: colors.highlight,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
        position: 'relative',
    },
    lockIcon: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
    },
    lockText: {
        fontSize: 14,
    },
    badgeIconLocked: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    badgeEmojiLocked: {
        fontSize: 24,
        opacity: 0.6,
    },
    badgeNameLocked: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
        textAlign: 'center',
    },
    badgeRequirement: {
        fontSize: 10,
        color: colors.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    menuSection: {
        gap: spacing.sm,
        paddingBottom: spacing.sm,
    },
    menuTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
    },
    menuList: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.borderLight,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flex: 1,
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIconBlue: {
        backgroundColor: '#EFF6FF',
    },
    menuIconPurple: {
        backgroundColor: '#FAF5FF',
    },
    menuIconOrange: {
        backgroundColor: '#FFF7ED',
    },
    menuIconGray: {
        backgroundColor: colors.highlight,
    },
    menuIconText: {
        fontSize: 20,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuLabel: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
    },
    menuSubtext: {
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    menuConnected: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.success,
        marginTop: 2,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    manageText: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
    },
    chevron: {
        fontSize: 24,
        color: colors.textMuted,
    },
    spacer: {
        height: 40,
    },
});
