import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
} from 'react-native';
import { colors, typography, spacing } from '../theme';
import { useAuthStore } from '../stores';

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

function PersonIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>👤</Text>;
}

function LockIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>🔒</Text>;
}

function CalendarIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>📅</Text>;
}

function EditIcon({ size = 16, color = '#0A0A18' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>✏️</Text>;
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

function ChevronDownIcon({ size = 20, color = 'rgba(235,235,245,0.6)' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>▼</Text>;
}

type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';

export function PersonalInfoScreen({ navigation }: any) {
    const { user } = useAuthStore();

    // Form state
    const [fullName, setFullName] = useState(
        user?.profile?.firstname
            ? `${user.profile.firstname} ${user.profile.lastname || ''}`
            : 'Fernanda Oliveira'
    );
    const [email, setEmail] = useState('fernanda.oliveira@email.com');
    const [birthDate, setBirthDate] = useState('05/15/1995');
    const [weight, setWeight] = useState('62');
    const [height, setHeight] = useState('168');
    const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('intermediario');
    const [objective, setObjective] = useState('Meia Maratona (21k)');

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving personal info...');
        navigation.goBack();
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
                <Text style={styles.headerTitle}>Informações pessoais</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Photo */}
                <View style={styles.profilePhotoSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: user?.profile?.profile_pic ||
                                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face'
                            }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <EditIcon size={14} color="#0A0A18" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.formSection}>
                    {/* Nome completo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nome completo</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholderTextColor="rgba(235,235,245,0.4)"
                            />
                            <PersonIcon size={20} color="rgba(235,235,245,0.6)" />
                        </View>
                    </View>

                    {/* E-mail */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>E-mail</Text>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <TextInput
                                style={[styles.textInput, styles.textInputDisabled]}
                                value={email}
                                editable={false}
                                placeholderTextColor="rgba(235,235,245,0.4)"
                            />
                            <LockIcon size={20} color="rgba(235,235,245,0.6)" />
                        </View>
                    </View>

                    {/* Data de nascimento */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Data de nascimento</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={birthDate}
                                onChangeText={setBirthDate}
                                placeholderTextColor="rgba(235,235,245,0.4)"
                            />
                            <CalendarIcon size={20} color="rgba(235,235,245,0.6)" />
                        </View>
                    </View>

                    {/* Peso e Altura */}
                    <View style={styles.rowInputs}>
                        <View style={styles.halfInputGroup}>
                            <Text style={styles.inputLabel}>Peso (KG)</Text>
                            <View style={styles.inputContainerSmall}>
                                <TextInput
                                    style={styles.textInputCenter}
                                    value={weight}
                                    onChangeText={setWeight}
                                    keyboardType="numeric"
                                    placeholderTextColor="rgba(235,235,245,0.4)"
                                />
                            </View>
                        </View>
                        <View style={styles.halfInputGroup}>
                            <Text style={styles.inputLabel}>Altura (CM)</Text>
                            <View style={styles.inputContainerSmall}>
                                <TextInput
                                    style={styles.textInputCenter}
                                    value={height}
                                    onChangeText={setHeight}
                                    keyboardType="numeric"
                                    placeholderTextColor="rgba(235,235,245,0.4)"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Nível de Experiência */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nível de Experiência</Text>
                        <View style={styles.segmentedControl}>
                            <TouchableOpacity
                                style={[
                                    styles.segmentButton,
                                    experienceLevel === 'iniciante' && styles.segmentButtonActive
                                ]}
                                onPress={() => setExperienceLevel('iniciante')}
                            >
                                <Text style={[
                                    styles.segmentButtonText,
                                    experienceLevel === 'iniciante' && styles.segmentButtonTextActive
                                ]}>Iniciante</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.segmentButton,
                                    experienceLevel === 'intermediario' && styles.segmentButtonActive
                                ]}
                                onPress={() => setExperienceLevel('intermediario')}
                            >
                                <Text style={[
                                    styles.segmentButtonText,
                                    experienceLevel === 'intermediario' && styles.segmentButtonTextActive
                                ]}>Intermed.</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.segmentButton,
                                    experienceLevel === 'avancado' && styles.segmentButtonActive
                                ]}
                                onPress={() => setExperienceLevel('avancado')}
                            >
                                <Text style={[
                                    styles.segmentButtonText,
                                    experienceLevel === 'avancado' && styles.segmentButtonTextActive
                                ]}>Avançado</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Objetivo Atual */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Objetivo Atual</Text>
                        <TouchableOpacity style={styles.dropdownContainer}>
                            <Text style={styles.dropdownText}>{objective}</Text>
                            <ChevronDownIcon size={20} color="rgba(235,235,245,0.6)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <InfoIcon size={20} color="#00D4FF" />
                    <Text style={styles.infoBannerText}>
                        Seus dados biométricos são usados apenas para calcular métricas de performance, como VO2 Max e zonas de frequência cardíaca, além da estimativa de queima calórica.
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
    saveButton: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00D4FF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
    },
    profilePhotoSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#00D4FF',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#00D4FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#0E0E1F',
    },
    formSection: {
        gap: spacing.lg,
    },
    inputGroup: {
        gap: spacing.sm,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.6)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C2E',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EBEBF5',
        paddingHorizontal: spacing.md,
        height: 52,
    },
    inputContainerSmall: {
        backgroundColor: '#1C1C2E',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EBEBF5',
        paddingHorizontal: spacing.md,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputDisabled: {
        opacity: 0.7,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
        paddingVertical: 0,
    },
    textInputDisabled: {
        color: 'rgba(235,235,245,0.6)',
    },
    textInputCenter: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfInputGroup: {
        flex: 1,
        gap: spacing.sm,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#1C1C2E',
        borderRadius: 20,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    segmentButtonActive: {
        backgroundColor: '#2A2A3E',
    },
    segmentButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(235,235,245,0.6)',
    },
    segmentButtonTextActive: {
        color: '#FFFFFF',
    },
    dropdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1C1C2E',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EBEBF5',
        paddingHorizontal: spacing.md,
        height: 52,
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFFFFF',
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0,212,255,0.1)',
        borderRadius: 12,
        padding: spacing.md,
        marginTop: spacing.xl,
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
