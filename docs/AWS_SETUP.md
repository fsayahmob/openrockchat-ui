# 🛠️ Configuration AWS Bedrock

Guide complet pour configurer AWS Bedrock avec OpenChat AI UI.

## 📋 Prérequis

- ✅ Compte AWS actif
- ✅ AWS CLI configuré (optionnel)
- ✅ Node.js 18+ installé

## 🔑 Étape 1 : Credentials AWS

### Option A : AWS CLI (Recommandée)
```bash
# Installer AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurer
aws configure
# AWS Access Key ID: VOTRE_ACCESS_KEY
# AWS Secret Access Key: VOTRE_SECRET_KEY  
# Default region: us-east-1
# Default output format: json
```

### Option B : Variables d'environnement
```bash
# .env.local
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_SESSION_TOKEN=IQoJb3JpZ2luX2VjE... (si nécessaire)
AWS_REGION=us-east-1
```

## 🤖 Étape 2 : Activer les modèles Bedrock

### 1. Aller dans la console AWS Bedrock
```
https://console.aws.amazon.com/bedrock/
```

### 2. Activer les modèles
```
Bedrock > Model access > Manage model access
```

### 3. Cocher les modèles nécessaires :
- ✅ **Amazon Nova** (Recommandé)
  - `amazon.nova-micro-v1:0`
  - `amazon.nova-lite-v1:0` 
  - `amazon.nova-pro-v1:0`

- ✅ **Anthropic Claude**
  - `anthropic.claude-3-5-sonnet-20241022-v2:0`
  - `anthropic.claude-3-haiku-20240307-v1:0`

- ✅ **Meta Llama**
  - `meta.llama3-1-405b-instruct-v1:0`
  - `meta.llama3-2-90b-instruct-v1:0`

### 4. Soumettre la demande
⚠️ **L'activation peut prendre 5-30 minutes**

## 📚 Étape 3 : Knowledge Base (Optionnel)

### 1. Créer une Knowledge Base

#### Via Console AWS :
```
Bedrock > Knowledge bases > Create knowledge base
```

#### Configuration :
```yaml
Name: "openchat-kb"
Description: "Knowledge base pour OpenChat AI"
Data source: S3 bucket
Embedding model: amazon.titan-embed-text-v1
Vector database: Amazon OpenSearch Serverless
```

### 2. Préparer vos documents

#### Formats supportés :
- ✅ PDF
- ✅ TXT  
- ✅ DOCX
- ✅ HTML
- ✅ Markdown

#### Structure S3 recommandée :
```
votre-bucket/
├── documents/
│   ├── faq.pdf
│   ├── guide-utilisateur.docx
│   └── api-docs.md
└── processed/ (généré automatiquement)
```

### 3. Obtenir l'ID de la Knowledge Base

Après création, notez l'ID :
```bash
# Format : ABCDEFGHIJ
BEDROCK_KNOWLEDGE_BASE_ID=ABCDEFGHIJ
```

## ⚙️ Étape 4 : Configuration OpenChat AI

### Variables d'environnement complètes :
```bash
# .env.local

# === AWS Bedrock Configuration ===
OPENAI_API_TYPE=bedrock
AWS_ACCESS_KEY_ID=votre-access-key
AWS_SECRET_ACCESS_KEY=votre-secret-key
AWS_SESSION_TOKEN=votre-session-token  # Si nécessaire
AWS_REGION=us-east-1

# === Modèle par défaut ===
BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0

# === Knowledge Base (optionnel) ===
BEDROCK_KNOWLEDGE_BASE_ID=ABCDEFGHIJ

# === Configuration avancée ===
DEFAULT_SYSTEM_PROMPT="Vous êtes un assistant IA intelligent et utile."
```

## 🧪 Étape 5 : Test de configuration

### 1. Test des credentials
```bash
# Test avec AWS CLI
aws bedrock list-foundation-models --region us-east-1

# Doit retourner la liste des modèles disponibles
```

### 2. Test dans OpenChat AI
```bash
npm run dev
# → http://localhost:3000

# Essayez d'envoyer un message
# Vérifiez la console pour les erreurs
```

### 3. Test Knowledge Base (si configurée)
```bash
# Dans la console Bedrock
Bedrock > Knowledge bases > Votre KB > Test

# Essayez une requête test
Query: "Qu'est-ce que votre produit ?"
```

## 🚨 Dépannage

### Erreur : "No credentials found"
```bash
# Vérifiez vos variables d'environnement
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Ou dans .env.local
cat .env.local | grep AWS
```

### Erreur : "Model access denied"
```bash
# Vérifiez l'activation des modèles dans la console AWS
# Bedrock > Model access
```

### Erreur : "Knowledge base not found"
```bash
# Vérifiez l'ID de votre Knowledge Base
aws bedrock-agent list-knowledge-bases --region us-east-1
```

### Erreur : "Region not supported"
Régions supportées pour Bedrock :
- ✅ `us-east-1` (N. Virginia) - Recommandée
- ✅ `us-west-2` (Oregon)
- ✅ `eu-west-1` (Ireland)
- ✅ `ap-southeast-1` (Singapore)

## 💰 Coûts AWS

### Modèles Nova (Recommandés - Moins chers)
- **Nova Micro** : ~$0.00035/1K tokens
- **Nova Lite** : ~$0.0006/1K tokens  
- **Nova Pro** : ~$0.0008/1K tokens

### Modèles Claude
- **Claude 3 Haiku** : ~$0.00025/1K tokens
- **Claude 3.5 Sonnet** : ~$0.003/1K tokens

### Knowledge Base
- **Stockage** : ~$0.10/GB/mois
- **Requêtes** : ~$0.0004/requête

### Estimation pour 1000 messages/jour :
- **Nova Micro** : ~$10/mois
- **Nova Pro** : ~$25/mois
- **Claude 3.5** : ~$90/mois

## 🔒 Sécurité

### Bonnes pratiques :
1. ✅ **Utilisez IAM roles** plutôt que des access keys
2. ✅ **Limitez les permissions** au minimum nécessaire
3. ✅ **Rotez vos credentials** régulièrement
4. ✅ **Chiffrez vos .env.local** en production

### Politique IAM minimale :
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/amazon.nova-*",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
      ]
    },
    {
      "Effect": "Allow", 
      "Action": [
        "bedrock:Retrieve"
      ],
      "Resource": "arn:aws:bedrock:*:*:knowledge-base/VOTRE-KB-ID"
    }
  ]
}
```

## ✅ Checklist finale

- [ ] Credentials AWS configurés
- [ ] Modèles Bedrock activés  
- [ ] Variables d'environnement définies
- [ ] Application démarre sans erreur
- [ ] Test de conversation réussi
- [ ] Knowledge Base fonctionnelle (si utilisée)
- [ ] Monitoring des coûts activé

🎉 **Félicitations ! Votre OpenChat AI est prêt avec AWS Bedrock !**