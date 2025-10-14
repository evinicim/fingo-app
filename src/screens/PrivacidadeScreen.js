import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { deleteUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OptionItem from '../components/OptionItem';
import { excluirConta } from '../services/userService';
import { auth } from '../services/firebaseConfig';

const PrivacidadeScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [fontsLoaded] = useFonts({
        'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
        'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
        ...Feather.font,
        ...AntDesign.font,
        ...MaterialCommunityIcons.font,
    });

    // Função para iniciar o processo de exclusão
    const handleIniciarExclusao = () => {
        Alert.alert(
            '⚠️ Atenção',
            'Você tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos permanentemente.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Continuar',
                    style: 'destructive',
                    onPress: () => setModalVisible(true),
                },
            ]
        );
    };

    // Função para confirmar e excluir a conta
    const handleConfirmarExclusao = async () => {
        if (confirmText.toLowerCase() !== 'excluir') {
            Alert.alert('Erro', 'Por favor, digite "EXCLUIR" para confirmar.');
            return;
        }

        try {
            setDeleting(true);
            const userId = auth.currentUser?.uid;

            if (!userId) {
                Alert.alert('Erro', 'Usuário não autenticado');
                return;
            }

            // 1. Excluir dados do Firestore
            const resultadoFirestore = await excluirConta(userId);
            
            if (!resultadoFirestore.success) {
                throw new Error('Falha ao excluir dados do Firestore');
            }

            // 2. Limpar AsyncStorage
            await AsyncStorage.clear();
            console.log('✅ AsyncStorage limpo');

            // 3. Excluir conta do Firebase Auth
            const user = auth.currentUser;
            if (user) {
                await deleteUser(user);
                console.log('✅ Conta do Firebase Auth excluída');
            }

            // 4. Redirecionar para tela de login
            setModalVisible(false);
            Alert.alert(
                'Conta Excluída',
                'Sua conta foi excluída com sucesso. Esperamos vê-lo novamente em breve!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        },
                    },
                ]
            );

        } catch (error) {
            console.error('❌ Erro ao excluir conta:', error);
            
            let mensagemErro = 'Não foi possível excluir sua conta. ';
            
            if (error.code === 'auth/requires-recent-login') {
                mensagemErro += 'Por questões de segurança, você precisa fazer login novamente antes de excluir sua conta.';
            } else {
                mensagemErro += 'Tente novamente mais tarde.';
            }
            
            Alert.alert('Erro', mensagemErro);
        } finally {
            setDeleting(false);
        }
    };

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
                        <AntDesign name="arrowleft" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Privacidade</Text>
                    <View style={styles.placeholder} />
                </View>
                
                <View style={styles.optionsList}>
                    <OptionItem
                        title="Termos de uso"
                        icon={<Feather name="file-text" size={24} color="#000000" />}
                        onPress={() => Alert.alert("Termos de Uso", "Funcionalidade em desenvolvimento")}
                    />
                    <OptionItem
                        title="Política de privacidade"
                        icon={<MaterialCommunityIcons name="shield-lock-outline" size={24} color="#000000" />}
                        onPress={() => Alert.alert("Política de Privacidade", "Funcionalidade em desenvolvimento")}
                    />
                    <OptionItem
                        title="Manutenção de dados"
                        icon={<Feather name="database" size={24} color="#000000" />}
                        onPress={() => Alert.alert("Manutenção de Dados", "Funcionalidade em desenvolvimento")}
                    />
                    <OptionItem
                        title="Excluir conta"
                        icon={<Feather name="trash-2" size={24} color="#FF0000" />}
                        onPress={handleIniciarExclusao}
                    />
                </View>
            </ScrollView>

            {/* Modal de Confirmação de Exclusão */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.warningBox}>
                                <Feather name="alert-triangle" size={48} color="#FF6B6B" />
                                <Text style={styles.warningTitle}>Atenção!</Text>
                                <Text style={styles.warningText}>
                                    Esta ação é permanente e irreversível. Todos os seus dados, incluindo:
                                </Text>
                                <View style={styles.warningList}>
                                    <Text style={styles.warningItem}>• Progresso nas trilhas</Text>
                                    <Text style={styles.warningItem}>• Pontuação e XP</Text>
                                    <Text style={styles.warningItem}>• Configurações de perfil</Text>
                                    <Text style={styles.warningItem}>• Histórico de atividades</Text>
                                </View>
                                <Text style={styles.warningText}>
                                    Serão perdidos permanentemente.
                                </Text>
                            </View>

                            <View style={styles.confirmationBox}>
                                <Text style={styles.confirmationLabel}>
                                    Digite <Text style={styles.confirmationKeyword}>EXCLUIR</Text> para confirmar:
                                </Text>
                                <TextInput
                                    style={styles.confirmationInput}
                                    placeholder="Digite aqui"
                                    value={confirmText}
                                    onChangeText={setConfirmText}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    setConfirmText('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.deleteButton,
                                    (deleting || confirmText.toLowerCase() !== 'excluir') && styles.deleteButtonDisabled
                                ]}
                                onPress={handleConfirmarExclusao}
                                disabled={deleting || confirmText.toLowerCase() !== 'excluir'}
                            >
                                {deleting ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.deleteButtonText}>Excluir Conta</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    optionsList: {
        width: '100%',
        gap: 16,
    },
    // Estilos do Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    modalTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 20,
        color: '#333',
    },
    modalBody: {
        padding: 20,
    },
    warningBox: {
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    warningTitle: {
        fontFamily: 'Outfit-Bold',
        fontSize: 18,
        color: '#FF6B6B',
        marginTop: 12,
        marginBottom: 8,
    },
    warningText: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 12,
    },
    warningList: {
        alignSelf: 'stretch',
        marginVertical: 12,
    },
    warningItem: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    confirmationBox: {
        marginTop: 10,
    },
    confirmationLabel: {
        fontFamily: 'Outfit-Regular',
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
    },
    confirmationKeyword: {
        fontFamily: 'Outfit-Bold',
        color: '#FF6B6B',
    },
    confirmationInput: {
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 8,
        padding: 12,
        fontFamily: 'Outfit-Regular',
        fontSize: 16,
        color: '#333',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    cancelButtonText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
    },
    deleteButtonDisabled: {
        backgroundColor: '#FFCCCB',
    },
    deleteButtonText: {
        fontFamily: 'Outfit-Bold',
        fontSize: 14,
        color: '#FFF',
    },
});

export default PrivacidadeScreen;