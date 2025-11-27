import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Image, Alert, ActivityIndicator, Linking, Modal, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { MaterialIcons } from '@expo/vector-icons';
import { getTrilhaById, getModulosByTrilha, getHistoriaByModulo, getHistoriaByTrilha, getQuestoesCountByTrilha, getModuloById } from '../services/contentService';
import { markHistoriaAsCompleted, isHistoriaCompleted, calculateTrilhaProgress, getTrilhaProgress } from '../services/progressService';

// Funções de responsividade simples
const wp = (percentage) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

const hp = (percentage) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Função para extrair ID do vídeo do Google Drive
const getDriveVideoId = (url) => {
  if (!url || typeof url !== 'string') {
    // Mantido para debug de URLs inválidas
    // console.warn('getDriveVideoId: URL inválida ou não é string', url);
    return null;
  }
  
  url = url.trim();
  // ENDPOINT: Processamento de URL do vídeo (teste de parsing)
  // console.log('getDriveVideoId: Processando URL:', url);
  
  // Google Drive - formato: drive.google.com/file/d/ID/preview ou /file/d/ID/view
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    // ENDPOINT: ID extraído com sucesso
    // console.log('✅ ID do Google Drive extraído:', driveMatch[1]);
    return driveMatch[1];
  }
  
  // Se já for apenas o ID (sem caracteres especiais além de letras, números, _ e -)
  if (/^[a-zA-Z0-9_-]+$/.test(url)) {
    // ENDPOINT: URL já era apenas o ID
    // console.log('✅ ID do Google Drive (apenas ID):', url);
    return url;
  }
  
  // Tentar extrair de iframe src (com aspas simples ou duplas)
  const iframeMatch = url.match(/src=["']([^"']+)["']/);
  if (iframeMatch && iframeMatch[1]) {
    const iframeUrl = iframeMatch[1];
    const idMatch = iframeUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      // ENDPOINT: ID extraído de iframe
      // console.log('✅ ID do Google Drive extraído de iframe:', idMatch[1]);
      return idMatch[1];
    }
  }
  
  // Tentar extrair de iframe sem aspas (caso a URL venha como HTML completo)
  const iframeMatch2 = url.match(/src=([^\s>]+)/);
  if (iframeMatch2 && iframeMatch2[1]) {
    const iframeUrl = iframeMatch2[1].replace(/["']/g, '');
    const idMatch = iframeUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      // ENDPOINT: ID extraído de iframe sem aspas
      // console.log('✅ ID do Google Drive extraído de iframe (sem aspas):', idMatch[1]);
      return idMatch[1];
    }
  }
  
  // Mantido para debug de URLs que não puderam ser parseadas
  // console.warn('❌ getDriveVideoId: Não foi possível extrair ID da URL:', url);
  return null;
};

const videoStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  videoWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoContainerError: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 1,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  youtubeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
    marginLeft: 8,
  },
});

// Componente do Player de Vídeo Embutido (Google Drive)
const VideoPlayer = ({ videoUrl, onVideoEnd }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ENDPOINT: Debug de URL do vídeo (teste de carregamento)
  // console.log('VideoPlayer - videoUrl recebida:', videoUrl);
  // console.log('VideoPlayer - tipo da URL:', typeof videoUrl);
  // console.log('VideoPlayer - URL é válida?', videoUrl && typeof videoUrl === 'string' && videoUrl.length > 0);
  
  const driveVideoId = getDriveVideoId(videoUrl);
  // ENDPOINT: ID do vídeo extraído
  // console.log('VideoPlayer - driveVideoId extraído:', driveVideoId);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!videoUrl) {
    // Mantido para debug de vídeos sem URL
    // console.warn('VideoPlayer - videoUrl é null ou undefined');
    return (
      <View style={videoStyles.videoContainerError}>
        <MaterialIcons name="video-library" size={48} color="#FF9800" />
        <Text style={videoStyles.errorText}>URL Indisponível</Text>
        <Text style={{ color: '#666', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 20, fontFamily: 'Outfit-Regular' }}>
          O vídeo não está disponível no momento.
        </Text>
      </View>
    );
  }
  
  if (!driveVideoId) {
    // Mantido para debug de vídeos sem ID válido
    // console.warn('VideoPlayer - driveVideoId é null. URL:', videoUrl);
    return (
      <View style={videoStyles.videoContainerError}>
        <MaterialIcons name="error-outline" size={48} color="#FF9800" />
        <Text style={videoStyles.errorText}>URL Indisponível</Text>
        <Text style={{ color: '#666', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 20, fontFamily: 'Outfit-Regular' }}>
          O vídeo não está disponível no momento. Tente novamente mais tarde.
        </Text>
      </View>
    );
  }

  // HTML com iframe do Google Drive - vídeo exibido diretamente no card
  const driveEmbedUrl = `https://drive.google.com/file/d/${driveVideoId}/preview`;
  const videoHtml = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { 
  width: 100%; 
  height: 100%; 
  background: #000; 
  overflow: hidden; 
  margin: 0;
  padding: 0;
  position: relative;
}
.video-container { 
  width: 100%; 
  height: 100%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  position: relative;
  margin: 0;
  padding: 0;
}
iframe { 
  width: 100%; 
  height: 100%; 
  border: 0; 
  margin: 0;
  padding: 0;
  display: block;
}
</style>
</head>
<body>
<div class="video-container">
<iframe 
  id="drive-player"
  src="${driveEmbedUrl}" 
  frameborder="0" 
  allow="autoplay; fullscreen"
  allowfullscreen
></iframe>
</div>
<script>
(function() {
  var iframe = document.getElementById('drive-player');
  var videoStarted = false;
  
  if (iframe && window.ReactNativeWebView) {
    iframe.onload = function() {
      setTimeout(function() {
        if (!videoStarted && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'video-ready'}));
        }
      }, 2000);
    };
    
    // Detectar quando vídeo começa
    setTimeout(function() {
      if (window.ReactNativeWebView && !videoStarted) {
        videoStarted = true;
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'video-started'}));
      }
    }, 3000);
    
    // Tentar detectar fim do vídeo
    var checkVideo = setInterval(function() {
      try {
        var video = iframe.contentDocument || iframe.contentWindow.document;
        var videoElement = video.querySelector('video');
        if (videoElement && videoElement.ended) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'video-ended'}));
          }
          clearInterval(checkVideo);
        }
      } catch(e) {
        // Cross-origin, não podemos acessar
      }
    }, 2000);
    
    setTimeout(function() { clearInterval(checkVideo); }, 600000);
  }
})();
</script>
</body>
</html>`;

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'video-started') {
        setIsFullscreen(true);
      } else if (data.type === 'video-ended') {
        setIsFullscreen(false);
        if (onVideoEnd) onVideoEnd();
      }
    } catch (e) {}
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  // Modal de vídeo em tela cheia
  const FullscreenVideo = () => (
    <Modal
      visible={isFullscreen}
      animationType="fade"
      onRequestClose={handleCloseFullscreen}
      supportedOrientations={['portrait', 'landscape']}
    >
      <StatusBar hidden={isFullscreen} />
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 20,
            padding: 10,
          }}
          onPress={handleCloseFullscreen}
        >
          <MaterialIcons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <WebView
          source={{ html: videoHtml }}
          style={{ flex: 1 }}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          mixedContentMode="always"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          originWhitelist={['*']}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            // Mantido para debug de erros críticos do WebView fullscreen
            // console.error('WebView Fullscreen - Erro:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            // Mantido para debug de erros HTTP críticos do WebView fullscreen
            // console.error('WebView Fullscreen - Erro HTTP:', nativeEvent.statusCode);
          }}
          onMessage={handleMessage}
        />
      </View>
    </Modal>
  );

  return (
    <>
      <View style={videoStyles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsFullscreen(true)}
          style={videoStyles.videoWrapper}
        >
          {loading && (
            <View style={videoStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#18AD77" />
              <Text style={videoStyles.loadingText}>Carregando vídeo...</Text>
            </View>
          )}
          <WebView
            source={{ html: videoHtml }}
            style={videoStyles.webview}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={false}
            mixedContentMode="always"
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            originWhitelist={['*']}
            scrollEnabled={false}
            bounces={false}
            onLoadStart={() => {
              // ENDPOINT: WebView iniciou carregamento (teste de evento)
              // console.log('WebView - onLoadStart');
              setLoading(true);
              setError(null);
            }}
            onLoadEnd={() => {
              // ENDPOINT: WebView terminou carregamento (teste de evento)
              // console.log('WebView - onLoadEnd');
              setTimeout(() => setLoading(false), 1000);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              // Mantido para debug de erros críticos do WebView
              console.error('WebView - Erro:', nativeEvent);
              setError(nativeEvent.description || 'Erro ao carregar vídeo');
              setLoading(false);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              // Mantido para debug de erros HTTP críticos
              console.error('WebView - Erro HTTP:', nativeEvent.statusCode);
              setError(`Erro HTTP ${nativeEvent.statusCode}`);
              setLoading(false);
            }}
            onMessage={handleMessage}
          />
          {error && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: 20,
            }}>
              <MaterialIcons name="error-outline" size={48} color="#FF9800" />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Outfit-Bold', marginTop: 12, textAlign: 'center' }}>
                URL Indisponível
              </Text>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'Outfit-Regular', marginTop: 8, textAlign: 'center' }}>
                O vídeo não está disponível no momento. Tente novamente mais tarde.
              </Text>
            </View>
          )}
          {!loading && !isFullscreen && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
              <View style={{
                backgroundColor: '#FF0000',
                width: 70,
                height: 70,
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <MaterialIcons name="play-arrow" size={40} color="#FFFFFF" />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <FullscreenVideo />
    </>
  );
};

const HistoriaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { trilhaId } = route.params;
  
  const [trilha, setTrilha] = useState(null);
  const [historiaConcluida, setHistoriaConcluida] = useState(false);
  const [historia, setHistoria] = useState(null);
  const [moduloVideo, setModuloVideo] = useState(null);
  const [progressoReal, setProgressoReal] = useState(0);
  const [animacao] = useState(new Animated.Value(0));
  const [totalQuestoes, setTotalQuestoes] = useState(0);

  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    const loadHistoriaState = async () => {
      if (trilhaId) {
        const trilhaData = await getTrilhaById(trilhaId);
        setTrilha(trilhaData);

        // Carregar primeiro módulo de história da trilha
        // Buscar história por módulo (preferencial) ou por trilha (fallback)
        const modulos = await getModulosByTrilha(trilhaId);
        const ordenados = [...modulos].sort((a,b) => (a?.ordem ?? 999) - (b?.ordem ?? 999));
        const moduloHistoria = ordenados.find(m => (m?.tipo || '').toLowerCase() === 'historia') || ordenados[0];
        let h = null;
        if (moduloHistoria) {
          h = await getHistoriaByModulo(moduloHistoria.id);
        }
        if (!h) {
          h = await getHistoriaByTrilha(trilhaId);
        }
        setHistoria(h || null);

        // Carregar módulo de vídeo
        const moduloVideoData = ordenados.find(m => (m?.tipo || '').toLowerCase() === 'video');
        // ENDPOINT: Módulo de vídeo encontrado (teste de carregamento)
        // console.log('📹 Módulo de vídeo encontrado:', moduloVideoData);
        if (moduloVideoData) {
          const videoCompleto = await getModuloById(moduloVideoData.id);
          // ENDPOINT: Módulo completo carregado (teste de dados)
          // console.log('📹 Módulo completo carregado:', {
          //   id: videoCompleto?.id,
          //   titulo: videoCompleto?.titulo,
          //   urlConteudo: videoCompleto?.urlConteudo,
          //   temUrl: !!videoCompleto?.urlConteudo
          // });
          setModuloVideo(videoCompleto);
        } else {
          // Mantido para debug de trilhas sem vídeo
          // console.warn('⚠️ Nenhum módulo de vídeo encontrado para a trilha:', trilhaId);
        }

        // Contar questões pela trilha (fonte única confiável)
        const count = await getQuestoesCountByTrilha(trilhaId);
        // ENDPOINT: Contagem de questões (teste de dados)
        // console.log('[Historia] trilhaId=', trilhaId, 'totalQuestoesPorTrilha=', count);
        setTotalQuestoes(count);

        // Verificar se a história foi concluída
        const historiaCompleta = await isHistoriaCompleted(trilhaId);
        setHistoriaConcluida(historiaCompleta);

        // Carregar progresso real da trilha
        const progresso = await getTrilhaProgress(trilhaId);
        setProgressoReal(progresso);
      }
    };
    
    loadHistoriaState();
  }, [trilhaId]);

  useEffect(() => {
    Animated.spring(animacao, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  // Recarregar progresso quando a tela ganha foco (volta das questões)
  useFocusEffect(
    React.useCallback(() => {
      const reloadProgress = async () => {
        if (trilhaId) {
          try {
            // Recalcular e atualizar progresso
            const novoProgresso = await calculateTrilhaProgress(trilhaId);
            setProgressoReal(novoProgresso);
            
            // Verificar se história ainda está concluída
            const historiaCompleta = await isHistoriaCompleted(trilhaId);
            setHistoriaConcluida(historiaCompleta);
          } catch (error) {
            console.error('Erro ao recarregar progresso:', error);
          }
        }
      };
      
      reloadProgress();
    }, [trilhaId])
  );

  const handleVideoEnd = () => {
    // Callback quando o vídeo terminar (opcional)
    // ENDPOINT: Vídeo finalizado (teste de evento)
    // console.log('Vídeo finalizado');
  };

  const handleConcluirHistoria = async () => {
    try {
      // Marcar história como concluída no serviço de progresso
      const sucesso = await markHistoriaAsCompleted(trilhaId);
      
      if (sucesso) {
        setHistoriaConcluida(true);
        
        // Recalcular progresso da trilha
        const novoProgresso = await calculateTrilhaProgress(trilhaId);
        setProgressoReal(novoProgresso);
        
        // Mostrar feedback de sucesso
        Alert.alert(
          '🎉 Parabéns!',
          'História concluída! Agora você pode acessar os desafios!',
          [{ text: 'Continuar', style: 'default' }]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o progresso. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao concluir história:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  const handleIrParaDesafios = () => {
    navigation.navigate('Desafios', { trilhaId: trilha.id });
  };

  const handleVoltar = () => {
    navigation.goBack();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
      backgroundColor: '#F7F9FC',
    },
    header: {
      backgroundColor: '#58CC02',
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    historiaCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    historiaHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    historiaTitulo: {
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      textAlign: 'center',
      marginBottom: 8,
    },
    historiaDuracao: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      backgroundColor: '#F0F0F0',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    historiaConteudo: {
      fontSize: 16,
      fontFamily: 'Outfit-Regular',
      color: '#333333',
      lineHeight: 24,
      marginBottom: 24,
    },
    statusContainer: {
      backgroundColor: historiaConcluida ? '#E8F5E8' : '#FFF3E0',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
    alignItems: 'center',
  },
    statusIcon: {
      marginRight: 12,
    },
    statusText: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
      color: historiaConcluida ? '#58CC02' : '#FF9800',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    concluirButton: {
      backgroundColor: '#58CC02',
    },
    desafiosButton: {
      backgroundColor: '#4A90E2',
    },
    voltarButton: {
      backgroundColor: '#6C757D',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#FFFFFF',
    },
    desafiosButtonDisabled: {
      backgroundColor: '#E0E0E0',
    },
    desafiosButtonTextDisabled: {
      color: '#999999',
    },
    progressContainer: {
      backgroundColor: '#F8F9FA',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Outfit-Bold',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#58CC02',
      borderRadius: 4,
      width: '0%', // Será atualizado dinamicamente
    },
    videoContainer: {
      width: '100%',
      height: 220,
      backgroundColor: '#000',
      borderRadius: 16,
      marginBottom: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    videoContainerError: {
      width: '100%',
      height: 220,
      backgroundColor: '#F5F5F5',
      borderRadius: 16,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      zIndex: 1,
    },
    loadingText: {
      color: '#FFFFFF',
      marginTop: 12,
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
    },
    errorText: {
      color: '#FF6B6B',
      marginTop: 12,
      fontSize: 16,
      fontFamily: 'Outfit-Bold',
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Outfit-Regular',
      color: '#666666',
      marginTop: 8,
      textAlign: 'center',
  },
});

  if (!fontsLoaded || !trilha) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carregando...</Text>
        </View>
      </View>
    );
  }

  const questoesDisponiveis = totalQuestoes;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>História</Text>
          <Text style={styles.headerSubtitle}>{trilha.titulo}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Player de Vídeo Embutido - Só mostra se houver módulo de vídeo com URL */}
        {(() => {
          // ENDPOINT: Verificação de vídeo (teste de renderização)
          // console.log('🔍 Verificando se deve mostrar vídeo:', {
          //   moduloVideo: !!moduloVideo,
          //   urlConteudo: moduloVideo?.urlConteudo,
          //   temUrl: !!moduloVideo?.urlConteudo
          // });
          
          if (moduloVideo?.urlConteudo) {
            return (
              <VideoPlayer 
                videoUrl={moduloVideo.urlConteudo}
                onVideoEnd={handleVideoEnd}
              />
            );
          } else if (moduloVideo) {
            // Módulo existe mas não tem URL
            // Mantido para debug de módulos sem URL
            // console.warn('⚠️ Módulo de vídeo encontrado mas sem URL:', moduloVideo);
            return (
              <View style={videoStyles.videoContainerError}>
                <MaterialIcons name="video-library" size={48} color="#FF9800" />
                <Text style={videoStyles.errorText}>URL Indisponível</Text>
                <Text style={{ color: '#666', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 20, fontFamily: 'Outfit-Regular' }}>
                  O vídeo não está disponível no momento. Tente novamente mais tarde.
                </Text>
              </View>
            );
          }
          return null;
        })()}

        {/* Card da História */}
        <Animated.View
          style={[
            styles.historiaCard,
            {
              transform: [{ scale: animacao }]
            }
          ]}
        >
          {/* Header da História */}
          <View style={styles.historiaHeader}>
            <Text style={styles.historiaTitulo}>
              {historia?.titulo || 'História'}
            </Text>
            {historia?.duracao ? (
              <Text style={styles.historiaDuracao}>⏱️ {historia.duracao}</Text>
            ) : null}
          </View>

          {/* Conteúdo da História */}
          <Text style={styles.historiaConteudo}>
            {historia?.conteudo || 'Conteúdo da história indisponível no momento.'}
          </Text>

          {/* Status da História */}
          <View style={styles.statusContainer}>
            <View style={styles.statusIcon}>
              <MaterialIcons
                name={historiaConcluida ? "check-circle" : "schedule"}
                size={24}
                color={historiaConcluida ? "#58CC02" : "#FF9800"}
              />
            </View>
            <Text style={styles.statusText}>
              {historiaConcluida 
                ? "História concluída! Desafios liberados!" 
                : "Leia a história para liberar os desafios"
              }
            </Text>
          </View>

          {/* Progresso */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progresso da Trilha</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressoReal}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progressoReal}% concluído • {questoesDisponiveis} questões disponíveis
            </Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            {!historiaConcluida ? (
              <TouchableOpacity
                style={[styles.button, styles.concluirButton]}
                onPress={handleConcluirHistoria}
              >
                <Text style={styles.buttonText}>
                  Concluir História
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.desafiosButton]}
                onPress={handleIrParaDesafios}
              >
                <Text style={styles.buttonText}>
                  Ir para Desafios
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.voltarButton]}
              onPress={handleVoltar}
            >
              <Text style={styles.buttonText}>
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default HistoriaScreen;