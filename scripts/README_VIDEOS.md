# 📹 Atualização de Vídeos do Google Drive

## Como atualizar as URLs dos vídeos

### Opção 1: Atualizar todos os vídeos de uma vez (Recomendado)

Execute o script que atualiza todas as URLs automaticamente:

```bash
node scripts/updateAllVideos.js
```

Este script atualiza automaticamente os vídeos das trilhas 01, 02, 03 e 04.

### Opção 2: Atualizar vídeos individualmente

Para atualizar um vídeo específico:

```bash
node scripts/updateVideoUrl.js <modulo-id> <url-do-video>
```

**Exemplos:**

```bash
# Trilha 01
node scripts/updateVideoUrl.js trilha_01_modulo_02 "https://drive.google.com/file/d/1yst7_hOSJr8aZ5c3Be_e2bH91KqiJBJd/preview"

# Trilha 02
node scripts/updateVideoUrl.js trilha_02_modulo_02 "https://drive.google.com/file/d/1Gma-3vDJmjziM9SDmK08KWofGBI1anr8/preview"

# Trilha 03
node scripts/updateVideoUrl.js trilha_03_modulo_02 "https://drive.google.com/file/d/1cK9_JY4rsWkBIPIzXAoulWbN_8f_OXan/preview"

# Trilha 04
node scripts/updateVideoUrl.js trilha_04_modulo_02 "https://drive.google.com/file/d/1Lcn2jISdV76IUwt3Q6TuHpEovcthGFrE/preview"
```

## URLs dos Vídeos

- **Trilha 01**: `https://drive.google.com/file/d/1yst7_hOSJr8aZ5c3Be_e2bH91KqiJBJd/preview`
- **Trilha 02**: `https://drive.google.com/file/d/1Gma-3vDJmjziM9SDmK08KWofGBI1anr8/preview`
- **Trilha 03**: `https://drive.google.com/file/d/1cK9_JY4rsWkBIPIzXAoulWbN_8f_OXan/preview`
- **Trilha 04**: `https://drive.google.com/file/d/1Lcn2jISdV76IUwt3Q6TuHpEovcthGFrE/preview`

## Notas Importantes

1. Certifique-se de que o arquivo de service account do Firebase está configurado
2. Os vídeos devem estar públicos ou compartilhados no Google Drive
3. Após atualizar, os vídeos estarão disponíveis imediatamente no app
4. Se um vídeo não aparecer, verifique os logs no console do app

