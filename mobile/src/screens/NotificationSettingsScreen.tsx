import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform,
    Animated,
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

function InfoIcon({ size = 20, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>ℹ️</Text>;
}

// Custom Toggle Component
function CustomToggle({
    value,
    onValueChange
}: {
    value: boolean;
    onValueChange: () => void;
}) {
    return (
        <TouchableOpacity
            style={[
                styles.toggleTrack,
                value ? styles.toggleTrackActive : styles.toggleTrackInactive
            ]}
            onPress={onValueChange}
            activeOpacity={0.8}
        >
            <View
                style={[
                    styles.toggleThumb,
                    value ? styles.toggleThumbActive : styles.toggleThumbInactive
                ]}
            />
        </TouchableOpacity>
    );
}

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

interface NotificationSection {
    title: string;
    settings: NotificationSetting[];
}

export function NotificationSettingsScreen({ navigation }: any) {
    const [settings, setSettings] = useState<NotificationSection[]>([
        {
            title: 'IA & Saúde',
            settings: [
                {
                    id: 'readiness',
                    title: 'Veredito de Prontidão',
                    description: 'Receba sua pontuação diária ao acordar',
                    enabled: true,
                },
                {
                    id: 'fatigue',
                    title: 'Alertas de Fadiga',
                    description: 'Avisos sobre picos de carga aguda',
                    enabled: false,
                },
            ],
        },
        {
            title: 'Treinos',
            settings: [
                {
                    id: 'session_reminder',
                    title: 'Lembrete de sessão',
                    description: '30 min antes do treino planejado',
                    enabled: true,
                },
                {
                    id: 'sync',
                    title: 'Sincronização',
                    description: 'Confirmar upload do Strava/Garmin',
                    enabled: true,
                },
            ],
        },
        {
            title: 'Comunidade',
            settings: [
                {
                    id: 'squad',
                    title: 'Atividades do Squad',
                    description: 'Quando amigos batem recordes pessoais',
                    enabled: false,
                },
            ],
        },
    ]);

    const handleToggle = (sectionIndex: number, settingIndex: number) => {
        const newSettings = [...settings];
        newSettings[sectionIndex].settings[settingIndex].enabled =
            !newSettings[sectionIndex].settings[settingIndex].enabled;
        setSettings(newSettings);
    };

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
                <Text style={styles.headerTitle}>Notificações</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {settings.map((section, sectionIndex) => (
                    <View key={section.title} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.settingsCard}>
                            {section.settings.map((setting, settingIndex) => (
                                <View key={setting.id}>
                                    <View style={styles.settingRow}>
                                        <View style={styles.settingInfo}>
                                            <Text style={styles.settingTitle}>{setting.title}</Text>
                                            <Text style={styles.settingDescription}>{setting.description}</Text>
                                        </View>
                                        <CustomToggle
                                            value={setting.enabled}
                                            onValueChange={() => handleToggle(sectionIndex, settingIndex)}
                                        />
                                    </View>
                                    {settingIndex < section.settings.length - 1 && (
                                        <View style={styles.settingDivider} />
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <InfoIcon size={20} color="#00D4FF" />
                    <Text style={styles.infoBannerText}>
                        As notificações são essenciais para que a IA ajuste sua planilha de treinos em tempo real, garantindo que você treine na intensidade correta.
                    </Text>
                </View>

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
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(235,235,245,0.6)',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    settingsCard: {
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(235,235,245,0.1)',
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: spacing.lg,
    },
    settingInfo: {
        flex: 1,
        marginRight: spacing.md,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.6)',
    },
    settingDivider: {
        height: 1,
        backgroundColor: 'rgba(235,235,245,0.1)',
        marginLeft: spacing.lg,
    },
    // Custom Toggle Styles
    toggleTrack: {
        width: 52,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleTrackActive: {
        backgroundColor: '#00D4FF',
    },
    toggleTrackInactive: {
        backgroundColor: '#39393D',
    },
    toggleThumb: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
    toggleThumbInactive: {
        alignSelf: 'flex-start',
    },
    // Info Banner
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0,212,255,0.1)',
        borderRadius: 12,
        padding: spacing.md,
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.8)',
        lineHeight: 18,
    },
    spacer: {
        height: 100,
    },
});
