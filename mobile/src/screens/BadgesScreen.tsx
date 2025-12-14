import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useGamificationStore } from '../stores';

export function BadgesScreen() {
    const { badges, fetchBadges, isLoading } = useGamificationStore();

    React.useEffect(() => {
        fetchBadges();
    }, []);

    const earnedBadges = badges.filter(b => b.earned);
    const lockedBadges = badges.filter(b => !b.earned);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Stats */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{earnedBadges.length}</Text>
                        <Text style={styles.statLabel}>Conquistadas</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{badges.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0}%
                        </Text>
                        <Text style={styles.statLabel}>Progresso</Text>
                    </View>
                </View>

                {/* Earned Badges */}
                {earnedBadges.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏆 Conquistadas</Text>
                        <View style={styles.badgesGrid}>
                            {earnedBadges.map((badge) => (
                                <View key={badge.id} style={styles.badgeCard}>
                                    <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                    <Text style={styles.badgeDescription} numberOfLines={2}>
                                        {badge.description}
                                    </Text>
                                    {badge.earned_at && (
                                        <Text style={styles.earnedDate}>
                                            {formatDate(badge.earned_at)}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Locked Badges */}
                {lockedBadges.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔒 Disponíveis</Text>
                        <View style={styles.badgesGrid}>
                            {lockedBadges.map((badge) => (
                                <View key={badge.id} style={[styles.badgeCard, styles.lockedCard]}>
                                    <View style={styles.lockedOverlay}>
                                        <Text style={styles.lockedIcon}>🔒</Text>
                                    </View>
                                    <Text style={[styles.badgeIcon, styles.lockedBadgeIcon]}>
                                        {badge.icon}
                                    </Text>
                                    <Text style={[styles.badgeName, styles.lockedText]}>
                                        {badge.name}
                                    </Text>
                                    <Text style={[styles.badgeDescription, styles.lockedText]} numberOfLines={2}>
                                        {badge.description}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Empty State */}
                {badges.length === 0 && !isLoading && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🏅</Text>
                        <Text style={styles.emptyTitle}>Nenhuma badge ainda</Text>
                        <Text style={styles.emptyText}>
                            Complete treinos para ganhar suas primeiras badges!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.lg,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: colors.border,
        marginHorizontal: spacing.md,
    },
    statValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
    },
    statLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    badgeCard: {
        width: '47%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    lockedCard: {
        opacity: 0.7,
    },
    lockedOverlay: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
    },
    lockedIcon: {
        fontSize: 16,
    },
    badgeIcon: {
        fontSize: 48,
        marginBottom: spacing.sm,
    },
    lockedBadgeIcon: {
        opacity: 0.4,
    },
    badgeName: {
        fontSize: typography.fontSizes.md,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    lockedText: {
        color: colors.textMuted,
    },
    badgeDescription: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
    earnedDate: {
        fontSize: typography.fontSizes.xs,
        color: colors.primary,
        marginTop: spacing.sm,
        fontWeight: typography.fontWeights.medium,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    emptyText: {
        fontSize: typography.fontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
