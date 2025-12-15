import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { colors, typography, spacing } from '../theme';
import * as Storage from '../utils/storage';
import { useAuthStore } from '../stores';

const { width } = Dimensions.get('window');

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export function LoginScreen({ navigation }: any) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { login } = useAuthStore();

    // Check for auth callback params on web
    React.useEffect(() => {
        if (Platform.OS === 'web') {
            handleWebCallback();
        }
    }, []);

    const handleWebCallback = async () => {
        try {
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            const userId = url.searchParams.get('user_id');
            const errorParam = url.searchParams.get('error');

            if (errorParam) {
                setError(getErrorMessage(errorParam));
                // Clean URL
                window.history.replaceState({}, '', '/');
                return;
            }

            if (userId) {
                setIsLoading(true);
                // Store userId and login
                await Storage.setItemAsync('user_id', userId);
                await login(userId);

                // Clean URL and navigate
                window.history.replaceState({}, '', '/');

                // Check if this is a new user (onboarding path)
                // The backend redirects to /onboarding?user_id=xxx for new users
                const isNewUser = currentUrl.includes('onboarding');
                console.log('Login callback - isNewUser:', isNewUser, 'URL:', currentUrl);

                if (isNewUser) {
                    navigation.replace('Quiz_Objective');
                } else {
                    navigation.replace('Main');
                }
            }
        } catch (err) {
            console.error('Web callback error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getErrorMessage = (errorCode: string): string => {
        const messages: Record<string, string> = {
            'auth_failed': 'Falha na autenticação. Tente novamente.',
            'missing_code': 'Código de autorização não recebido.',
            'access_denied': 'Acesso negado pelo Strava.',
        };
        return messages[errorCode] || 'Erro desconhecido. Tente novamente.';
    };

    const handleStravaLogin = async () => {
        setError(null);

        if (Platform.OS === 'web') {
            // On web, redirect directly to Strava login
            window.location.href = `${API_URL}/auth/strava/login`;
        } else {
            // On native, use WebBrowser (original behavior)
            try {
                setIsLoading(true);
                const WebBrowser = require('expo-web-browser');
                const Linking = require('expo-linking');

                const result = await WebBrowser.openAuthSessionAsync(
                    `${API_URL}/auth/strava/login`,
                    Linking.createURL('callback')
                );

                if (result.type === 'success' && result.url) {
                    const url = new URL(result.url);
                    const userId = url.searchParams.get('user_id');
                    const errorParam = url.searchParams.get('error');

                    if (errorParam) {
                        setError(getErrorMessage(errorParam));
                        return;
                    }

                    if (userId) {
                        await Storage.setItemAsync('user_id', userId);
                        await login(userId);

                        // Check if this is a new user (onboarding path)
                        const isNewUser = result.url.includes('onboarding');
                        console.log('Native login callback - isNewUser:', isNewUser, 'URL:', result.url);

                        if (isNewUser) {
                            navigation.replace('Quiz_Objective');
                        } else {
                            navigation.replace('Main');
                        }
                    }
                }
            } catch (err) {
                console.error('Strava login error:', err);
                setError('Erro ao conectar com Strava.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.content}>
                {/* Logo & Branding */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🏃‍♂️</Text>
                    <Text style={styles.appName}>RunEasy</Text>
                    <Text style={styles.tagline}>Seu treinador de corrida com IA</Text>
                </View>

                {/* Error Message */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                )}

                {/* Features */}
                <View style={styles.features}>
                    <FeatureItem
                        icon="🎯"
                        title="Planos Personalizados"
                        description="IA cria seu plano ideal"
                    />
                    <FeatureItem
                        icon="📊"
                        title="Feedback Inteligente"
                        description="Análise pós-treino detalhada"
                    />
                    <FeatureItem
                        icon="🏆"
                        title="Gamificação"
                        description="Badges e níveis para motivar"
                    />
                </View>

                {/* CTA Button */}
                <View style={styles.ctaContainer}>
                    <TouchableOpacity
                        style={[styles.stravaButton, isLoading && styles.buttonDisabled]}
                        onPress={handleStravaLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.stravaIcon}>🔗</Text>
                        <Text style={styles.stravaButtonText}>
                            {isLoading ? 'Conectando...' : 'Continuar com Strava'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.disclaimer}>
                        Ao continuar, você concorda com nossos{' '}
                        <Text style={styles.link}>Termos de Uso</Text> e{' '}
                        <Text style={styles.link}>Política de Privacidade</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, title, description }: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>{icon}</Text>
            <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: spacing['2xl'],
    },
    logo: {
        fontSize: 80,
        marginBottom: spacing.md,
    },
    appName: {
        fontSize: typography.fontSizes['4xl'],
        fontWeight: typography.fontWeights.bold,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    tagline: {
        fontSize: typography.fontSizes.lg,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: spacing.md,
        borderRadius: 8,
        marginTop: spacing.md,
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        fontSize: typography.fontSizes.sm,
    },
    features: {
        gap: spacing.lg,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.md,
        borderRadius: 12,
    },
    featureIcon: {
        fontSize: 36,
        marginRight: spacing.md,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.semibold,
        color: colors.text,
        marginBottom: 2,
    },
    featureDescription: {
        fontSize: typography.fontSizes.sm,
        color: colors.textSecondary,
    },
    ctaContainer: {
        marginBottom: spacing.xl,
    },
    stravaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FC4C02', // Strava Orange
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        gap: spacing.sm,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    stravaIcon: {
        fontSize: 24,
    },
    stravaButtonText: {
        color: colors.white,
        fontSize: typography.fontSizes.lg,
        fontWeight: typography.fontWeights.semibold,
    },
    disclaimer: {
        marginTop: spacing.md,
        fontSize: typography.fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 18,
    },
    link: {
        color: colors.primary,
        textDecorationLine: 'underline',
    },
});
