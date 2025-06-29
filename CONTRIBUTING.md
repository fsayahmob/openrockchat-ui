# Contributing to OpenRockChat UI

Merci de votre intérêt pour contribuer à OpenRockChat UI ! Ce guide vous aidera à contribuer efficacement.

## Table des matières
- [Code of Conduct](#code-of-conduct)
- [Comment contribuer](#comment-contribuer)
- [Setup de développement](#setup-de-développement)
- [Workflow de contribution](#workflow-de-contribution)
- [Style de code](#style-de-code)
- [Tests](#tests)
- [Documentation](#documentation)

## Code of Conduct

En participant à ce projet, vous acceptez de respecter notre [Code of Conduct](CODE_OF_CONDUCT.md).

## Comment contribuer

### Reporter un bug
1. Vérifiez que le bug n'a pas déjà été reporté dans les [Issues](https://github.com/fsayahmob/openrockchat-ui/issues)
2. Créez une nouvelle issue en utilisant le template [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
3. Incluez le maximum d'informations pour reproduire le bug

### Proposer une feature
1. Vérifiez que la feature n'existe pas déjà ou n'est pas en développement
2. Créez une issue en utilisant le template [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
3. Discutez de l'implémentation avec les mainteneurs avant de commencer

### Contribuer au code
1. Fork le repository
2. Créez une branche pour votre feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Setup de développement

### Prérequis
- Node.js 18+
- npm ou yarn
- Git

### Installation
```bash
# Cloner votre fork
git clone https://github.com/votre-username/openrockchat-ui.git
cd openrockchat-ui

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer vos variables d'environnement
# Éditer .env.local avec vos clés API
```

### Configuration pour OpenAI
```bash
# .env.local
OPENAI_API_KEY=sk-votre-clé-openai
```

### Configuration pour Bedrock
```bash
# .env.local
OPENAI_API_TYPE=bedrock
AWS_ACCESS_KEY_ID=votre-access-key
AWS_SECRET_ACCESS_KEY=votre-secret-key
AWS_REGION=us-east-1
BEDROCK_KNOWLEDGE_BASE_ID=votre-kb-id
BEDROCK_MODEL_ARN=amazon.nova-pro-v1:0
```

### Lancer en développement
```bash
npm run dev
# → http://localhost:3000
```

## Workflow de contribution

### 1. Issues First
Pour toute contribution significative, créez d'abord une issue pour discuter de l'implémentation.

### 2. Branches
- `main` : Branche principale stable
- `develop` : Branche de développement
- `feature/nom-feature` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs
- `docs/nom-doc` : Améliorations documentation

### 3. Commits
Utilisez des messages de commit clairs et descriptifs :
```bash
feat: add support for Claude 3.5 Sonnet model
fix: resolve streaming timeout issue with Bedrock
docs: update AWS setup documentation
style: format code with prettier
refactor: extract common streaming logic
test: add unit tests for message parsing
```

### 4. Pull Requests
- Utilisez le [template PR](.github/pull_request_template.md)
- Liez votre PR à une issue existante
- Incluez des tests pour nouvelles fonctionnalités
- Mettez à jour la documentation si nécessaire
- Vérifiez que tous les tests passent

## Style de code

### TypeScript
- Utilisez TypeScript strict
- Définissez des types explicites
- Évitez `any`

### React
- Utilisez les hooks React
- Composants fonctionnels uniquement
- Props typées avec interfaces

### Formatting
```bash
# Vérifier le formatting
npm run lint

# Corriger automatiquement
npm run format
```

### Conventions de nommage
- **Fichiers** : `kebab-case.tsx`
- **Composants** : `PascalCase`
- **Fonctions** : `camelCase`
- **Constants** : `UPPER_SNAKE_CASE`
- **Types/Interfaces** : `PascalCase`

## Tests

### Lancer les tests
```bash
# Tests unitaires
npm test

# Coverage
npm run coverage

# Tests e2e (si disponibles)
npm run test:e2e
```

### Écrire des tests
- Tests unitaires pour la logique métier
- Tests d'intégration pour les API
- Tests de composants pour l'UI

### Exemple de test
```typescript
// __tests__/components/ChatMessage.test.tsx
import { render, screen } from '@testing-library/react';
import { ChatMessage } from '@/components/Chat/ChatMessage';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    render(
      <ChatMessage 
        message={{ role: 'user', content: 'Hello' }}
        messageIndex={0}
      />
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Documentation

### Types de documentation à mettre à jour
- **README.md** : Overview et quick start
- **docs/** : Documentation technique détaillée
- **Commentaires code** : Pour la logique complexe
- **JSDoc** : Pour les fonctions publiques

### Style de documentation
- Gardez un style professionnel
- Incluez des exemples de code
- Gardez les explications concises mais complètes
- Mettez à jour les captures d'écran si nécessaire

## Priorités de contribution

### High Priority
- Corrections de bugs critiques
- Support nouveaux modèles Bedrock
- Améliorations performance
- Tests manquants

### Medium Priority
- Nouvelles fonctionnalités UI
- Améliorations UX
- Documentation
- Exemples d'intégration

### Low Priority
- Optimisations mineures
- Refactoring
- Features expérimentales

## Communication

### Où discuter
- **Issues** : Bugs et features
- **Discussions** : Questions générales
- **PR Comments** : Review de code
- **Discord** : Chat en temps réel (si disponible)

### Response Times
- Les mainteneurs essaient de répondre dans les 48h
- Les reviews de PR peuvent prendre 2-5 jours
- Les releases sont faites hebdomadairement

## Labels d'issues

- `bug` : Quelque chose ne fonctionne pas
- `enhancement` : Nouvelle fonctionnalité ou amélioration
- `good first issue` : Bon pour les nouveaux contributeurs
- `help wanted` : Aide supplémentaire souhaitée
- `priority: high` : Priorité élevée
- `provider: openai` : Relatif à OpenAI
- `provider: bedrock` : Relatif à AWS Bedrock
- `area: ui` : Interface utilisateur
- `area: api` : Backend/API
- `area: docs` : Documentation

## Checklist avant de soumettre

- [ ] J'ai lu ce guide de contribution
- [ ] J'ai vérifié qu'il n'y a pas d'issue/PR similaire
- [ ] J'ai testé mes changements localement
- [ ] J'ai ajouté/mis à jour les tests si nécessaire
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Mon code respecte le style du projet
- [ ] Tous les tests passent

## Reconnaissance

Tous les contributeurs sont listés dans le README et reçoivent notre reconnaissance dans les releases notes.

Merci de contribuer à OpenRockChat UI !