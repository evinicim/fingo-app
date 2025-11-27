import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const PoliticaPrivacidadeScreen = () => {
    const navigation = useNavigation();
    
    const [fontsLoaded] = useFonts({
        'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
        'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0AD58B" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Política de Privacidade</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.lastUpdate}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</Text>

                    <Text style={styles.intro}>
                        O FinGo está comprometido em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                    </Text>

                    <Text style={styles.sectionTitle}>1. Informações que Coletamos</Text>
                    <Text style={styles.subsectionTitle}>1.1 Informações Fornecidas por Você</Text>
                    <Text style={styles.paragraph}>
                        Coletamos informações que você nos fornece diretamente, incluindo:
                    </Text>
                    <Text style={styles.listItem}>• Nome completo e informações de perfil</Text>
                    <Text style={styles.listItem}>• Endereço de e-mail</Text>
                    <Text style={styles.listItem}>• Idade e nível de conhecimento financeiro</Text>
                    <Text style={styles.listItem}>• Avatar e preferências de personalização</Text>

                    <Text style={styles.subsectionTitle}>1.2 Informações de Uso</Text>
                    <Text style={styles.paragraph}>
                        Coletamos automaticamente informações sobre como você usa o aplicativo, incluindo:
                    </Text>
                    <Text style={styles.listItem}>• Progresso nas trilhas e módulos</Text>
                    <Text style={styles.listItem}>• Respostas em quizzes e desafios</Text>
                    <Text style={styles.listItem}>• Pontuação e conquistas (badges)</Text>
                    <Text style={styles.listItem}>• Preferências de notificação</Text>

                    <Text style={styles.sectionTitle}>2. Como Usamos suas Informações</Text>
                    <Text style={styles.paragraph}>
                        Utilizamos suas informações para:
                    </Text>
                    <Text style={styles.listItem}>• Fornecer e melhorar nossos serviços educacionais</Text>
                    <Text style={styles.listItem}>• Personalizar sua experiência de aprendizado</Text>
                    <Text style={styles.listItem}>• Acompanhar seu progresso e desempenho</Text>
                    <Text style={styles.listItem}>• Enviar notificações sobre novos conteúdos e conquistas</Text>
                    <Text style={styles.listItem}>• Garantir a segurança e prevenir fraudes</Text>
                    <Text style={styles.listItem}>• Cumprir obrigações legais</Text>

                    <Text style={styles.sectionTitle}>3. Compartilhamento de Informações</Text>
                    <Text style={styles.paragraph}>
                        Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
                    </Text>
                    <Text style={styles.listItem}>• Quando necessário para fornecer nossos serviços (ex: Firebase)</Text>
                    <Text style={styles.listItem}>• Quando exigido por lei ou ordem judicial</Text>
                    <Text style={styles.listItem}>• Para proteger nossos direitos e segurança</Text>
                    <Text style={styles.listItem}>• Com seu consentimento explícito</Text>

                    <Text style={styles.sectionTitle}>4. Armazenamento e Segurança</Text>
                    <Text style={styles.paragraph}>
                        Suas informações são armazenadas de forma segura usando:
                    </Text>
                    <Text style={styles.listItem}>• Firebase Authentication para autenticação</Text>
                    <Text style={styles.listItem}>• Cloud Firestore para armazenamento de dados</Text>
                    <Text style={styles.listItem}>• Criptografia de dados em trânsito e em repouso</Text>
                    <Text style={styles.paragraph}>
                        Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
                    </Text>

                    <Text style={styles.sectionTitle}>5. Seus Direitos (LGPD)</Text>
                    <Text style={styles.paragraph}>
                        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
                    </Text>
                    <Text style={styles.listItem}>• Acessar suas informações pessoais</Text>
                    <Text style={styles.listItem}>• Corrigir dados incompletos, inexatos ou desatualizados</Text>
                    <Text style={styles.listItem}>• Solicitar a exclusão de seus dados pessoais</Text>
                    <Text style={styles.listItem}>• Revogar seu consentimento a qualquer momento</Text>
                    <Text style={styles.listItem}>• Solicitar portabilidade dos dados</Text>
                    <Text style={styles.listItem}>• Ser informado sobre o uso de seus dados</Text>

                    <Text style={styles.sectionTitle}>6. Retenção de Dados</Text>
                    <Text style={styles.paragraph}>
                        Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Cookies e Tecnologias Similares</Text>
                    <Text style={styles.paragraph}>
                        Utilizamos tecnologias como armazenamento local (AsyncStorage) para melhorar sua experiência, lembrar suas preferências e manter você conectado.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Privacidade de Menores</Text>
                    <Text style={styles.paragraph}>
                        O FinGo é destinado a jovens e adolescentes. Coletamos informações de menores apenas com o consentimento dos pais ou responsáveis, quando aplicável. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Alterações nesta Política</Text>
                    <Text style={styles.paragraph}>
                        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova política no aplicativo e atualizando a data de "última atualização".
                    </Text>

                    <Text style={styles.sectionTitle}>10. Contato</Text>
                    <Text style={styles.paragraph}>
                        Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato conosco através dos canais oficiais do aplicativo.
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerTitle}>Encarregado de Proteção de Dados (DPO)</Text>
                        <Text style={styles.footerText}>
                            Para questões relacionadas à proteção de dados pessoais, você pode entrar em contato com nosso encarregado através dos canais oficiais do aplicativo.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: 24,
        lineHeight: 30,
        color: '#000000',
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    content: {
        paddingBottom: 40,
    },
    lastUpdate: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        color: '#666',
        marginBottom: 24,
        textAlign: 'right',
    },
    intro: {
        fontFamily: 'Outfit-Regular',
        fontSize: 15,
        lineHeight: 24,
        color: '#333',
        marginBottom: 24,
        textAlign: 'justify',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        color: '#000000',
        marginTop: 24,
        marginBottom: 12,
    },
    subsectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
        marginBottom: 16,
        textAlign: 'justify',
    },
    listItem: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
        marginBottom: 8,
        marginLeft: 16,
    },
    footer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
    },
    footerTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        color: '#000000',
        marginBottom: 8,
    },
    footerText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
});

export default PoliticaPrivacidadeScreen;





