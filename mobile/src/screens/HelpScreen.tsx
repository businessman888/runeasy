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

function SearchIcon({ size = 20, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>🔍</Text>;
}

// Conta icon (person silhouette)
function ContaIcon({ size = 27, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 27 27" fill={color}>
                <path d="M13.3333 13.3333C11.5 13.3333 9.93056 12.6806 8.625 11.375C7.31944 10.0694 6.66667 8.5 6.66667 6.66667C6.66667 4.83333 7.31944 3.26389 8.625 1.95833C9.93056 0.652778 11.5 0 13.3333 0C15.1667 0 16.7361 0.652778 18.0417 1.95833C19.3472 3.26389 20 4.83333 20 6.66667C20 8.5 19.3472 10.0694 18.0417 11.375C16.7361 12.6806 15.1667 13.3333 13.3333 13.3333ZM0 23.3333V22C0 21.0556 0.243334 20.1878 0.73 19.3967C1.21667 18.6056 1.86222 18.0011 2.66667 17.5833C4.38889 16.7222 6.13889 16.0767 7.91667 15.6467C9.69444 15.2167 11.5 15.0011 13.3333 15C15.1667 14.9989 16.9722 15.2144 18.75 15.6467C20.5278 16.0789 22.2778 16.7244 24 17.5833C24.8056 18 25.4517 18.6044 25.9383 19.3967C26.425 20.1889 26.6678 21.0567 26.6667 22V23.3333C26.6667 24.25 26.3406 25.035 25.6883 25.6883C25.0361 26.3417 24.2511 26.6678 23.3333 26.6667H3.33333C2.41667 26.6667 1.63222 26.3406 0.98 25.6883C0.327777 25.0361 0.00111111 24.2511 0 23.3333Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>👤</Text>;
}

// Pagamentos icon (credit card)
function PagamentosIcon({ size = 27, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={35} height={26} viewBox="0 0 35 26" fill={color}>
                <path d="M5.35714 0C3.93634 0 2.57373 0.564412 1.56907 1.56907C0.564412 2.57373 0 3.93634 0 5.35714V6.42857H34.28V5.35714C34.28 3.93634 33.7156 2.57373 32.7109 1.56907C31.7063 0.564412 30.3437 0 28.9229 0H5.35714ZM0 20.3571V8.57143H34.28V20.3571C34.28 21.7779 33.7156 23.1406 32.7109 24.1452C31.7063 25.1499 30.3437 25.7143 28.9229 25.7143H5.35857C3.93777 25.7143 2.57516 25.1499 1.5705 24.1452C0.56584 23.1406 0.00142881 21.7779 0.00142881 20.3571M23.2086 16.4286C22.9244 16.4286 22.6519 16.5415 22.451 16.7424C22.25 16.9433 22.1371 17.2158 22.1371 17.5C22.1371 17.7842 22.25 18.0567 22.451 18.2576C22.6519 18.4585 22.9244 18.5714 23.2086 18.5714H28.2086C28.4927 18.5714 28.7653 18.4585 28.9662 18.2576C29.1671 18.0567 29.28 17.7842 29.28 17.5C29.28 17.2158 29.1671 16.9433 28.9662 16.7424C28.7653 16.5415 28.4927 16.4286 28.2086 16.4286H23.2086Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>💳</Text>;
}

// IA & Dados icon (brain with gear)
function IADadosIcon({ size = 27, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={30} viewBox="0 0 27 30" fill={color}>
                <path d="M15.0256 9.3C16.3256 9.3 17.4256 10.3167 17.4256 11.6667C17.4256 13.0167 16.3256 14.0667 15.0256 14.0667C13.7256 14.0667 12.6589 12.9667 12.6589 11.6667C12.6589 10.3667 13.6756 9.3 15.0256 9.3ZM15.0256 3.4806e-06C21.4922 3.4806e-06 26.6922 5.23334 26.6922 11.6667C26.6922 16.3333 23.9756 20.3167 20.0256 22.1833V30H8.3589V25H6.69224C4.84224 25 3.3589 23.5167 3.3589 21.6667V16.6667H0.858904C0.158904 16.6667 -0.241096 15.8333 0.158904 15.3167L3.3589 11.1C3.50575 8.10549 4.79928 5.28233 6.97136 3.21575C9.14344 1.14917 12.0275 -0.00231043 15.0256 3.4806e-06ZM20.0256 11.6667C20.0256 11.4 20.0256 11.25 19.9256 11.0167L21.4089 9.91667C21.4922 9.85 21.5589 9.61667 21.4922 9.45L20.1589 7.18334C20.0756 7.03334 19.8422 6.95 19.6922 7.03334L18.0422 7.73334C17.7422 7.41667 17.3422 7.18334 16.9589 7.03334L16.6922 5.31667C16.6422 5.08334 16.5589 5 16.3256 5H13.6756C13.5089 5 13.3589 5.08334 13.3589 5.31667L13.1256 7.03334C12.7422 7.18334 12.3422 7.41667 12.0256 7.73334L10.3089 7.03334C10.1589 6.95 10.0256 7.03334 9.92557 7.18334L8.59224 9.45C8.5089 9.68334 8.5089 9.85 8.67557 9.91667L10.0756 11.0167C10.0756 11.25 10.0256 11.4833 10.0256 11.6667C10.0256 11.8833 10.0756 12.1167 10.0756 12.35L8.67557 13.4333C8.5089 13.5167 8.5089 13.6667 8.59224 13.8333L9.92557 16.1667C10.0256 16.3333 10.1589 16.3333 10.3089 16.3333L11.9589 15.6167C12.3422 15.9333 12.6589 16.1 13.1256 16.25L13.3589 18.05C13.3589 18.2 13.5089 18.3333 13.6756 18.3333H16.3256C16.5589 18.3333 16.6422 18.2 16.6922 18.05L16.9589 16.25C17.3422 16.1 17.7422 15.9333 18.0422 15.6333L19.6922 16.3333C19.8422 16.3333 20.0756 16.3333 20.1589 16.1667L21.4922 13.8333C21.5589 13.6667 21.4922 13.5167 21.4089 13.4333L20.0256 12.35V11.6667Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>🧠</Text>;
}

// Treinos icon (sync arrows)
function TreinosIcon({ size = 27, color = '#00D4FF' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 27 27" fill={color}>
                <path d="M3.33334 13.4167C3.33334 14.6667 3.56945 15.8822 4.04167 17.0633C4.51389 18.2444 5.25001 19.3344 6.25001 20.3333L6.66667 20.75V18.3333C6.66667 17.8611 6.82667 17.4656 7.14667 17.1467C7.46667 16.8278 7.86223 16.6678 8.33334 16.6667C8.80445 16.6656 9.20056 16.8256 9.52167 17.1467C9.84278 17.4678 10.0022 17.8633 10 18.3333V25C10 25.4722 9.84 25.8683 9.52001 26.1883C9.20001 26.5083 8.80445 26.6678 8.33334 26.6667H1.66667C1.19445 26.6667 0.798895 26.5067 0.480006 26.1867C0.161117 25.8667 0.00111686 25.4711 5.74712e-06 25C-0.00110536 24.5289 0.158895 24.1333 0.480006 23.8133C0.801117 23.4933 1.19667 23.3333 1.66667 23.3333H4.58334L3.91667 22.75C2.47223 21.4722 1.45834 20.0139 0.875006 18.375C0.291673 16.7361 5.74712e-06 15.0833 5.74712e-06 13.4167C5.74712e-06 10.8056 0.666672 8.43722 2.00001 6.31167C3.33334 4.18611 5.12501 2.55444 7.37501 1.41667C7.76389 1.19444 8.17389 1.18056 8.60501 1.375C9.03612 1.56944 9.32056 1.88889 9.45834 2.33333C9.59723 2.75 9.59056 3.16667 9.43834 3.58333C9.28612 4 9.01501 4.31944 8.62501 4.54167C7.01389 5.43056 5.72945 6.66 4.77167 8.23C3.81389 9.8 3.33445 11.5289 3.33334 13.4167ZM23.3333 13.25C23.3333 12 23.0972 10.785 22.625 9.605C22.1528 8.425 21.4167 7.33444 20.4167 6.33333L20 5.91667V8.33333C20 8.80556 19.84 9.20167 19.52 9.52167C19.2 9.84167 18.8045 10.0011 18.3333 10C17.8622 9.99889 17.4667 9.83889 17.1467 9.52C16.8267 9.20111 16.6667 8.80556 16.6667 8.33333V1.66667C16.6667 1.19444 16.8267 0.798889 17.1467 0.48C17.4667 0.161111 17.8622 0.00111111 18.3333 0H25C25.4722 0 25.8683 0.16 26.1883 0.48C26.5083 0.8 26.6678 1.19556 26.6667 1.66667C26.6656 2.13778 26.5056 2.53389 26.1867 2.855C25.8678 3.17611 25.4722 3.33556 25 3.33333H22.0833L22.75 3.91667C24.1111 5.27778 25.1045 6.75722 25.73 8.355C26.3556 9.95278 26.6678 11.5844 26.6667 13.25C26.6667 15.8611 26 18.2294 24.6667 20.355C23.3333 22.4806 21.5417 24.1122 19.2917 25.25C18.9028 25.4722 18.4933 25.4861 18.0633 25.2917C17.6333 25.0972 17.3483 24.7778 17.2083 24.3333C17.0695 23.9167 17.0767 23.5 17.23 23.0833C17.3833 22.6667 17.6539 22.3472 18.0417 22.125C19.6528 21.2361 20.9378 20.0072 21.8967 18.4383C22.8556 16.8694 23.3344 15.14 23.3333 13.25Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>🔄</Text>;
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

function ChatIcon({ size = 20, color = '#0A0A18' }: { size?: number; color?: string }) {
    if (Platform.OS === 'web') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" />
            </svg>
        );
    }
    return <Text style={{ fontSize: size, color }}>💬</Text>;
}

interface Category {
    id: string;
    title: string;
    icon: React.ReactNode;
}

interface FAQ {
    id: string;
    question: string;
    answer: string;
}

const categories: Category[] = [
    { id: 'conta', title: 'Conta', icon: <ContaIcon size={27} color="#00D4FF" /> },
    { id: 'pagamentos', title: 'Pagamentos', icon: <PagamentosIcon size={27} color="#00D4FF" /> },
    { id: 'ia_dados', title: 'IA & Dados', icon: <IADadosIcon size={27} color="#00D4FF" /> },
    { id: 'treinos', title: 'Treinos', icon: <TreinosIcon size={27} color="#00D4FF" /> },
];

const faqs: FAQ[] = [
    {
        id: '1',
        question: 'Como a IA calcula minha prontidão?',
        answer: 'A IA analisa diversos fatores como qualidade do sono, carga de treino recente, variabilidade da frequência cardíaca e seu histórico de performance para calcular sua prontidão diária.',
    },
    {
        id: '2',
        question: 'Meu treino do Strava não apareceu',
        answer: 'Verifique se sua conta do Strava está conectada corretamente. Pode haver um atraso de alguns minutos na sincronização. Tente atualizar a página ou reconectar sua conta.',
    },
    {
        id: '3',
        question: 'Posso alterar meu plano a qualquer momento?',
        answer: 'Sim! Você pode alterar seu plano de treino a qualquer momento através das configurações. A IA irá recalcular automaticamente suas sessões futuras.',
    },
];

export function HelpScreen({ navigation }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
        setExpandedFaq(expandedFaq === id ? null : id);
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
                <Text style={styles.headerTitle}>Ajuda</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <SearchIcon size={20} color="#00D4FF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Como podemos ajudar?"
                        placeholderTextColor="rgba(235,235,245,0.4)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categorias</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryCard}
                                activeOpacity={0.7}
                            >
                                <View style={styles.categoryIconContainer}>
                                    {category.icon}
                                </View>
                                <Text style={styles.categoryTitle}>{category.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* FAQs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dúvidas frequentes</Text>
                    <View style={styles.faqContainer}>
                        {faqs.map((faq) => (
                            <TouchableOpacity
                                key={faq.id}
                                style={styles.faqCard}
                                onPress={() => toggleFaq(faq.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                                    <View style={[
                                        styles.chevronContainer,
                                        expandedFaq === faq.id && styles.chevronRotated
                                    ]}>
                                        <ChevronDownIcon size={20} color="#00D4FF" />
                                    </View>
                                </View>
                                {expandedFaq === faq.id && (
                                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.supportSection}>
                    <Text style={styles.supportTitle}>Ainda precisa de ajuda?</Text>
                    <Text style={styles.supportDescription}>
                        Nossa equipe de suporte está pronta para te atender.
                    </Text>
                    <TouchableOpacity style={styles.supportButton} activeOpacity={0.8}>
                        <ChatIcon size={18} color="#0A0A18" />
                        <Text style={styles.supportButtonText}>Falar com Suporte</Text>
                    </TouchableOpacity>
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
    // Search
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        paddingHorizontal: spacing.md,
        height: 48,
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
    },
    // Sections
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: spacing.md,
    },
    // Categories
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    categoryCard: {
        width: '47%',
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(235,235,245,0.1)',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    categoryIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0,212,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    // FAQs
    faqContainer: {
        gap: spacing.sm,
    },
    faqCard: {
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(235,235,245,0.1)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    faqQuestion: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
        marginRight: spacing.sm,
    },
    chevronContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chevronRotated: {
        transform: [{ rotate: '180deg' }],
    },
    faqAnswer: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.6)',
        marginTop: spacing.sm,
        lineHeight: 20,
    },
    // Support Section
    supportSection: {
        backgroundColor: '#1C1C2E',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(235,235,245,0.1)',
        padding: spacing.lg,
        alignItems: 'center',
    },
    supportTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: spacing.xs,
    },
    supportDescription: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(235,235,245,0.6)',
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00D4FF',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
        width: '100%',
    },
    supportButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0A0A18',
    },
    spacer: {
        height: 100,
    },
});
