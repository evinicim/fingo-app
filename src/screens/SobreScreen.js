import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const teamMembers = [
    { name: 'Adryan Winícius Sá Aragão', role: 'Desenvolvimento e Pesquisa' },
    { name: 'Ana Luiza Rodrigues de Oliveira', role: 'Design Instrucional e QA' },
    { name: 'Asaph Gabriel Sousa dos Santos Felix', role: 'Desenvolvimento Full Stack' },
    { name: 'Julio Cesar Andrade Bezerra', role: 'Desenvolvimento e Conteúdo' },
    { name: 'Jennifer Cristina Rodrigues da Silva Costa', role: 'Experiência do Usuário' },
    { name: 'Thamy Mellysa Lemes Mesquita Ferreira', role: 'Conteúdo Educacional' },
    { name: 'Vinícius Mendes Correia', role: 'Desenvolvimento Full Stack' },
    { name: 'Wilker Gabriel Araujo do Nascimento', role: 'Pesquisa e Validação' },
    { name: 'Luís Felipe dos Santos Rocha', role: 'Documentação e QA' },
];

const mentor = { name: 'Osmam Brás de Souto', role: 'Orientador Acadêmico' };

const SobreScreen = () => {
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Sobre o App</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.contentContainer}>
                    <Image
                        source={require('../assets/images/FingoText.png')}
                        style={styles.logoText}
                        resizeMode="contain"
                    />
                    <Image
                        source={require('../assets/images/logoFinGo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />

                    <Text style={styles.subtitle}>Aplicativo de educação financeira gamificada para jovens</Text>
                    <Text style={styles.version}>Versão 1.0.0</Text>
                    
                    <View style={styles.teamSection}>
                        <Text style={styles.teamTitle}>Equipe de Desenvolvimento</Text>
                        <Text style={styles.teamSubtitle}>
                            Projeto Integrador de Desenvolvimento Mobile — Engenharia de Software
                        </Text>
                        {teamMembers.map((member) => (
                            <View key={member.name} style={styles.memberCard}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberRole}>{member.role}</Text>
                            </View>
                        ))}
                        <View style={[styles.memberCard, styles.mentorCard]}>
                            <Text style={styles.memberName}>{mentor.name}</Text>
                            <Text style={styles.memberRole}>{mentor.role}</Text>
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.infoTitle}>Sobre o Projeto</Text>
                        <Text style={styles.infoText}>
                            O FinGo foi desenvolvido como um projeto educacional com o objetivo de ensinar educação financeira de forma gamificada e interativa para jovens, através de trilhas de aprendizado, desafios, quizzes e histórias envolventes.
                        </Text>
                        <Text style={styles.infoText}>
                            Este aplicativo integra o Projeto Integrador de Desenvolvimento Mobile, reforçando o compromisso acadêmico da equipe com pesquisa, inovação e impacto social em educação financeira infantil.
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
    scrollContent: {
        paddingHorizontal: 12,
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 15,
        marginBottom: 20,
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
    contentContainer: {
        alignItems: 'center',
        gap: 10,
        width: '100%',
        flexGrow: 1,
        justifyContent: 'center',
    },
    logoText: {
        width: '80%',
        height: 50,
        marginBottom: 10,
    },
    logoImage: {
        width: 100,
        height: 100,
    },
    subtitle: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#000000',
        textAlign: 'center',
    },
    version: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#000000',
        textAlign: 'center',
    },
    teamSection: {
        width: '100%',
        marginTop: 24,
        marginBottom: 24,
    },
    teamTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 16,
    },
    teamSubtitle: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    memberCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    mentorCard: {
        backgroundColor: '#F0F9F0',
    },
    memberName: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        color: '#000000',
        marginBottom: 4,
    },
    memberRole: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        color: '#666',
    },
    infoSection: {
        width: '100%',
        marginTop: 16,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    infoTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 16,
        color: '#000000',
        marginBottom: 12,
    },
    infoText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        textAlign: 'justify',
    },
});

export default SobreScreen;