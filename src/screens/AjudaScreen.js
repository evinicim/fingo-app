import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AccordionItem from '../components/AccordionItem';

const AjudaScreen = () => {
    const navigation = useNavigation();
    
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
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Ajuda</Text>
                    <View style={styles.placeholder} />
                </View>
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
    accordionContainer: {
        width: '100%',
        gap: 10,
    },
});

export default AjudaScreen;