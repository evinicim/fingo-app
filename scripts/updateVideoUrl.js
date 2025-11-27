/**
 * Script para atualizar URL do vídeo no Firestore
 * Execute: node scripts/updateVideoUrl.js <modulo-id> <url-do-video>
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

// Função para atualizar URL do vídeo
async function updateVideoUrl(moduloId, videoUrl) {
  try {
    console.log(`\n📝 Atualizando módulo: ${moduloId}`);
    console.log(`🔗 URL do vídeo: ${videoUrl}\n`);

    // Tentar primeiro com 'moduloId' (usado no populateFirestore)
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
      console.error(`   Verifique se o módulo existe nas coleções 'moduloId' ou 'modulos'`);
      process.exit(1);
    }

    const moduloData = moduloDoc.data();
    console.log(`📋 Módulo encontrado: ${moduloData.titulo || moduloId}`);

    // Atualizar URL
    await moduloRef.update({
      urlConteudo: videoUrl,
      atualizadoEm: new Date().toISOString(),
    });

    console.log(`\n✅ Firestore atualizado com sucesso!`);
    console.log(`\n📋 Resumo:`);
    console.log(`   - Módulo: ${moduloId}`);
    console.log(`   - Título: ${moduloData.titulo || 'N/A'}`);
    console.log(`   - URL: ${videoUrl}`);
    console.log(`\n🎉 Processo concluído! O vídeo já está disponível no app!`);

  } catch (error) {
    console.error('❌ Erro durante a atualização:', error);
    process.exit(1);
  }
}

// Executar script
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('📖 Uso: node scripts/updateVideoUrl.js <modulo-id> <url-do-video>');
  console.log('\n📝 Exemplo:');
  console.log('   node scripts/updateVideoUrl.js trilha_01_modulo_02 https://youtu.be/fK_ivzQc4so');
  process.exit(1);
}

const [moduloId, videoUrl] = args;
updateVideoUrl(moduloId, videoUrl);

