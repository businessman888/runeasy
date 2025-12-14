import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useStatsStore } from '../stores/statsStore';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.lg * 2;

export function EvolutionScreen() {
    const { weeklyStats, monthlyStats, paceProgression, summary, fetchAllStats, isLoading } = useStatsStore();
    const [refreshing, setRefreshing] = React.useState(false);

    React.useEffect(() => {
        fetchAllStats();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllStats();
        setRefreshing(false);
    };

    const maxDistance = Math.max(...weeklyStats.map(w => w.total_distance_km), 1);
    const maxPace = Math.max(...paceProgression.map(p => p.pace), 1);
    const minPace = Math.min(...paceProgression.filter(p => p.pace > 0).map(p => p.pace), maxPace);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Summary Cards */}
                {summary && (
                    <View style={styles.summaryGrid}>
                        <SummaryCard
                            icon="🏃"
                            value={`${summary.total_distance_km}`}
                            unit="km"
                            label="Total"
                        />
                        <SummaryCard
                            icon="⏱"
                            value={`${summary.total_time_hours}`}
                            unit="hrs"
                            label="Tempo"
                        />
                        <SummaryCard
                            icon="🏔"
                            value={`${summary.total_elevation_m}`}
                            unit="m"
                            label="Elevação"
                        />
                        <SummaryCard
                            icon="🔥"
                            value={`${summary.total_runs}`}
                            unit=""
                            label="Corridas"
                        />
                    </View>
                )}

                {/* Weekly Distance Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Distância Semanal</Text>
                    <View style={styles.chartCard}>
                        <View style={styles.barChart}>
                            {weeklyStats.slice(-8).map((week, index) => (
                                <View key={week.week_start} style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: (week.total_distance_km / maxDistance) * 100,
                                                backgroundColor: index === weeklyStats.slice(-8).length - 1
                                                    ? colors.primary
                                                    : colors.primaryLight,
                                            },
                                        ]}
                                    />
                                    <Text style={styles.barLabel}>
                                        {new Date(week.week_start).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {weeklyStats.length > 0 && (
                            <View style={styles.chartLegend}>
                                <Text style={styles.legendText}>
                                    🏆 Melhor: {Math.max(...weeklyStats.map(w => w.total_distance_km)).toFixed(1)} km
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Pace Progression */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Evolução de Pace</Text>
                    <View style={styles.chartCard}>
                        <View style={styles.paceChart}>
                            {paceProgression.slice(-10).map((p, index) => {
                                const pacePercent = maxPace > minPace
                                    ? 100 - ((p.pace - minPace) / (maxPace - minPace) * 80)
                                    : 50;
                                return (
                                    <View key={`${p.date}-${index}`} style={styles.pacePoint}>
                                        <View
                                            style={[
                                                styles.paceValue,
                                                { bottom: `${pacePercent}%` }
                                            ]}
                                        />
                                        <Text style={styles.paceLabel}>{p.pace.toFixed(1)}</Text>
                                    </View>
                                );
                            })}
                        </View>
                        <Text style={styles.paceHint}>
                            ⬆️ Menor pace = Mais rápido
                        </Text>
                    </View>
                </View>

                {/* Monthly Consistency */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎯 Consistência Mensal</Text>
                    <View style={styles.consistencyList}>
                        {monthlyStats.map((month) => (
                            <View key={month.month} style={styles.consistencyItem}>
                                <Text style={styles.consistencyMonth}>
                                    {formatMonth(month.month)}
                                </Text>
                                <View style={styles.consistencyBar}>
                                    <View
                                        style={[
                                            styles.consistencyFill,
                                            { width: `${month.consistency_percent}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.consistencyPercent}>
                                    {month.consistency_percent}%
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Personal Records */}
                {summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏆 Recordes Pessoais</Text>
                        <View style={styles.recordsGrid}>
                            <View style={styles.recordCard}>
                                <Text style={styles.recordIcon}>⚡</Text>
                                <Text style={styles.recordValue}>
                                    {summary.best_pace ? `${summary.best_pace.toFixed(2)} min/km` : '-'}
                                </Text>
                                <Text style={styles.recordLabel}>Melhor Pace</Text>
                            </View>
                            <View style={styles.recordCard}>
                                <Text style={styles.recordIcon}>🏃‍♂️</Text>
                                <Text style={styles.recordValue}>
                                    {summary.longest_run_km ? `${summary.longest_run_km} km` : '-'}
                                </Text>
                                <Text style={styles.recordLabel}>Maior Distância</Text>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

function SummaryCard({ icon, value, unit, label }: {
    icon: string;
    value: string;
    unit: string;
    label: string;
}) {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>{icon}</Text>
            <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValue}>{value}</Text>
                <Text style={styles.summaryUnit}>{unit}</Text>
            </View>
            <Text style={styles.summaryLabel}>{label}</Text>
        </View>
    );
}

function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[parseInt(month, 10) - 1] || monthStr;
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
        paddingBottom: spacing['2xl'],
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    summaryCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    summaryIcon: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    summaryValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    summaryValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: '700',
        color: colors.primary,
    },
    summaryUnit: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginLeft: 2,
    },
    summaryLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    chartCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.sm,
    },
    barChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
        marginBottom: spacing.sm,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 24,
        borderRadius: 4,
        minHeight: 4,
    },
    barLabel: {
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 4,
    },
    chartLegend: {
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    legendText: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
    },
    paceChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 100,
        position: 'relative',
    },
    pacePoint: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
    },
    paceValue: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        position: 'absolute',
    },
    paceLabel: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    paceHint: {
        fontSize: typography.fontSizes.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    consistencyList: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.sm,
    },
    consistencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    consistencyMonth: {
        width: 40,
        fontSize: typography.fontSizes.sm,
        color: colors.text,
        fontWeight: '500',
    },
    consistencyBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.background,
        borderRadius: 4,
        marginHorizontal: spacing.sm,
        overflow: 'hidden',
    },
    consistencyFill: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: 4,
    },
    consistencyPercent: {
        width: 40,
        fontSize: typography.fontSizes.sm,
        color: colors.primary,
        fontWeight: '600',
        textAlign: 'right',
    },
    recordsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    recordCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    recordIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    recordValue: {
        fontSize: typography.fontSizes.lg,
        fontWeight: '700',
        color: colors.text,
    },
    recordLabel: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});
