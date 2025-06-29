# 🚀 Déploiement Vercel

Guide pour déployer OpenChat AI UI sur Vercel en 5 minutes.

## ⚡ Déploiement en 1 clic

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/openchat-ai-ui&env=OPENAI_API_KEY,OPENAI_API_TYPE,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION&envDescription=Configuration%20pour%20OpenAI%20ou%20AWS%20Bedrock&envLink=https://github.com/votre-username/openchat-ai-ui/blob/main/docs/ENVIRONMENT.md)

## 📋 Prérequis

- ✅ Compte Vercel (gratuit)
- ✅ Repo GitHub de votre projet
- ✅ Clé API OpenAI OU credentials AWS

## 🛠️ Étape 1 : Préparer le projet

### 1. Fork ou clone le repo
```bash
git clone https://github.com/votre-username/openchat-ai-ui.git
cd openchat-ai-ui
```

### 2. Installer Vercel CLI (optionnel)
```bash
npm i -g vercel
```

## ⚙️ Étape 2 : Configuration

### Option A : OpenAI (Simple)
```bash
# Variables d'environnement Vercel
OPENAI_API_KEY=sk-votre-clé-openai
```

### Option B : AWS Bedrock (Avancé)
```bash
# Variables d'environnement Vercel
OPENAI_API_TYPE=bedrock
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=ABCDEFGHIJ
BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0
```

## 🚀 Étape 3 : Déploiement

### Méthode 1 : Via Dashboard Vercel (Recommandée)

1. **Aller sur Vercel.com**
   - Connexion avec GitHub

2. **Importer le projet**
   ```
   New Project > Import Git Repository
   ```

3. **Sélectionner votre repo**
   ```
   openchat-ai-ui
   ```

4. **Configurer les variables d'environnement**
   ```
   Environment Variables:
   
   Pour OpenAI :
   OPENAI_API_KEY = sk-votre-clé
   
   Pour Bedrock :
   OPENAI_API_TYPE = bedrock
   AWS_ACCESS_KEY_ID = votre-access-key
   AWS_SECRET_ACCESS_KEY = votre-secret-key
   AWS_REGION = us-east-1
   BEDROCK_KNOWLEDGE_BASE_ID = votre-kb-id
   BEDROCK_MODEL_ARN = amazon.nova-pro-v1:0
   ```

5. **Déployer**
   ```
   Deploy → Attendre 2-3 minutes
   ```

### Méthode 2 : Via CLI Vercel

```bash
# Dans le dossier du projet
vercel

# Suivre les prompts :
# ? Set up and deploy? Yes
# ? Which scope? Your Personal Account
# ? Link to existing project? No
# ? What's your project's name? openchat-ai-ui
# ? In which directory is your code located? ./
```

#### Ajouter les variables d'environnement :
```bash
# Pour OpenAI
vercel env add OPENAI_API_KEY

# Pour Bedrock
vercel env add OPENAI_API_TYPE
vercel env add AWS_ACCESS_KEY_ID  
vercel env add AWS_SECRET_ACCESS_KEY
vercel env add AWS_REGION
vercel env add BEDROCK_KNOWLEDGE_BASE_ID
vercel env add BEDROCK_MODEL_ARN
```

#### Déployer en production :
```bash
vercel --prod
```

## 🔧 Configuration Vercel

### 1. Fichier vercel.json (optionnel)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Configuration Next.js
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk']
  },
  // Pour les domaines d'images externes
  images: {
    domains: ['avatars.githubusercontent.com']
  }
}

module.exports = nextConfig
```

## 🌍 Étape 4 : Configuration du domaine

### Domaine par défaut
Votre app sera disponible sur :
```
https://votre-projet-hash.vercel.app
```

### Domaine personnalisé
1. **Aller dans Settings > Domains**
2. **Ajouter votre domaine**
   ```
   openchat-ai.votre-domaine.com
   ```
3. **Configurer DNS chez votre registrar**
   ```
   Type: CNAME
   Name: openchat-ai
   Value: cname.vercel-dns.com
   ```

## 📊 Étape 5 : Monitoring et Analytics

### 1. Activer Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### 2. Monitoring des erreurs avec Sentry (optionnel)
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🚨 Dépannage

### Erreur : "Build failed"
```bash
# Vérifiez les logs dans Vercel Dashboard
# Common issues:

1. Variables d'environnement manquantes
2. Dépendances NPM incompatibles  
3. Erreurs TypeScript
```

### Erreur : "Function timeout"
```bash
# Augmenter le timeout dans vercel.json
{
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 60  // Max 60s pour Pro plan
    }
  }
}
```

### Erreur : "AWS credentials"
```bash
# Vérifiez que les variables AWS sont bien définies
# Dans Vercel Dashboard > Settings > Environment Variables

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

### Problème : "Streaming doesn't work"
```bash
# Vercel supporte le streaming par défaut
# Vérifiez que vous utilisez bien Next.js App Router
# Ou Edge Runtime pour les API routes
```

## 🔄 Étape 6 : CI/CD automatique

### Auto-deploy sur push
Vercel déploie automatiquement :
- ✅ **Production** : sur push vers `main`
- ✅ **Preview** : sur push vers autres branches
- ✅ **Pull Requests** : preview automatique

### Webhook Discord/Slack (optionnel)
```bash
# Dans Vercel Dashboard > Settings > Git Integration
# Ajouter webhook URL de votre chat
```

## 💰 Limites et tarifs Vercel

### Plan Hobby (Gratuit)
- ✅ 100 GB-hours/mois
- ✅ 1000 invocations serverless/jour
- ✅ 100 GB bandwidth/mois
- ⚠️ Pas de domaines personnalisés avec SSL

### Plan Pro (20$/mois)
- ✅ 1000 GB-hours/mois  
- ✅ 100,000 invocations/jour
- ✅ 1 TB bandwidth/mois
- ✅ Domaines personnalisés
- ✅ Password protection
- ✅ Analytics avancés

## ✅ Checklist finale

- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] URL de production accessible
- [ ] Chat fonctionne (test avec message)
- [ ] Streaming temps réel actif
- [ ] Analytics configurés (optionnel)
- [ ] Domaine personnalisé (optionnel)
- [ ] Monitoring erreurs (optionnel)

## 🎉 URLs de démonstration

Après déploiement, partagez vos URLs :

- **Production** : `https://votre-projet.vercel.app`
- **Demo** : `https://votre-projet.vercel.app/demo`  
- **Popup Demo** : `https://votre-projet.vercel.app/demo-popin`

**Félicitations ! Votre OpenChat AI UI est maintenant live ! 🚀**