# Pressio — App de Acompanhamento de Saúde (React Native + Expo)

App fiel ao protótipo enviado, com 3 telas principais e navegação funcional:

- **Nova Leitura** — formulário para registrar pressão arterial (sistólica/diastólica) e glicemia, com botão "Salvar Medição".
- **Dashboard** — saudação personalizada, cartão de pressão arterial (com "velocímetro"), cartão de glicemia com mini gráfico de barras, lembretes de medicação e atalhos rápidos.
- **Relatórios** — gráfico de tendências (PAS / PAD / Glicose), histórico de leituras, e atalhos para lembretes e exportação de relatório.

- **Login / Registro** — validação de e-mail, senha e aceite dos termos; botões Google, Apple e Facebook (simulados).
- **Consultas** — faixa da semana, próximas consultas (hipertensão em azul, diabetes em dourado), histórico e botão "+" para agendar.
- **Lembretes de Medicação** — lista de medicações do dia, marcação como tomada e cadastro de novos lembretes.
- **Exportação de Relatórios** — registros de pressão e glicemia com ações de baixar e remover.
- **Perfil** e **Mais** — menus conforme o protótipo (Conta, Avatar, Notificação, Acessibilidade / Termos, Central de ajuda, Gerenciamento, Sobre, Sair).

Fluxo: o app abre em **Login** → **Tabs**. "Sair" em *Mais* volta ao Login.

## Funcionalidades implementadas

- Navegação por abas inferior (Dashboard, Relatórios, Perfil, Mais) + tela modal "Nova Leitura".
- Estado global compartilhado (Context API) — uma leitura salva em "Nova Leitura" aparece imediatamente no Dashboard e nos Relatórios.
- Gráficos nativos em SVG (linha e barras) sem dependências pesadas.
- Botão de favoritar (coração) no cartão de pressão.
- Checklist de medicação.
- Exportação de relatório (placeholder com alerta — pronto para integrar geração real de PDF/e-mail).
- Tema visual replicando a paleta azul-marinho com cartões translúcidos ("glass") do protótipo.

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o projeto com Expo:
   ```bash
   npx expo start --web
   ```
3. Escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione `i` / `a` para abrir num simulador.

## Estrutura de pastas

```
pressio-app/
├── App.js                        # Ponto de entrada, navegação em pilha
├── app.json                      # Configuração do Expo
├── src/
│   ├── theme/theme.js            # Cores, tipografia, espaçamento
│   ├── data/ReadingsContext.js   # Estado global das leituras (Context API)
│   ├── components/
│   │   ├── GlassCard.js          # Cartão translúcido reutilizável
│   │   ├── ValuePill.js          # Campo de valor estilo "pill" (Nova Leitura)
│   │   ├── LineChart.js          # Gráfico de linha em SVG
│   │   ├── BarChart.js           # Gráfico de barras em SVG
│   │   └── TabBar.js             # Barra de navegação inferior customizada
│   ├── navigation/TabsNavigator.js
│   └── screens/
│       ├── NovaLeituraScreen.js
│       ├── DashboardScreen.js
│       ├── RelatoriosScreen.js
│       ├── PerfilScreen.js
│       └── MaisScreen.js
```

## Próximos passos sugeridos

- Persistência local (AsyncStorage) ou backend real para as leituras.
- Autenticação de usuário.
- Geração real de PDF no botão "Exportar Relatório" (ex: `expo-print`).
- Notificações push para lembretes de medicação (`expo-notifications`).
