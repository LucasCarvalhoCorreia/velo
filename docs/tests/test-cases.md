# Documento de Casos de Teste - Velô Sprint

## Informações do Sistema
**Nome do sistema:** Velô Sprint - Configurador de Veículo Elétrico
**Módulos:** Landing Page, Configurador de Veículo, Checkout/Pedido, Análise de Crédito Automática, Confirmação, Consulta de Pedidos.
**Perfís:** Cliente (Usuário Comum)

---

### CT01 - Visualização da Landing Page e Navegação para o Configurador

#### Objetivo
Garantir que o cliente consegue acessar a página inicial do sistema e encontrar o caminho para iniciar a configuração do veículo.

#### Pré-Condições
- O sistema deve estar acessível pelo navegador.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL raiz do sistema (`/`) | A página inicial é carregada com sucesso exibindo as seções Hero, Especificações e Footer. |
| 2  | Clicar no botão principal de Call-to-Action (ex: "Configurar Agora" ou similar) | O sistema redireciona o usuário para a rota `/configure` (Configurador do veículo). |

#### Resultados Esperados
- O sistema carrega corretamente a Landing Page e leva o usuário para a interface de configuração sem erros.

#### Critérios de Aceitação
- A página exibe componentes visuais corretamente.
- O botão de CTA redireciona o usuário para a rota `/configure`.

---

### CT02 - Configuração base correta ao carregar o Configurador

#### Objetivo
Validar se o configurador inicia com o valor base (R$ 40.000) e a configuração padrão selecionada.

#### Pré-Condições
- O usuário deve estar na página do Configurador (`/configure`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Observar as opções selecionadas de fábrica (Cor exterior, Interior, Rodas) | O carro vem com configurações padrão (ex: Glacier Blue, Aero Wheels que não alteram preço). |
| 2  | Verificar o Preço de Venda exibido no painel | O preço total exibe o valor de R$ 40.000,00. |

#### Resultados Esperados
- O cliente visualiza a configuração padrão e o modelo custa estritamente o valor base de negócio.

#### Critérios de Aceitação
- Preço fixado em R$ 40.000 antes de qualquer customização.

---

### CT03 - Precificação dinâmica por alteração de itens no Configurador

#### Objetivo
Certificar-se de que a adição de rodas "Sport" e de pacotes opcionais aplica os custos corretos ditados pela regra de negócio.

#### Pré-Condições
- O usuário está no Configurador.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar a opção de roda "Sport Wheels" | O sistema atualiza o preço total somando R$ 2.000,00. |
| 2  | Marcar o campo do opcional "Precision Park" | O sistema atualiza o preço total somando mais R$ 5.500,00. |
| 3  | Marcar o campo do opcional "Flux Capacitor" | O sistema atualiza o preço total somando mais R$ 5.000,00. |

#### Resultados Esperados
- O preço de venda deve totalizar R$ 52.500,00 se todas as opções listadas acima forem selecionadas simultaneamente.

#### Critérios de Aceitação
- Rodas Sport = +R$ 2.000,00.
- Precision Park = +R$ 5.500,00.
- Flux Capacitor = +R$ 5.000,00.
- Qualquer alteração repercute no cálculo instantaneamente.

---

### CT04 - Validação de Campos Obrigatórios no Checkout

#### Objetivo
Impedir a submissão de um pedido sem o devido preenchimento dos dados obrigatórios.

#### Pré-Condições
- Usuário concluiu a configuração e clicou em "Monte o Seu", estando na página de Checkout (`/order`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar todos os campos em branco (Nome, Sobrenome, Email, Celular, CPF, Loja) e termos de uso não marcados. | O sistema continua nos campos do formulário. |
| 2  | Clicar no botão "Confirmar Pedido" | O sistema exibe mensagens de erro abaixo de cada campo apontando a obrigatoriedade. O pedido não é criado. |

#### Resultados Esperados
- O bloqueio de avançar ocorre mostrando claramente quais campos falharam na validação.

#### Critérios de Aceitação
- Nome e Sobrenome (mín. 2 caracteres).
- Seleção de Loja obrigatória.
- Termos de Uso devem obrigatoriamente ser aceitos.

---

### CT05 - Submissão do Checkout com Dados Inválidos

#### Objetivo
Verificar o bloqueio e feedback em entradas inválidas de e-mail e CPF.

#### Pré-Condições
- O usuário está na tela de Checkout.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher o campo "Email" com `testeemail.com` (sem @) e "CPF" com número incompleto | Sistema os aceita no input porém a máscara de CPF deve restringir caracteres inválidos. |
| 2  | Clicar no botão "Confirmar Pedido" | Mensagem de erro "Email inválido" e erro para CPF incompleto. |

#### Resultados Esperados
- Submissão evitada com sucesso, informando os motivos específicos de validação regex/Zod.

#### Critérios de Aceitação
- O campo e-mail exige um formato de e-mail válido.
- O campo CPF exige preenchimento numérico completo do formato de 14 dígitos (com pontuação).

---

### CT06 - Compra Bem-Sucedida à Vista (Fluxo Feliz)

#### Objetivo
Validar uma jornada completa de pedido com pagamento à vista sem a necessidade de análise de crédito.

#### Pré-Condições
- Usuário chegou ao Checkout com veículo padrão de R$ 40.000,00.
- Preencheu os dados corretamente com os Termos aceitos.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar na forma de pagamento "À Vista" | A forma de pagamento foca visualmente em "À Vista", congelando o valor em R$ 40.000. |
| 2  | Clicar em "Confirmar Pedido" | O sistema processa o pedido sem enviar à análise de crédito e redireciona para a página de Sucesso (`/success`). |

#### Resultados Esperados
- Criação de número de pedido.
- Redirecionamento correto e confirmação exibida na tela de sucesso.

#### Critérios de Aceitação
- Redirecionamento para a página de Sucesso demonstrando um número de pedido válido e status "APROVADO".

---

### CT07 - Compra Financiada com Score de Crédito Alto (> 700)

#### Objetivo
Confirmar que o pedido de financiamento é aprovado automaticamente se o score for alto.

#### Pré-Condições
- Cliente com CPF que simula um Score > 700 (API simulada para Aprovação).
- Usuário com carrinho no Checkout e formulário corretamente preenchido.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar "Financiamento" como forma de pagamento. | O sistema exibe o bloco de Entrada e Financiamento fixado em 12x com juros de 2% a.m. |
| 2  | Preencher 0 (zero) de entrada e clicar "Confirmar Pedido". | O sistema consulta a API de score, recebe a nota (ex: 750) e autoriza a operação. |
| 3  | Confirmar tela de Sucesso. | A tela do recibo indica status "APROVADO". |

#### Resultados Esperados
- Pedido criado com status de "APROVADO".

#### Critérios de Aceitação
- API consultada com sucesso e regra "Score > 700 = Aprovado" aplicada.

---

### CT08 - Compra Financiada com Score de Crédito Médio (501 a 700)

#### Objetivo
Garantir que os pedidos com score mediano entrem no processo de revisão (Em Análise).

#### Pré-Condições
- Cliente com CPF que retorna Score entre 501 e 700.
- Formulário preenchido no Checkout, opção Financiamento e Entrada de 0% (abaixo da regra de 50%).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Confirmar Pedido" após selecionar Financiamento | O sistema processa a API de crédito. |
| 2  | Visualizar a tela de retorno | O sistema exibe o pedido como concluído mas portando status "EM_ANALISE", pendente de liberação. |

#### Resultados Esperados
- O redirecionamento funciona, porém a flag do pedido fica como "EM_ANALISE".

#### Critérios de Aceitação
- Regra de Score 501-700 resultando em status "EM_ANALISE" cumprida.

---

### CT09 - Compra Financiada Recusada por Score Baixo (<= 500)

#### Objetivo
Validar a política de restrição de risco de crédito negativando a compra para o perfil correto.

#### Pré-Condições
- Cliente com CPF que possui Score <= 500 na integração.
- Formulário validado, opção de Financiamento selecionada e sem preenchimento suficiente de Entrada (Entrada = 0).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Clicar em "Confirmar Pedido" | O sistema processa junto a API do credit-analysis e intercepta a nota baixa. |
| 2  | Verificar a navegação posterior | O sistema redireciona à tela de Sucesso com criação de Pedido emitido com status "REPROVADO". |

#### Resultados Esperados
- Emissão de registro de "REPROVADO" no painel. 

#### Critérios de Aceitação
- Ocorre intercepção com status em "REPROVADO" caso Score <= 500 e Entrada < 50%.

---

### CT10 - Exceção de Aprovação por Alta Entrada (Score Baixo)

#### Objetivo
Tratar a regra de negócio que sobrepõe o limite de crédito: se um usuário tiver Score ruim, mas arcar com no mínimo 50% de entrada, o financiamento é validado automaticamente.

#### Pré-Condições
- Cliente com CPF que retorna Score de, por exemplo, 400 (Score Baixo).
- Valor total do pedido em R$ 40.000.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Selecionar "Financiamento". | O campo "Valor da Entrada" surge. |
| 2  | Digitar R$ 20.000,00 ou mais na Entrada (>= 50% do total) | O sistema computa o valor e recalcula as parcelas do residual. |
| 3  | Clicar em "Confirmar Pedido" | A validação ignora o repasse da recusa de score do credit-analysis. |
| 4  | Obter tela de Resumo de Compra | O status gerado do limite é "APROVADO". |

#### Resultados Esperados
- Passagem do status de REPROVADO para APROVADO pela aplicação da Regra Excepcional.

#### Critérios de Aceitação
- Se percentual de entrada >= 0.5 & score < 700 → o sistema força o update para 'APROVADO'.

---

### CT11 - Consulta de Existência de Pedido Válido

#### Objetivo
Validar se o módulo de Consulta de Pedido está resgatando informações fielmente e de modo seguro.

#### Pré-Condições
- O usuário possui o Código Oficial do Pedido anotado (Ex: `VLO-12345`).
- O usuário está situado na página de Consulta (`/lookup`).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Inserir o número do pedido existente (Ex: `VLO-12345`) no campo "Número do Pedido" | O input aceita a string. |
| 2  | Clicar em "Buscar Pedido" | O sistema exibe um Loader provisório e puxa os detalhes. |
| 3  | Observar os resultados carregados do card | Detalhes do veículo, cores, status atual (Aprovado/Reprovado/Em análise), nome do cliente e valor devem ser exibidos sem falhas. |

#### Resultados Esperados
- As informações precisas sobre a compra transacionada se revelam no painel.

#### Critérios de Aceitação
- A visualização apresenta os dados configurados e estado de aprovação corretamente.

---

### CT12 - Consulta de Pedido de Pedido Inválido/Inexistente (Segurança de Acesso e Erro)

#### Objetivo
Checar se o sistema lida corretamente quando identificadores nulos, que não existam na base de dados, ou de permissões falsas são jogados na consulta (segurança do search-order).

#### Pré-Condições
- O usuário visita `/lookup`.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar informações aleatórias como "VLO-999999" | Informação presente no text-box de busca. |
| 2  | Clicar no botão "Buscar Pedido" | O sistema tenta ler a base mas falha intencionalmente por vazio retornado. |
| 3  | Examinar Feedback Visual | Aparece um card contendo "Pedido não encontrado", alertando a verificação do número de identificação correto. |

#### Resultados Esperados
- Nenhum dado incorreto carregado e nenhuma injeção em outros usuários é vista pela negação direta da rota na API.

#### Critérios de Aceitação
- Caso "Not Found" ou restrição pelo fato da entrada do `order_number` não equiparar exibe aviso assertivo "Pedido não encontrado". Não expõe estado interno da aplicação.
