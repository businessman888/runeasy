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
import { useGamificationStore, useTrainingStore, useFeedbackStore } from '../stores';

export function HomeScreen({ navigation }: any) {
    const { stats, fetchStats } = useGamificationStore();
    const { upcomingWorkouts, fetchUpcomingWorkouts } = useTrainingStore();
    const { latestSummary, fetchLatestSummary } = useFeedbackStore();

    React.useEffect(() => {
        fetchStats();
        fetchUpcomingWorkouts();
        fetchLatestSummary();
    }, []);

    const nextWorkout = upcomingWorkouts?.[0];
    const currentLevel = stats?.current_level || 1;
    const totalPoints = stats?.total_points || 0;
    const pointsToNext = stats?.points_to_next_level || 1000;
    const currentStreak = stats?.current_streak || 0;
    const progress = Math.min((totalPoints / (totalPoints + pointsToNext)) * 100, 100);

    return (
        <SafeAreaView style={styles.container}>
            {/* Background blur effects */}
            <View style={styles.blurTop} />
            <View style={styles.blurBottom} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/56' }}
                            style={styles.profileImage}
                        />
                        <View style={styles.statusDot} />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.welcomeText}>WELCOME BACK</Text>
                        <Text style={styles.userName}>Alex Morgan</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Text style={styles.bellIcon}>🔔</Text>
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Streak and Membership badges */}
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, styles.streakBadge]}>
                        <Text style={styles.fireIcon}>🔥</Text>
                        <View style={styles.badgeContent}>
                            <Text style={styles.badgeValue}>{currentStreak} Days</Text>
                            <Text style={styles.badgeLabel}>STREAK</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, styles.memberBadge]}>
                        <Text style={styles.premiumIcon}>⭐</Text>
                        <View style={styles.badgeContent}>
                            <Text style={styles.badgeValue}>Pro</Text>
                            <Text style={styles.memberLabel}>MEMBER</Text>
                        </View>
                    </View>
                </View>

                {/* Runner Level Card */}
                <View style={styles.levelCard}>
                    <View style={styles.levelCardBg} />
                    <View style={styles.levelHeader}>
                        <View>
                            <View style={styles.levelBadge}>
                                <View style={styles.levelDot} />
                                <Text style={styles.levelBadgeText}>RUNNER LEVEL</Text>
                            </View>
                            <Text style={styles.levelTitle}>
                                Elite Pacer <Text style={styles.levelVersion}>V.{String(currentLevel).padStart(2, '0')}</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                        </View>
                    </View>
                    <View style={styles.xpRow}>
                        <Text style={styles.xpText}>XP: {totalPoints.toLocaleString()}</Text>
                        <Text style={styles.xpNext}>NEXT: {pointsToNext} XP</Text>
                    </View>
                </View>

                {/* Up Next Workout */}
                <View style={styles.workoutCard}>
                    <View style={styles.workoutCardBg} />
                    <View style={styles.workoutCardOverlay} />
                    <View style={styles.workoutContent}>
                        <View style={styles.workoutHeader}>
                            <View>
                                <View style={styles.upNextBadge}>
                                    <View style={styles.pulsingDot}>
                                        <View style={styles.pulsingDotInner} />
                                    </View>
                                    <Text style={styles.upNextText}>UP NEXT</Text>
                                </View>
                                <Text style={styles.workoutTitle}>
                                    {nextWorkout ? nextWorkout.type.replace('_', ' ') : 'Tempo Run'}
                                </Text>
                                <Text style={styles.workoutTime}>📅 Today • 18:00</Text>
                            </View>
                            <View style={styles.workoutIcon}>
                                <Text style={styles.workoutIconText}>🏃</Text>
                            </View>
                        </View>
                        <View style={styles.workoutStats}>
                            <View style={styles.statBox}>
                                <View style={styles.statHeader}>
                                    <Text style={styles.statIconText}>📏</Text>
                                    <Text style={styles.statLabel}>DISTANCE</Text>
                                </View>
                                <Text style={styles.statValue}>
                                    {nextWorkout ? nextWorkout.distance_km.toFixed(1) : '8.0'} <Text style={styles.statUnit}>km</Text>
                                </Text>
                            </View>
                            <View style={styles.statBox}>
                                <View style={styles.statHeader}>
                                    <Text style={styles.statIconText}>⏱️</Text>
                                    <Text style={styles.statLabel}>PACE</Text>
                                </View>
                                <Text style={styles.statValue}>
                                    4:45 <Text style={styles.statUnit}>/km</Text>
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.startButton}>
                            <Text style={styles.playIcon}>▶</Text>
                            <Text style={styles.startButtonText}>START SESSION</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* AI Analysis */}
                <View style={styles.aiCard}>
                    <View style={styles.aiBlurLeft} />
                    <View style={styles.aiBlurRight} />
                    <View style={styles.aiCardContent}>
                        <View style={styles.aiHeader}>
                            <View>
                                <Text style={styles.aiTitle}>AI Analysis</Text>
                                <Text style={styles.aiSubtitle}>Morning Jog • Yesterday</Text>
                            </View>
                            <View style={styles.aiIcon}>
                                <Text style={styles.aiIconText}>✨</Text>
                            </View>
                        </View>
                        <View style={styles.aiStats}>
                            <View style={styles.aiPaceSection}>
                                <Text style={styles.aiPace}>5:12 <Text style={styles.aiPaceUnit}>/km</Text></Text>
                                <View style={styles.efficiencyBadge}>
                                    <Text style={styles.trendingIcon}>📈</Text>
                                    <Text style={styles.efficiencyText}>+2% EFFICIENCY</Text>
                                </View>
                            </View>
                            <View style={styles.miniChart}>
                                <View style={[styles.bar, { height: 16 }]} />
                                <View style={[styles.bar, { height: 24 }]} />
                                <View style={[styles.bar, { height: 20 }]} />
                                <View style={[styles.barActive, { height: 40 }]} />
                                <View style={[styles.bar, { height: 24 }]} />
                                <View style={[styles.bar, { height: 32 }]} />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.viewFeedbackButton}
                            onPress={() => navigation.navigate('Evolution')}
                        >
                            <Text style={styles.viewFeedbackText}>View Full Feedback</Text>
                            <Text style={styles.arrowIcon}>→</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    blurTop: {
        position: 'absolute',
        top: -100,
        left: 0,
        right: 0,
        height: 384,
        backgroundColor: colors.primaryLight,
        opacity: 0.05,
        borderRadius: 9999,
        ...(Platform.OS === 'web' ? { filter: 'blur(100px)' } : {}),
    },
    blurBottom: {
        position: 'absolute',
        bottom: -100,
        right: -50,
        width: 256,
        height: 256,
        backgroundColor: colors.primary,
        opacity: 0.1,
        borderRadius: 9999,
        ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } : {}),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.lg,
        zIndex: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: colors.borderLight,
        backgroundColor: colors.highlight,
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: colors.white,
    },
    headerText: {
        gap: 2,
    },
    welcomeText: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textMuted,
        letterSpacing: 1.5,
    },
    userName: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.extrabold,
        color: colors.text,
        letterSpacing: -0.5,
    },
    notificationButton: {
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    bellIcon: {
        fontSize: 20,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.warning,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0 0 8px rgba(255, 196, 0, 0.6)'
        } : {}),
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 120,
        gap: spacing.lg,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    badge: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        paddingVertical: spacing.md,
        borderWidth: 1,
        ...shadows.sm,
    },
    streakBadge: {
        borderColor: colors.borderLight,
    },
    memberBadge: {
        borderColor: `${colors.primary}33`,
    },
    fireIcon: {
        fontSize: 20,
    },
    premiumIcon: {
        fontSize: 20,
        color: colors.primary,
    },
    badgeContent: {
        gap: 0,
    },
    badgeValue: {
        fontSize: typography.fontSizes.base,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    badgeLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeights.semibold,
        color: colors.textMuted,
        letterSpacing: 1,
    },
    memberLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        letterSpacing: 1,
    },
    levelCard: {
        position: 'relative',
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        borderWidth: 1,
        borderColor: colors.borderLight,
        padding: spacing.lg,
        overflow: 'hidden',
        ...shadows.sm,
    },
    levelCardBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 128,
        height: 128,
        opacity: 0.05,
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.md,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    levelDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0 0 6px #00D4FF'
        } : {}),
    },
    levelBadgeText: {
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: colors.primaryLight,
        letterSpacing: 2,
    },
    levelTitle: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.extrabold,
        color: colors.text,
        letterSpacing: -0.5,
    },
    levelVersion: {
        fontSize: typography.fontSizes.lg,
        color: colors.primary,
    },
    progressBarContainer: {
        marginBottom: spacing.md,
    },
    progressBarBg: {
        height: 8,
        width: '100%',
        backgroundColor: colors.highlight,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
        ...(Platform.OS === 'web' ? {
            backgroundImage: 'linear-gradient(90deg, #3B82F6 0%, #00D4FF 100%)',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.4)',
        } : {}),
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    xpText: {
        fontSize: 11,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
        fontVariant: ['tabular-nums'],
    },
    xpNext: {
        fontSize: 11,
        fontWeight: typography.fontWeights.bold,
        color: colors.primaryLight,
        fontVariant: ['tabular-nums'],
    },
    workoutCard: {
        position: 'relative',
        borderRadius: borderRadius['3xl'],
        borderWidth: 1,
        borderColor: colors.borderLight,
        overflow: 'hidden',
        ...shadows.sm,
    },
    workoutCardBg: {
        position: 'absolute',
        inset: 0,
        backgroundColor: colors.card,
        opacity: 0.4,
    },
    workoutCardOverlay: {
        position: 'absolute',
        inset: 0,
        ...(Platform.OS === 'web' ? {
            backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.85) 50%, #FFFFFF 100%)',
        } : {
            backgroundColor: colors.white,
        }),
    },
    workoutContent: {
        position: 'relative',
        zIndex: 10,
        padding: spacing.lg,
        gap: spacing.lg,
    },
    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    upNextBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: `${colors.primary}33`,
        marginBottom: spacing.md,
        ...shadows.sm,
        alignSelf: 'flex-start',
    },
    pulsingDot: {
        position: 'relative',
        width: 8,
        height: 8,
    },
    pulsingDotInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    upNextText: {
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        letterSpacing: 1.5,
    },
    workoutTitle: {
        fontSize: typography.fontSizes['3xl'],
        fontWeight: typography.fontWeights.extrabold,
        color: colors.text,
        letterSpacing: -0.5,
        textTransform: 'capitalize',
    },
    workoutTime: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    workoutIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius['2xl'],
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.md,
    },
    workoutIconText: {
        fontSize: 30,
    },
    workoutStats: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statBox: {
        flex: 1,
        backgroundColor: `${colors.highlight}CC`,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.white,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    statIconText: {
        fontSize: 18,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: colors.textMuted,
        letterSpacing: 1.5,
    },
    statValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        fontVariant: ['tabular-nums'],
    },
    statUnit: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.normal,
        color: colors.textMuted,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.xl,
        paddingVertical: spacing.md,
        ...shadows.neon,
    },
    playIcon: {
        fontSize: 16,
    },
    startButtonText: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.extrabold,
        color: colors.white,
        letterSpacing: 2,
    },
    aiCard: {
        position: 'relative',
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        borderWidth: 1,
        borderColor: colors.borderLight,
        padding: spacing.lg,
        overflow: 'hidden',
        ...shadows.sm,
    },
    aiBlurLeft: {
        position: 'absolute',
        left: -40,
        top: -40,
        width: 160,
        height: 160,
        backgroundColor: colors.primaryLight,
        opacity: 0.1,
        borderRadius: 9999,
        ...(Platform.OS === 'web' ? { filter: 'blur(60px)' } : {}),
    },
    aiBlurRight: {
        position: 'absolute',
        right: -40,
        bottom: -40,
        width: 160,
        height: 160,
        backgroundColor: colors.primary,
        opacity: 0.1,
        borderRadius: 9999,
        ...(Platform.OS === 'web' ? { filter: 'blur(60px)' } : {}),
    },
    aiCardContent: {
        position: 'relative',
        zIndex: 10,
        gap: spacing.lg,
    },
    aiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    aiTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    aiSubtitle: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
        marginTop: 4,
    },
    aiIcon: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.highlight,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiIconText: {
        fontSize: 20,
    },
    aiStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    aiPaceSection: {
        flex: 1,
    },
    aiPace: {
        fontSize: typography.fontSizes['3xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1,
    },
    aiPaceUnit: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
    },
    efficiencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: `${colors.success}1A`,
        borderWidth: 1,
        borderColor: `${colors.success}33`,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginTop: spacing.sm,
        alignSelf: 'flex-start',
    },
    trendingIcon: {
        fontSize: 14,
    },
    efficiencyText: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.success,
        letterSpacing: 0.5,
    },
    miniChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
        height: 48,
    },
    bar: {
        width: 6,
        backgroundColor: colors.border,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
    },
    barActive: {
        width: 6,
        backgroundColor: colors.primary,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0 0 8px rgba(0, 212, 255, 0.4)'
        } : {}),
    },
    viewFeedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.highlight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
    viewFeedbackText: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
    },
    arrowIcon: {
        fontSize: typography.fontSizes.sm,
        color: colors.primary,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: `${colors.white}E6`,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        height: 72,
        zIndex: 50,
        ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)' } : {}),
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    navItemActive: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        height: 40,
        ...shadows.neon,
    },
    navIcon: {
        fontSize: 24,
        opacity: 0.6,
    },
    navIconActive: {
        fontSize: 24,
    },
    navLabelActive: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.white,
    },
});
