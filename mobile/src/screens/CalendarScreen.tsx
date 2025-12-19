import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    Image,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { useTrainingStore } from '../stores';

// SVG Icons
function BackIcon({ size = 24, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>←</Text>;
}

function BellIcon({ size = 24, color = '#EBEBF5' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12.7697 1.99939 13.5343 2.12576 14.263 2.374C13.5725 3.08786 13.1375 4.01009 13.0259 4.99696C12.9143 5.98384 13.1323 6.97991 13.646 7.82993C14.1596 8.67996 14.9401 9.33618 15.8656 9.69633C16.7912 10.0565 17.8099 10.1003 18.763 9.821L19 9.743V12.527C19.0001 12.643 19.0204 12.758 19.06 12.867L19.106 12.974L20.822 16.407C20.9015 16.566 20.9413 16.7419 20.9379 16.9196C20.9346 17.0974 20.8882 17.2717 20.8028 17.4276C20.7174 17.5835 20.5955 17.7164 20.4475 17.8148C20.2994 17.9133 20.1298 17.9744 19.953 17.993L19.838 17.999H4.16197C3.98413 17.9991 3.80894 17.956 3.65139 17.8735C3.49385 17.791 3.35865 17.6715 3.25739 17.5254C3.15613 17.3792 3.09182 17.2106 3.06997 17.0341C3.04813 16.8576 3.0694 16.6785 3.13197 16.512L3.17797 16.407L4.89497 12.974C4.94658 12.8702 4.97974 12.7582 4.99297 12.643L4.99997 12.528V9C4.99997 7.14349 5.73747 5.36301 7.05022 4.05025C8.36298 2.7375 10.1435 2 12 2ZM17.5 3C18.163 3 18.7989 3.26339 19.2677 3.73224C19.7366 4.20108 20 4.83696 20 5.5C20 6.16304 19.7366 6.79893 19.2677 7.26777C18.7989 7.73661 18.163 8 17.5 8C16.8369 8 16.201 7.73661 15.7322 7.26777C15.2634 6.79893 15 6.16304 15 5.5C15 4.83696 15.2634 4.20108 15.7322 3.73224C16.201 3.26339 16.8369 3 17.5 3ZM12 21C11.3793 21.0003 10.7738 20.8081 10.267 20.4499C9.76013 20.0917 9.37685 19.5852 9.16997 19H14.83C14.6231 19.5852 14.2398 20.0917 13.733 20.4499C13.2261 20.8081 12.6206 21.0003 12 21Z" fill={color} />
            </svg>
        );
    }
    return <Text style={{ fontSize: size }}>🔔</Text>;
}

function CheckIcon({ size = 16, color = '#32CD32' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>✓</Text>;
}

function TimerIcon({ size = 18, color = '#EBEBF5' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="13" r="8" stroke={color} strokeWidth="2" />
                <path d="M12 9V13L15 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
                <path d="M9 3H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size }}>⏱️</Text>;
}

function PaceClockIcon({ size = 18, color = '#EBEBF5' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
                <path d="M12 7V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size }}>⏱️</Text>;
}

function ArrowRightIcon({ size = 24, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>→</Text>;
}

// Proximo workout icon with container
function ProximoIcon({ size = 47 }: { size?: number }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 47 47" fill="none">
                <rect x="0.5" y="0.5" width="46" height="46" rx="9.5" fill="#007F99" fillOpacity="0.5" />
                <rect x="0.5" y="0.5" width="46" height="46" rx="9.5" stroke="#00D4FF" />
                <path d="M27.25 18.5C27.8467 18.5 28.419 18.2629 28.841 17.841C29.263 17.419 29.5 16.8467 29.5 16.25C29.5 15.6533 29.263 15.081 28.841 14.659C28.419 14.2371 27.8467 14 27.25 14C26.6533 14 26.081 14.2371 25.659 14.659C25.2371 15.081 25 15.6533 25 16.25C25 16.8467 25.2371 17.419 25.659 17.841C26.081 18.2629 26.6533 18.5 27.25 18.5ZM24.383 18.499C22.888 18.289 19.471 18.896 18.063 22.649C17.9699 22.8974 17.9793 23.1726 18.0891 23.414C18.1989 23.6555 18.4001 23.8434 18.6485 23.9365C18.8969 24.0296 19.1721 24.0202 19.4135 23.9104C19.655 23.8006 19.8429 23.5994 19.936 23.351C20.52 21.796 21.572 21.035 22.51 20.696L21.34 23.702C21.3207 23.752 21.3057 23.802 21.295 23.852C21.2471 24.0057 21.237 24.1687 21.2655 24.3271C21.2941 24.4855 21.3604 24.6347 21.459 24.762L25.021 29.369L25.252 33.062C25.2586 33.1942 25.2913 33.3238 25.3484 33.4432C25.4054 33.5627 25.4856 33.6696 25.5843 33.7578C25.6829 33.846 25.7981 33.9138 25.9232 33.9571C26.0483 34.0005 26.1807 34.0186 26.3128 34.0104C26.4449 34.0022 26.574 33.9678 26.6928 33.9093C26.8115 33.8508 26.9174 33.7693 27.0044 33.6696C27.0914 33.5698 27.1578 33.4538 27.1996 33.3282C27.2414 33.2026 27.2578 33.07 27.248 32.938L26.978 28.631L24.886 25.924L26.259 23.263L26.352 23.397C26.6124 23.7754 26.9951 24.0526 27.4358 24.1821C27.8765 24.3116 28.3483 24.2854 28.772 24.108L30.887 23.222C31.1255 23.1155 31.3129 22.9199 31.409 22.677C31.5051 22.4341 31.5024 22.1632 31.4014 21.9223C31.3005 21.6814 31.1092 21.4896 30.8686 21.3879C30.628 21.2861 30.3572 21.2826 30.114 21.378L27.999 22.264L26.393 19.929C26.0232 19.2888 25.4326 18.8053 24.732 18.569C24.6188 18.5308 24.5012 18.5073 24.382 18.499" fill="#00D4FF" />
                <path d="M20.4499 28.45L21.2769 25.998L22.7459 27.898L22.3439 29.089C22.2027 29.5078 21.9267 29.868 21.559 30.1133C21.1914 30.3586 20.7529 30.4753 20.3119 30.445L17.4319 30.248C17.3009 30.2391 17.1729 30.2044 17.0552 30.146C16.9375 30.0876 16.8325 30.0066 16.7462 29.9076C16.6598 29.8086 16.5938 29.6936 16.5519 29.5691C16.51 29.4446 16.493 29.3131 16.5019 29.182C16.5109 29.0509 16.5455 28.9229 16.6039 28.8053C16.6623 28.6876 16.7434 28.5826 16.8423 28.4962C16.9413 28.4099 17.0564 28.3439 17.1809 28.3019C17.3054 28.26 17.4369 28.2431 17.5679 28.252L20.4499 28.45Z" fill="#00D4FF" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size }}>🏃</Text>;
}

export function CalendarScreen({ navigation }: any) {
    const { workouts, fetchWorkouts } = useTrainingStore();
    const [selectedDate, setSelectedDate] = React.useState(12);
    const [currentMonth, setCurrentMonth] = React.useState(new Date(2023, 9, 1)); // October 2023

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

    // Mock workout data based on Figma design
    const getWorkoutStatus = (day: number | null) => {
        if (!day) return null;
        // Days with completed workouts (green check)
        if ([1, 2, 3, 4, 5, 8, 9, 10].includes(day)) return 'completed';
        // Days with planned workouts (cyan indicator)
        if ([12, 15, 22, 23].includes(day)) return 'planned';
        return null;
    };

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const days = getDaysInMonth();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <BackIcon size={24} color="#00D4FF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerSubtitle}>Agenda</Text>
                        <Text style={styles.headerTitle}>Calendário</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <BellIcon size={24} color="#EBEBF5" />
                    </TouchableOpacity>
                </View>

                {/* Stats Bar */}
                <View style={styles.statsBar}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Volume</Text>
                        <View style={styles.statValueRow}>
                            <Text style={styles.statValue}>124</Text>
                            <Text style={styles.statUnit}> km</Text>
                        </View>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Frequência</Text>
                        <View style={styles.statValueRow}>
                            <Text style={styles.statValue}>18</Text>
                            <Text style={styles.statUnitMuted}> /22</Text>
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
                            const workoutStatus = getWorkoutStatus(day);
                            const isSelected = day === selectedDate;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.dayCell}
                                    onPress={() => day && setSelectedDate(day)}
                                    disabled={!day}
                                >
                                    {day ? (
                                        <View style={[
                                            styles.dayContent,
                                            isSelected && styles.daySelected,
                                        ]}>
                                            <Text style={[
                                                styles.dayNumber,
                                                isSelected && styles.dayNumberSelected,
                                            ]}>
                                                {day}
                                            </Text>
                                            {/* Workout indicator */}
                                            {workoutStatus === 'completed' && !isSelected && (
                                                <View style={styles.completedIndicator}>
                                                    <CheckIcon size={14} color="#32CD32" />
                                                </View>
                                            )}
                                            {workoutStatus === 'planned' && !isSelected && (
                                                <View style={styles.plannedIndicator} />
                                            )}
                                        </View>
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Legend - inside calendar card */}
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={styles.legendLine} />
                            <Text style={styles.legendText}>Rodagem</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendLine, styles.legendLineCyan]} />
                            <Text style={styles.legendText}>Intervalado</Text>
                        </View>
                    </View>
                </View>

                {/* Today's Workouts Section */}
                <View style={styles.todaySection}>
                    <View style={styles.todaySectionHeader}>
                        <View>
                            <Text style={styles.todayDate}>• Hoje, 12 SET</Text>
                            <Text style={styles.todayTitle}>Treinos do dia</Text>
                        </View>
                        <View style={styles.totalKm}>
                            <Text style={styles.totalKmValue}>8 <Text style={styles.totalKmUnit}>km</Text></Text>
                            <Text style={styles.totalKmLabel}>total</Text>
                        </View>
                    </View>

                    {/* Workout Detail Card */}
                    <View style={styles.workoutDetailCard}>
                        {/* Card Top Section */}
                        <View style={styles.cardTopSection}>
                            <View style={styles.workoutDetailHeader}>
                                <View style={styles.intensityBadge}>
                                    <Text style={styles.intensityText}>ALTA INTENSIDADE</Text>
                                </View>
                                <View style={styles.pendingBadge}>
                                    <View style={styles.pendingDot} />
                                    <Text style={styles.pendingText}>Pendente</Text>
                                </View>
                            </View>

                            <View style={styles.workoutDetailBody}>
                                <View style={styles.workoutInfo}>
                                    <Text style={styles.workoutTitle}>Intervalados - 8x400m</Text>
                                    <Text style={styles.workoutDescription}>Aquecimento 2km - 8 tiros - Desaquecimento</Text>
                                    <View style={styles.workoutMetrics}>
                                        <View style={styles.metricItem}>
                                            <TimerIcon size={20} color="#00D4FF" />
                                            <Text style={styles.metricText}>45 min</Text>
                                        </View>
                                        <View style={styles.metricItem}>
                                            <PaceClockIcon size={20} color="#00D4FF" />
                                            <Text style={styles.metricText}>4:15 /km</Text>
                                        </View>
                                    </View>
                                </View>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=100&h=100&fit=crop' }}
                                    style={styles.workoutImage}
                                />
                            </View>
                        </View>

                        {/* View Details Button - Bottom Section of Card */}
                        <TouchableOpacity style={styles.viewDetailsButton}>
                            <Text style={styles.viewDetailsText}>Ver detalhes do  treino</Text>
                            <ArrowRightIcon size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Next Workout Section */}
                    <View style={styles.nextWorkoutSection}>
                        <View style={styles.nextWorkoutDivider} />
                        <Text style={styles.nextWorkoutLabel}>Próximo: SEXTA-FEIRA</Text>
                        <View style={styles.nextWorkoutCard}>
                            <ProximoIcon size={47} />
                            <View style={styles.nextWorkoutInfo}>
                                <Text style={styles.nextWorkoutTitle}>Longão de 5km</Text>
                                <Text style={styles.nextWorkoutSubtitle}>Corrida de rua - média intensidade</Text>
                            </View>
                            <ArrowRightIcon size={24} color="rgba(235,235,245,0.3)" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A18',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: typography.fontSizes.xs,
        color: '#00D4FF',
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold as any,
        color: '#FFFFFF',
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#15152A',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        borderRadius: borderRadius['2xl'],
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 255, 0.3)',
        padding: spacing.md,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    statLabel: {
        fontSize: typography.fontSizes.xs,
        color: 'rgba(235, 235, 245, 0.6)',
        marginBottom: 4,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    statValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold as any,
        color: '#FFFFFF',
    },
    statUnit: {
        fontSize: typography.fontSizes.sm,
        color: '#00D4FF',
    },
    statUnitMuted: {
        fontSize: typography.fontSizes.sm,
        color: 'rgba(235, 235, 245, 0.4)',
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        marginTop: spacing.md,
    },
    monthTitle: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold as any,
        color: '#FFFFFF',
    },
    yearText: {
        fontWeight: typography.fontWeights.normal as any,
        color: 'rgba(235, 235, 245, 0.4)',
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
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronIcon: {
        fontSize: 18,
        color: 'rgba(235, 235, 245, 0.6)',
    },
    calendarContainer: {
        backgroundColor: '#1C1C2E',
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        borderRadius: 24,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    weekDaysRow: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    weekDayText: {
        flex: 1,
        textAlign: 'center',
        fontSize: typography.fontSizes.sm,
        color: 'rgba(235, 235, 245, 0.4)',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    dayContent: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        position: 'relative',
    },
    daySelected: {
        backgroundColor: '#00D4FF',
        width: 40,
        height: 56,
        borderRadius: 20,
    },
    dayNumber: {
        fontSize: 16,
        color: 'rgba(235, 235, 245, 0.8)',
    },
    dayNumberSelected: {
        fontWeight: typography.fontWeights.bold as any,
        color: '#0A0A18',
    },
    completedIndicator: {
        position: 'absolute',
        bottom: -8,
    },
    plannedIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 20,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#00D4FF',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: spacing.md,
        gap: spacing.xl,
        marginTop: spacing.lg,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    legendLine: {
        width: 24,
        height: 2,
        backgroundColor: 'rgba(235, 235, 245, 0.3)',
    },
    legendLineCyan: {
        backgroundColor: '#00D4FF',
    },
    legendText: {
        fontSize: 16,
        color: 'rgba(235, 235, 245, 0.6)',
    },
    todaySection: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: 120,
    },
    todaySectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    todayDate: {
        fontSize: typography.fontSizes.xs,
        color: '#00D4FF',
        marginBottom: 4,
    },
    todayTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold as any,
        color: '#FFFFFF',
    },
    totalKm: {
        alignItems: 'flex-end',
    },
    totalKmValue: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: typography.fontWeights.bold as any,
        color: '#00D4FF',
    },
    totalKmUnit: {
        fontSize: typography.fontSizes.sm,
        fontWeight: typography.fontWeights.normal as any,
    },
    totalKmLabel: {
        fontSize: typography.fontSizes.xs,
        color: 'rgba(235, 235, 245, 0.4)',
    },
    workoutDetailCard: {
        marginBottom: spacing.lg,
        borderRadius: 24,
        overflow: 'hidden',
    },
    cardTopSection: {
        backgroundColor: '#1C1C2E',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.lg,
    },
    workoutDetailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    intensityBadge: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00D4FF',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.md,
    },
    intensityText: {
        fontSize: 11,
        fontWeight: typography.fontWeights.bold as any,
        color: '#00D4FF',
        letterSpacing: 0.5,
    },
    pendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    pendingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFC107',
    },
    pendingText: {
        fontSize: typography.fontSizes.xs,
        color: 'rgba(235, 235, 245, 0.6)',
    },
    workoutDetailBody: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    workoutImage: {
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    workoutInfo: {
        flex: 1,
    },
    workoutTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.bold as any,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    workoutDescription: {
        fontSize: typography.fontSizes.xs,
        color: 'rgba(235, 235, 245, 0.6)',
        marginBottom: spacing.sm,
    },
    workoutMetrics: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    metricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metricText: {
        fontSize: typography.fontSizes.sm,
        color: 'rgba(235, 235, 245, 0.6)',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: '#0E0E1F',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    viewDetailsText: {
        fontSize: typography.fontSizes.base,
        fontWeight: typography.fontWeights.semibold as any,
        color: '#FFFFFF',
    },
    nextWorkoutSection: {
        marginTop: spacing.lg,
    },
    nextWorkoutDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: spacing.lg,
    },
    nextWorkoutLabel: {
        fontSize: typography.fontSizes.xs,
        color: 'rgba(235, 235, 245, 0.4)',
        marginBottom: spacing.md,
    },
    nextWorkoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: '#1A1A2E',
        padding: spacing.md,
        borderRadius: borderRadius['2xl'],
    },
    nextWorkoutIconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextWorkoutInfo: {
        flex: 1,
    },
    nextWorkoutTitle: {
        fontSize: typography.fontSizes.base,
        fontWeight: typography.fontWeights.bold as any,
        color: '#FFFFFF',
    },
    nextWorkoutSubtitle: {
        fontSize: typography.fontSizes.xs,
        color: 'rgba(235, 235, 245, 0.6)',
        marginTop: 2,
    },
});
