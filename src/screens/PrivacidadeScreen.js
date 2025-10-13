import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import OptionItem from '../components/OptionItem';

const PrivacidadeScreen = () => {
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
        'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
        'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
        ...Feather.font,
        ...AntDesign.font,
        ...MaterialCommunityIcons.font,
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
                <Text style={styles.title}>Privacidade</Text>
                
                <View style={styles.optionsList}>
                    <OptionItem
                        title="Termos de uso"
                        icon={<Feather name="file-text" size={24} color="#000000" />}
                        onPress={() => Alert.alert("Navegar para Termos de uso")}
                    />
                    <OptionItem
                        title="Política de privacidade"
                        icon={<MaterialCommunityIcons name="shield-lock-outline" size={24} color="#000000" />}
                        onPress={() => Alert.alert("Navegar para Política de privacidade")}
                    />
                    <OptionItem
                        title="Manutenção de dados"
                        icon={<Feather name="database" size={24} color="#000000" />}
                        onPress={() => Alert.alert("Navegar para Manutenção de dados")}
                    />
                    <OptionItem
                        title="Excluir conta"
                        icon={<Feather name="trash-2" size={24} color="#FF0000" />}
                        onPress={() => Alert.alert("Confirmação para excluir conta")}
                    />
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
    optionsList: {
        width: '100%',
        gap: 16,
    },
});

export default PrivacidadeScreen;