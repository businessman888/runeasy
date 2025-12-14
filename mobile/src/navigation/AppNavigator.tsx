import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

import {
    LoginScreen,
    OnboardingScreen,
    HomeScreen,
    CalendarScreen,
    BadgesScreen,
    FeedbackScreen,
    EvolutionScreen,
    SettingsScreen,
} from '../screens';
import { colors, typography } from '../theme';
import { useAuthStore } from '../stores';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens
function WorkoutDetailScreen({ route }: any) {
    return (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🏃 Detalhes do Treino</Text>
            <Text style={styles.placeholderSubtext}>ID: {route.params?.workoutId}</Text>
        </View>
    );
}


// Tab Navigator
function MainTabs() {
    return (
        <Tab.Navigator
            id="MainTabs"
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.border,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: colors.white,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>🏠</Text>
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    title: 'Calendário',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>📅</Text>
                    ),
                    headerTitle: 'Meu Calendário',
                }}
            />
            <Tab.Screen
                name="Badges"
                component={BadgesScreen}
                options={{
                    title: 'Badges',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>🏆</Text>
                    ),
                    headerTitle: 'Minhas Badges',
                }}
            />
            <Tab.Screen
                name="Evolution"
                component={EvolutionScreen}
                options={{
                    title: 'Evolução',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>📊</Text>
                    ),
                    headerTitle: 'Minha Evolução',
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Config',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>⚙️</Text>
                    ),
                    headerTitle: 'Configurações',
                }}
            />
        </Tab.Navigator>
    );
}

// Root Navigator
export function AppNavigator() {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    React.useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingEmoji}>🏃</Text>
                <Text style={styles.loadingText}>RunEasy</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                id="RootStack"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.white,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            >
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Onboarding"
                            component={OnboardingScreen}
                            options={{
                                headerShown: false,
                                gestureEnabled: false,
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="WorkoutDetail"
                            component={WorkoutDetailScreen}
                            options={{
                                title: 'Treino',
                                presentation: 'card',
                            }}
                        />
                        <Stack.Screen
                            name="Feedback"
                            component={FeedbackScreen}
                            options={{
                                title: 'Análise do Treino',
                                presentation: 'card',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    loadingText: {
        fontSize: typography.fontSizes['2xl'],
        fontWeight: '700' as const,
        color: colors.primary,
    },
    placeholder: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 48,
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: typography.fontSizes.lg,
        color: colors.textSecondary,
    },
});
