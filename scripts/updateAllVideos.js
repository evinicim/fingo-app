/**
 * Script para atualizar URLs de todos os vídeos das trilhas
 * Execute: node scripts/updateAllVideos.js
 */

import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Inicializar Firebase Admin
let serviceAccountPath = process.env.FINGO_SERVICE_ACCOUNT
  ? path.resolve(__dirname, process.env.FINGO_SERVICE_ACCOUNT)
  : path.resolve(__dirname, 'fingo-app-5d9ec-firebase-adminsdk-fbsvc-c633fb1966.json');

if (!fs.existsSync(serviceAccountPath)) {
  const fallback = path.resolve(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(fallback)) {
    serviceAccountPath = fallback;
  } else {
    console.error('❌ Arquivo de service account não encontrado em:', serviceAccountPath);
    process.exit(1);
  }
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
initializeAdminApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// URLs dos vídeos fornecidas
const videos = [
  {
    moduloId: 'trilha_01_modulo_02',
    url: 'https://drive.google.com/file/d/1yst7_hOSJr8aZ5c3Be_e2bH91KqiJBJd/preview',
    trilha: 'Trilha 01'
  },
  {
    moduloId: 'trilha_02_modulo_02',
    url: 'https://drive.google.com/file/d/1Gma-3vDJmjziM9SDmK08KWofGBI1anr8/preview',
    trilha: 'Trilha 02'
  },
  {
    moduloId: 'trilha_03_modulo_02',
    url: 'https://drive.google.com/file/d/1cK9_JY4rsWkBIPIzXAoulWbN_8f_OXan/preview',
    trilha: 'Trilha 03'
  },
  {
    moduloId: 'trilha_04_modulo_02',
    url: 'https://drive.google.com/file/d/1Lcn2jISdV76IUwt3Q6TuHpEovcthGFrE/preview',
    trilha: 'Trilha 04'
  }
];

// Função para atualizar URL do vídeo
async function updateVideoUrl(moduloId, videoUrl, trilha) {
  try {
    console.log(`\n📝 Atualizando ${trilha} - Módulo: ${moduloId}`);
    console.log(`🔗 URL: ${videoUrl}`);

    // Tentar primeiro com 'moduloId'
    let moduloRef = db.collection('moduloId').doc(moduloId);
    let moduloDoc = await moduloRef.get();

    // Se não encontrar, tentar com 'modulos'
    if (!moduloDoc.exists) {
      console.log('⚠️  Tentando coleção alternativa "modulos"...');
      moduloRef = db.collection('modulos').doc(moduloId);
      moduloDoc = await moduloRef.get();
    }

    if (!moduloDoc.exists) {
      console.error(`❌ Módulo ${moduloId} não encontrado no Firestore!`);
      return false;
    }

    const moduloData = moduloDoc.data();
    console.log(`📋 Módulo encontrado: ${moduloData.titulo || moduloId}`);

    // Atualizar URL e garantir que o tipo seja 'video'
    await moduloRef.update({
      urlConteudo: videoUrl,
      tipo: 'video', // Garantir que seja do tipo vídeo
      atualizadoEm: new Date().toISOString(),
    });

    console.log(`✅ ${trilha} atualizado com sucesso!`);
    return true;

  } catch (error) {
    console.error(`❌ Erro ao atualizar ${trilha}:`, error.message);
    return false;
  }
}

// Executar atualizações
async function updateAllVideos() {
  console.log('🚀 Iniciando atualização de todos os vídeos...\n');
  
  let sucesso = 0;
  let falhas = 0;

  for (const video of videos) {
    const resultado = await updateVideoUrl(video.moduloId, video.url, video.trilha);
    if (resultado) {
      sucesso++;
    } else {
      falhas++;
    }
    // Pequeno delay entre atualizações
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DA ATUALIZAÇÃO');
  console.log('='.repeat(50));
  console.log(`✅ Sucessos: ${sucesso}`);
  console.log(`❌ Falhas: ${falhas}`);
  console.log(`📹 Total: ${videos.length}`);
  console.log('='.repeat(50));
  
  if (sucesso === videos.length) {
    console.log('\n🎉 Todos os vídeos foram atualizados com sucesso!');
    console.log('📱 Os vídeos já estão disponíveis no app!');
  } else {
    console.log('\n⚠️  Alguns vídeos não puderam ser atualizados.');
    console.log('   Verifique os erros acima e tente novamente.');
  }
}

updateAllVideos().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

