import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

// SVG Icons
function BackIcon({ size = 24, color = '#FFFFFF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>‹</Text>;
}

function SearchIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>🔍</Text>;
}

function FilterIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>⚙️</Text>;
}

function ChevronRightIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>›</Text>;
}

function CheckIcon({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>✓</Text>;
}

// Colored dot icon with glow effect
function BolinhaIcon({ color = '#00D4FF' }: { color?: string }) {
    if (Platform.OS === 'web') {
        const isYellow = color === '#FFC400';
        const filterId = isYellow ? 'filter_yellow' : 'filter_blue';
        return (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <defs>
                    <filter id={filterId} x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="3" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values={isYellow ? "0 0 0 0 1 0 0 0 0 0.768627 0 0 0 0 0 0 0 0 1 0" : "0 0 0 0 0 0 0 0 0 0.831373 0 0 0 0 1 0 0 0 1 0"} />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>
                <g filter={`url(#${filterId})`}>
                    <circle cx="11" cy="11" r="5" fill={color} />
                </g>
            </svg>
        );
    }
    return <Text style={{ fontSize: 12, color }}>●</Text>;
}

// Strava icon (orange double arrow)
function StravaIcon({ size = 20 }: { size?: number }) {
    if (Platform.OS === 'web') {
        return (
            <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M5.91375 0L0 11.4062H3.485L5.9125 6.87125L8.325 11.4062H11.7825L5.91375 0ZM11.7825 11.4062L10.0663 14.8512L8.325 11.4062H5.68375L10.0663 20L14.4212 11.4062H11.7825Z" fill="#FC4C02" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color: '#FC4C02' }}>⚡</Text>;
}

type WorkoutType = 'corrida_longa' | 'tiro_velocidade' | 'regenerativo';

interface Workout {
    id: string;
    day: number;
    dayName: string;
    type: WorkoutType;
    title: string;
    distance: string;
    time: string;
    pace: string;
}

interface WorkoutGroup {
    month: string;
    workouts: Workout[];
}

const getWorkoutDotColor = (type: WorkoutType): string => {
    switch (type) {
        case 'corrida_longa':
            return '#00D4FF'; // Blue
        case 'tiro_velocidade':
            return '#FFC400'; // Yellow/Orange
        case 'regenerativo':
            return '#00D4FF'; // Blue
        default:
            return '#00D4FF';
    }
};

// Mock data
const mockWorkouts: WorkoutGroup[] = [
    {
        month: 'Janeiro 2026',
        workouts: [
            {
                id: '1',
                day: 12,
                dayName: 'DOM',
                type: 'corrida_longa',
                title: 'Corrida Longa',
                distance: '10.2 km',
                time: '45.12 min',
                pace: '4.25 /km',
            },
            {
                id: '2',
                day: 10,
                dayName: 'SEX',
                type: 'tiro_velocidade',
                title: 'Tiro de Velocidade',
                distance: '5.0 km',
                time: '22.00 min',
                pace: '4.20 /km',
            },
            {
                id: '3',
                day: 8,
                dayName: 'QUA',
                type: 'regenerativo',
                title: 'Regenerativo',
                distance: '6.0 km',
                time: '35.40 min',
                pace: '5.56 /km',
            },
        ],
    },
    {
        month: 'Janeiro 2026',
        workouts: [
            {
                id: '4',
                day: 1,
                dayName: 'SEG',
                type: 'corrida_longa',
                title: 'Corrida Longa',
                distance: '10.2 km',
                time: '45.12 min',
                pace: '4.25 /km',
            },
        ],
    },
];

export function TrainingHistoryScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <BackIcon size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Histórico de Treinos</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Monthly Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryTitle}>Resumo do Mês</Text>
                        <View style={styles.progressBadge}>
                            <CheckIcon size={12} color="#FFFFFF" />
                            <Text style={styles.progressBadgeText}>Em progresso</Text>
                        </View>
                    </View>
                    <View style={styles.summaryMetrics}>
                        <View style={styles.summaryMetric}>
                            <Text style={styles.summaryMetricValue}>
                                124<Text style={styles.summaryMetricUnit}>km</Text>
                            </Text>
                            <Text style={styles.summaryMetricLabel}>Distância</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryMetric}>
                            <Text style={styles.summaryMetricValue}>12</Text>
                            <Text style={styles.summaryMetricLabel}>Atividades</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryMetric}>
                            <Text style={styles.summaryMetricValue}>
                                1.2<Text style={styles.summaryMetricUnit}>k</Text>
                            </Text>
                            <Text style={styles.summaryMetricLabel}>Elevação</Text>
                        </View>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <SearchIcon size={20} color="rgba(235,235,245,0.6)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar treinos..."
                            placeholderTextColor="rgba(235,235,245,0.4)"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <FilterIcon size={20} color="rgba(235,235,245,0.6)" />
                    </TouchableOpacity>
                </View>

                {/* Workout List */}
                {mockWorkouts.map((group, groupIndex) => (
                    <View key={groupIndex} style={styles.workoutGroup}>
                        <Text style={styles.monthHeader}>{group.month}</Text>
                        {group.workouts.map((workout) => (
                            <TouchableOpacity
                                key={workout.id}
                                style={styles.workoutCard}
                                activeOpacity={0.7}
                            >
                                <View style={styles.workoutDateContainer}>
                                    <Text style={styles.workoutDay}>{workout.day.toString().padStart(2, '0')}</Text>
                                    <Text style={styles.workoutDayName}>{workout.dayName}</Text>
                                </View>
                                <View style={styles.workoutDivider} />
                                <View style={styles.workoutContent}>
                                    <View style={styles.workoutTitleRow}>
                                        <Text style={styles.workoutTitle}>{workout.title}</Text>
                                        <BolinhaIcon color={getWorkoutDotColor(workout.type)} />
                                    </View>
                                    <View style={styles.workoutMetricsRow}>
                                        <View style={styles.workoutMetrics}>
                                            <Text style={styles.workoutMetric}>{workout.distance}</Text>
                                            <View style={styles.metricDivider} />
                                            <Text style={styles.workoutMetric}>{workout.time}</Text>
                                            <View style={styles.metricDivider} />
                                            <Text style={styles.workoutMetric}>{workout.pace}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.workoutRightSection}>
                                    <StravaIcon size={20} />
                                    <ChevronRightIcon size={20} color="rgba(235,235,245,0.6)" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Load More Button */}
                <TouchableOpacity style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>Carregar mais treinos</Text>
                    <View style={styles.loadMoreIcon}>
                        <ChevronRightIcon size={16} color="#00D4FF" />
                    </View>
                </TouchableOpacity>

                <View style={styles.spacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0E0E1F',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },
    // Summary Card
    summaryCard: {
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#00D4FF',
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    progressBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00D4FF',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    progressBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    summaryMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryMetric: {
        alignItems: 'center',
        flex: 1,
    },
    summaryMetricValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#00D4FF',
    },
    summaryMetricUnit: {
        fontSize: 14,
        fontWeight: '400',
    },
    summaryMetricLabel: {
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.6)',
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    // Search
    searchContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C2E',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        height: 44,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    filterButton: {
        width: 44,
        height: 44,
        backgroundColor: '#1C1C2E',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Workout Groups
    workoutGroup: {
        marginBottom: spacing.md,
    },
    monthHeader: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(235,235,245,0.6)',
        marginBottom: spacing.sm,
    },
    // Workout Card
    workoutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    workoutDateContainer: {
        alignItems: 'center',
        width: 36,
    },
    workoutDay: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    workoutDayName: {
        fontSize: 10,
        fontWeight: '500',
        color: 'rgba(235,235,245,0.6)',
    },
    workoutDivider: {
        width: 1,
        height: 36,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: spacing.md,
    },
    workoutContent: {
        flex: 1,
    },
    workoutTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    workoutTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    workoutMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workoutMetricsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workoutMetric: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.6)',
    },
    metricDivider: {
        width: 1,
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: spacing.sm,
    },
    workoutRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    // Load More
    loadMoreButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.md,
        gap: spacing.xs,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#00D4FF',
    },
    loadMoreIcon: {
        transform: [{ rotate: '90deg' }],
    },
    spacer: {
        height: 100,
    },
});
