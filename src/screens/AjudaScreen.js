import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AccordionItem from '../components/AccordionItem';

const AjudaScreen = () => {
    const [fontsLoaded] = useFonts({
        'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
        'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    });

    const faqData = [
        {
            question: "Como eu posso trocar a minha senha?",
            answer: "Você pode trocar a sua senha na página de configurações do perfil. A opção para redefinir a senha estará disponível no menu."
        },
        {
            question: "O que é educação financeira gamificada?",
            answer: "É uma metodologia que usa elementos de jogos para ensinar conceitos financeiros de forma divertida e interativa, ajudando você a aprender sobre dinheiro de um jeito novo."
        },
        {
            question: "Posso usar o aplicativo offline?",
            answer: "O aplicativo precisa de conexão com a internet para carregar os conteúdos e sincronizar seu progresso. No entanto, algumas atividades podem ser acessadas offline."
        },
        // Adicione mais perguntas e respostas aqui
    ];

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
                <Text style={styles.title}>Ajuda</Text>
                <View style={styles.accordionContainer}>
                    {faqData.map((item, index) => (
                        <AccordionItem
                            key={index}
                            question={item.question}
                            answer={item.answer}
                        />
                    ))}
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
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 40,
        paddingBottom: 24,
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: 32,
        lineHeight: 40,
        color: '#000000',
        marginBottom: 24,
    },
    accordionContainer: {
        width: '100%',
        gap: 10,
    },
});

export default AjudaScreen;