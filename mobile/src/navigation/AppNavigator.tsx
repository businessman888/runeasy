import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { CustomTabBar } from '../components/CustomTabBar';

import {
    LoginScreen,
    OnboardingScreen,
    HomeScreen,
    CalendarScreen,
    BadgesScreen,
    FeedbackScreen,
    EvolutionScreen,
    SettingsScreen,
    PlanPreviewScreen,
    CoachAnalysisScreen,
    ObjectiveScreen,
    LevelScreen,
    FrequencyScreen,
    PaceScreen,
    TimeframeScreen,
    LimitationsScreen,
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
function MainTabs({ route, navigation }: any) {
    const { initialTab } = route.params || {};

    // Navigate to the correct tab after mount if initialTab is specified
    React.useEffect(() => {
        if (initialTab && initialTab !== 'Home') {
            // Small delay to ensure tabs are mounted
            const timer = setTimeout(() => {
                navigation.navigate(initialTab);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [initialTab, navigation]);

    return (
        <Tab.Navigator
            id="MainTabs"
            initialRouteName="Home"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
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
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    title: 'Calendário',
                    headerTitle: 'Meu Calendário',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Badges"
                component={BadgesScreen}
                options={{
                    title: 'Badges',
                    headerTitle: 'Minhas Badges',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Evolution"
                component={EvolutionScreen}
                options={{
                    title: 'Evolução',
                    headerTitle: 'Minha Evolução',
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Config',
                    headerTitle: 'Configurações',
                    headerShown: false,
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
                        {/* Quiz Screens */}
                        <Stack.Screen
                            name="Quiz_Objective"
                            component={ObjectiveScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Level"
                            component={LevelScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Frequency"
                            component={FrequencyScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Pace"
                            component={PaceScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Timeframe"
                            component={TimeframeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Limitations"
                            component={LimitationsScreen}
                            options={{ headerShown: false }}
                        />
                        {/* Plan Preview Screen */}
                        <Stack.Screen
                            name="PlanPreview"
                            component={PlanPreviewScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                        {/* Quiz Screens - accessible after auth for new users */}
                        <Stack.Screen
                            name="Quiz_Objective"
                            component={ObjectiveScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Level"
                            component={LevelScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Frequency"
                            component={FrequencyScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Pace"
                            component={PaceScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Timeframe"
                            component={TimeframeScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Quiz_Limitations"
                            component={LimitationsScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="PlanPreview"
                            component={PlanPreviewScreen}
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
                        <Stack.Screen
                            name="CoachAnalysis"
                            component={CoachAnalysisScreen}
                            options={{
                                headerShown: false,
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
