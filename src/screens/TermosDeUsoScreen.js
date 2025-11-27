import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const TermosDeUsoScreen = () => {
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
                <Text style={styles.title}>Termos de Uso</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.lastUpdate}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</Text>

                    <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
                    <Text style={styles.paragraph}>
                        Ao acessar e usar o aplicativo FinGo, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar o aplicativo.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
                    <Text style={styles.paragraph}>
                        O FinGo é um aplicativo educacional de educação financeira gamificada destinado a jovens. O aplicativo oferece trilhas de aprendizado, quizzes, desafios, vídeos educativos e outras funcionalidades relacionadas à educação financeira.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Uso do Aplicativo</Text>
                    <Text style={styles.paragraph}>
                        Você concorda em usar o aplicativo apenas para fins legais e de acordo com estes Termos de Uso. Você não deve:
                    </Text>
                    <Text style={styles.listItem}>• Usar o aplicativo de forma que viole qualquer lei ou regulamento</Text>
                    <Text style={styles.listItem}>• Tentar acessar áreas restritas do aplicativo sem autorização</Text>
                    <Text style={styles.listItem}>• Interferir ou interromper o funcionamento do aplicativo</Text>
                    <Text style={styles.listItem}>• Usar o aplicativo para transmitir qualquer conteúdo malicioso ou prejudicial</Text>

                    <Text style={styles.sectionTitle}>4. Conta de Usuário</Text>
                    <Text style={styles.paragraph}>
                        Para usar certas funcionalidades do aplicativo, você precisará criar uma conta. Você é responsável por:
                    </Text>
                    <Text style={styles.listItem}>• Manter a confidencialidade de suas credenciais de login</Text>
                    <Text style={styles.listItem}>• Todas as atividades que ocorrem em sua conta</Text>
                    <Text style={styles.listItem}>• Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</Text>

                    <Text style={styles.sectionTitle}>5. Conteúdo Educacional</Text>
                    <Text style={styles.paragraph}>
                        O conteúdo educacional fornecido no aplicativo é apenas para fins informativos e educacionais. Embora nos esforcemos para fornecer informações precisas, não garantimos a precisão, completude ou atualidade de todas as informações.
                    </Text>

                    <Text style={styles.sectionTitle}>6. Propriedade Intelectual</Text>
                    <Text style={styles.paragraph}>
                        Todo o conteúdo do aplicativo, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade do FinGo ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais e outras leis de propriedade intelectual.
                    </Text>

                    <Text style={styles.sectionTitle}>7. Privacidade</Text>
                    <Text style={styles.paragraph}>
                        Seu uso do aplicativo também é regido por nossa Política de Privacidade. Por favor, revise nossa Política de Privacidade para entender nossas práticas de coleta e uso de dados.
                    </Text>

                    <Text style={styles.sectionTitle}>8. Limitação de Responsabilidade</Text>
                    <Text style={styles.paragraph}>
                        O FinGo não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar o aplicativo.
                    </Text>

                    <Text style={styles.sectionTitle}>9. Modificações dos Termos</Text>
                    <Text style={styles.paragraph}>
                        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. Seu uso continuado do aplicativo após as alterações constitui sua aceitação dos novos termos.
                    </Text>

                    <Text style={styles.sectionTitle}>10. Rescisão</Text>
                    <Text style={styles.paragraph}>
                        Podemos encerrar ou suspender sua conta e acesso ao aplicativo imediatamente, sem aviso prévio, por qualquer motivo, incluindo se você violar estes Termos de Uso.
                    </Text>

                    <Text style={styles.sectionTitle}>11. Lei Aplicável</Text>
                    <Text style={styles.paragraph}>
                        Estes Termos de Uso são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes do Brasil.
                    </Text>

                    <Text style={styles.sectionTitle}>12. Contato</Text>
                    <Text style={styles.paragraph}>
                        Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através dos canais oficiais do aplicativo.
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Ao usar o aplicativo FinGo, você reconhece que leu, entendeu e concorda em estar vinculado a estes Termos de Uso.
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
    sectionTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        color: '#000000',
        marginTop: 24,
        marginBottom: 12,
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
    footerText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        fontStyle: 'italic',
    },
});

export default TermosDeUsoScreen;

