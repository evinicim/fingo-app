import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

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
                    <Text style={styles.version}>Versão 1.0</Text>
                    <Text style={styles.authors}>Desenvolvida por alunos (Asaph Gatão e uns doido que amo)</Text>
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
    authors: {
        fontFamily: 'Outfit-Regular',
        fontSize: 12,
        lineHeight: 15,
        color: '#000000',
        textAlign: 'center',
    },
});

export default SobreScreen;