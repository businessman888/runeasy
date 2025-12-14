import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useTrainingStore } from '../stores';

export function CalendarScreen({ navigation }: any) {
    const { workouts, fetchWorkouts } = useTrainingStore();
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    React.useEffect(() => {
        const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        fetchWorkouts(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    }, [currentMonth]);

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getWorkoutForDay = (day: number | null) => {
        if (!day) return null;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return workouts.find(w => {
            const workoutDate = new Date(w.scheduled_date);
            return workoutDate.getDate() === day &&
                workoutDate.getMonth() === date.getMonth();
        });
    };

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const days = getDaysInMonth();
    const selectedWorkout = getWorkoutForDay(selectedDate.getDate());

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
                <View style={styles.headerCenter}>
                    <Text style={styles.headerSubtitle}>AGENDA</Text>
                    <Text style={styles.headerTitle}>Calendário</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Text style={styles.bellIcon}>🔔</Text>
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Stats Bar */}
                <View style={styles.statsBar}>
                    <View style={styles.statsGradient} />
                    <View style={styles.statItem}>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>VOLUME</Text>
                            <View style={styles.statValueRow}>
                                <Text style={styles.statValue}>124</Text>
                                <Text style={styles.statUnit}>km</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>FREQUÊNCIA</Text>
                            <View style={styles.statValueRow}>
                                <Text style={styles.statValue}>18</Text>
                                <Text style={styles.statUnitMuted}>/ 22</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    <Text style={styles.monthTitle}>
                        {monthNames[currentMonth.getMonth()]} <Text style={styles.yearText}>{currentMonth.getFullYear()}</Text>
                    </Text>
                    <View style={styles.monthNav}>
                        <TouchableOpacity
                            style={styles.monthNavButton}
                            onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        >
                            <Text style={styles.chevronIcon}>‹</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.monthNavButton}
                            onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        >
                            <Text style={styles.chevronIcon}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarContainer}>
                    {/* Week days header */}
                    <View style={styles.weekDaysRow}>
                        {weekDays.map((day, i) => (
                            <Text key={i} style={styles.weekDayText}>{day}</Text>
                        ))}
                    </View>

                    {/* Days grid */}
                    <View style={styles.daysGrid}>
                        {days.map((day, index) => {
                            const workout = getWorkoutForDay(day);
                            const isSelected = day === selectedDate.getDate();
                            const isToday = day === new Date().getDate() &&
                                currentMonth.getMonth() === new Date().getMonth();

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.dayCell}
                                    onPress={() => day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                                    disabled={!day}
                                >
                                    {day ? (
                                        <View style={[
                                            styles.dayContent,
                                            isSelected && styles.daySelected,
                                            isToday && !isSelected && styles.dayToday
                                        ]}>
                                            <Text style={[
                                                styles.dayNumber,
                                                isSelected && styles.dayNumberSelected,
                                                workout && styles.dayNumberWithWorkout
                                            ]}>
                                                {day}
                                            </Text>
                                            {isSelected && workout && (
                                                <View style={styles.selectedWorkoutBadge}>
                                                    <Text style={styles.selectedWorkoutText}>10k</Text>
                                                </View>
                                            )}
                                            {workout && !isSelected && (
                                                <View style={styles.workoutIndicator}>
                                                    {workout.status === 'completed' ? (
                                                        <View style={styles.completedDot} />
                                                    ) : workout.status === 'skipped' ? (
                                                        <View style={styles.skippedIndicator}>
                                                            <Text style={styles.skippedX}>X</Text>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.plannedBar} />
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Workout Detail Card */}
                {selectedWorkout && (
                    <View style={styles.detailCard}>
                        <View style={styles.dragHandle} />
                        <View style={styles.detailContent}>
                            <View style={styles.detailHeader}>
                                <Text style={styles.detailDate}>
                                    Quinta, {selectedDate.getDate()} {monthNames[selectedDate.getMonth()].slice(0, 3)}
                                </Text>
                                <View style={styles.todayBadge}>
                                    <Text style={styles.todayBadgeText}>TREINO HOJE</Text>
                                </View>
                            </View>

                            <View style={styles.workoutCard}>
                                <View style={styles.workoutCardInner}>
                                    <View style={styles.workoutCardHeader}>
                                        <View>
                                            <View style={styles.workoutTypeBadge}>
                                                <Text style={styles.workoutTypeText}>
                                                    {selectedWorkout.type.replace('_', ' ').toUpperCase()}
                                                </Text>
                                                <View style={styles.pulsingDotSmall} />
                                            </View>
                                            <Text style={styles.workoutCardTitle}>Longo Aeróbico</Text>
                                        </View>
                                        <TouchableOpacity style={styles.playButton}>
                                            <Text style={styles.playIcon}>▶</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.workoutMetrics}>
                                        <View style={styles.metricBox}>
                                            <Text style={styles.metricIcon}>📏</Text>
                                            <Text style={styles.metricValue}>
                                                {selectedWorkout.distance_km}<Text style={styles.metricUnit}>km</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.metricBox}>
                                            <Text style={styles.metricIcon}>⏱️</Text>
                                            <Text style={styles.metricValue}>
                                                55<Text style={styles.metricUnit}>min</Text>
                                            </Text>
                                        </View>
                                        <View style={styles.metricBox}>
                                            <Text style={styles.metricIcon}>⚡</Text>
                                            <Text style={styles.metricValue}>5:30</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.progressBar} />
                            </View>

                            {/* Next Workout */}
                            <View style={styles.nextWorkoutSection}>
                                <Text style={styles.nextWorkoutLabel}>PRÓXIMO: Sexta-feira</Text>
                                <View style={styles.nextWorkoutCard}>
                                    <View style={styles.nextWorkoutIcon}>
                                        <Text style={styles.nextWorkoutIconText}>🏃</Text>
                                    </View>
                                    <View style={styles.nextWorkoutInfo}>
                                        <Text style={styles.nextWorkoutTitle}>Intervalado 8x400m</Text>
                                        <Text style={styles.nextWorkoutSubtitle}>Pista de Atletismo • Alta Intensidade</Text>
                                    </View>
                                    <Text style={styles.chevronRight}>›</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <View style={styles.fabBorder} />
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
        backgroundColor: '#F2F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    backIcon: {
        fontSize: 20,
        color: colors.text,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.semibold,
        color: colors.textSecondary,
        letterSpacing: 2,
    },
    headerTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    notificationButton: {
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    bellIcon: {
        fontSize: 24,
    },
    notificationDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.warning,
        borderWidth: 2,
        borderColor: colors.white,
    },
    scrollView: {
        flex: 1,
    },
    statsBar: {
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: colors.text,
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        borderRadius: borderRadius['3xl'],
        padding: 4,
        overflow: 'hidden',
        ...shadows.sm,
    },
    statsGradient: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '50%',
        height: '100%',
        ...(Platform.OS === 'web' ? {
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1))',
        } : {
            backgroundColor: `${colors.primary}1A`,
        }),
    },
    statItem: {
        flex: 1,
        paddingVertical: spacing.md,
        position: 'relative',
        zIndex: 10,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: spacing.sm,
    },
    statContent: {
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: '#9CA3AF',
        letterSpacing: 1.5,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    statValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.white,
        letterSpacing: -1,
    },
    statUnit: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.primary,
    },
    statUnitMuted: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: '#6B7280',
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    monthTitle: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        letterSpacing: -0.5,
    },
    yearText: {
        fontWeight: typography.fontWeights.normal,
        color: colors.textSecondary,
    },
    monthNav: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    monthNavButton: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronIcon: {
        fontSize: 18,
        color: colors.textSecondary,
    },
    calendarContainer: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: colors.textSecondary,
        letterSpacing: 1.5,
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    dayCell: {
        width: '13%',
        aspectRatio: 1,
    },
    dayContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius['2xl'],
        position: 'relative',
    },
    daySelected: {
        backgroundColor: colors.text,
        ...shadows.neon,
        transform: [{ scale: 1.1 }],
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    dayToday: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    dayNumber: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.medium,
        color: colors.textSecondary,
    },
    dayNumberSelected: {
        fontWeight: typography.fontWeights.bold,
        color: colors.white,
    },
    dayNumberWithWorkout: {
        color: colors.text,
    },
    selectedWorkoutBadge: {
        position: 'absolute',
        bottom: 6,
        backgroundColor: `${colors.primary}33`,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    selectedWorkoutText: {
        fontSize: 9,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
    },
    workoutIndicator: {
        position: 'absolute',
        bottom: 6,
    },
    completedDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
    },
    skippedIndicator: {
        position: 'relative',
    },
    skippedX: {
        fontSize: 8,
        fontWeight: typography.fontWeights.bold,
        color: colors.error,
    },
    plannedBar: {
        width: 16,
        height: 4,
        borderRadius: 2,
        backgroundColor: `${colors.primary}CC`,
    },
    detailCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: spacing.md,
        marginTop: spacing.lg,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 12,
            },
            web: {
                boxShadow: '0 -10px 40px -15px rgba(0,0,0,0.1)',
            },
        }),
    },
    dragHandle: {
        width: 48,
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: spacing.lg,
    },
    detailContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 100,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    detailDate: {
        fontSize: typography.fontSizes.xl,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    todayBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        backgroundColor: colors.highlight,
    },
    todayBadgeText: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.textSecondary,
        letterSpacing: 1,
    },
    workoutCard: {
        position: 'relative',
        backgroundColor: `${colors.highlight}80`,
        borderRadius: borderRadius['3xl'],
        borderWidth: 1,
        borderColor: colors.border,
        padding: 4,
        overflow: 'hidden',
    },
    workoutCardInner: {
        backgroundColor: colors.white,
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        ...shadows.sm,
    },
    workoutCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    workoutTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: colors.text,
        borderRadius: borderRadius.md,
        marginBottom: 4,
        alignSelf: 'flex-start',
    },
    workoutTypeText: {
        fontSize: 10,
        fontWeight: typography.fontWeights.bold,
        color: colors.white,
        letterSpacing: 1,
    },
    pulsingDotSmall: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.warning,
        ...(Platform.OS === 'web' ? {
            boxShadow: '0 0 8px rgba(255, 196, 0, 0.6)'
        } : {}),
    },
    workoutCardTitle: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
        letterSpacing: -0.5,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)',
            },
        }),
    },
    playIcon: {
        fontSize: 28,
        color: colors.primary,
    },
    workoutMetrics: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    metricBox: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
        padding: spacing.sm,
        borderRadius: borderRadius.xl,
        backgroundColor: `${colors.highlight}80`,
    },
    metricIcon: {
        fontSize: 18,
    },
    metricValue: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    metricUnit: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.medium,
        color: colors.textMuted,
        marginLeft: 2,
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 4,
        width: '33%',
        borderRadius: borderRadius.sm,
        ...(Platform.OS === 'web' ? {
            backgroundImage: 'linear-gradient(90deg, #00D4FF, #00FFFF)',
        } : {
            backgroundColor: colors.primary,
        }),
    },
    nextWorkoutSection: {
        marginTop: spacing['2xl'],
    },
    nextWorkoutLabel: {
        fontSize: typography.fontSizes.xs,
        fontWeight: typography.fontWeights.bold,
        color: colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: spacing.md,
        paddingLeft: spacing.sm,
    },
    nextWorkoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius['2xl'],
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: `${colors.highlight}4D`,
    },
    nextWorkoutIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.xl,
        backgroundColor: `${colors.primary}1A`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextWorkoutIconText: {
        fontSize: 20,
    },
    nextWorkoutInfo: {
        flex: 1,
    },
    nextWorkoutTitle: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.bold,
        color: colors.text,
    },
    nextWorkoutSubtitle: {
        fontSize: typography.fontSizes.xs,
        color: colors.textSecondary,
        marginTop: 2,
    },
    chevronRight: {
        fontSize: 24,
        color: colors.textSecondary,
    },
    fab: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
            web: {
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.4)',
            },
        }),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    fabBorder: {
        position: 'absolute',
        inset: 0,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: `${colors.primary}40`,
    },
    fabIcon: {
        fontSize: 30,
        color: colors.white,
    },
});
