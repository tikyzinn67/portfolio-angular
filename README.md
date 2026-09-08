# Portfólio Angular

Portfólio desenvolvido nas aulas de Desenvolvimento Web II do IFPR. O projeto usa Angular no front-end, PHP na API e MariaDB no banco de dados.

## Como rodar o projeto

Na raiz do repositório, ligue o MariaDB e suba a API:

```bash
sudo service mariadb start
/usr/bin/php -S 0.0.0.0:8000
```

No Codespaces, a porta 8000 precisa estar como **Public**.

Depois, em outro terminal, entre na pasta do Angular e rode:

```bash
cd portfolio-angular
ng serve
```

O Angular fica disponível na porta 4200. Se o endereço do Codespace mudar, atualize a URL da API em `portfolio-angular/src/app/projeto.service.ts`.

## Aula 18 - Formulário de Contato

Na Aula 18 implementei o formulário de contato com validações no front-end, envio por POST para a API, mensagens de sucesso e erro e tratamento dos erros retornados pelo PHP.

## Aula 19 - Área de Gestão

### Um endereço, quatro ações

O arquivo `api/projetos.php` consegue fazer várias coisas usando o mesmo endereço porque verifica qual método HTTP chegou na requisição.

Quando é GET, ele busca os projetos. O POST serve para criar, o PUT para editar e o DELETE para excluir. Assim, não preciso criar um arquivo diferente para cada ação.

### Testes da API

Antes de terminar a parte visual, testei a API diretamente pelo terminal.

#### Criar projeto - POST

```bash
curl -i -X POST http://localhost:8000/api/projetos.php \
-H "Content-Type: application/json" \
-d '{"nome":"Projeto de teste","ano":2026}'
```

Resultado:

```text
HTTP/1.1 201 Created
{"id":7}
```

#### Erro 400 - DELETE sem id

```text
HTTP/1.1 400 Bad Request
{"erro":"DELETE exige o id na URL: ?id=N"}
```

#### Erro 404 - id inexistente

```text
HTTP/1.1 404 Not Found
{"erro":"Projeto nao encontrado"}
```

#### Erro 405 - método não tratado

```text
HTTP/1.1 405 Method Not Allowed
{"erro":"Metodo nao permitido"}
```

Esses testes me ajudaram a confirmar que a API não trata pedidos inválidos como se tivessem funcionado e devolve um código adequado para cada situação.

### O que observei na aba Network

Ao editar um dos meus projetos pela tela de Gestão, conferi a requisição no DevTools:

- Método: **PUT**
- Status: **200 OK**
- Content-Type: **application/json; charset=utf-8**

Quando um projeto é criado, a API retorna 201 porque um novo recurso foi criado. Ao excluir, retorna 204 porque a operação deu certo, mas não existe conteúdo que precise voltar no corpo da resposta.

### Clique duplo no botão Adicionar

Se fosse possível clicar duas vezes rapidamente em Adicionar, poderiam sair dois POSTs antes da primeira requisição terminar e o mesmo projeto poderia ser cadastrado duas vezes.

Para evitar isso, usei a variável `salvando`. Enquanto o envio está acontecendo, o botão fica desabilitado e só volta ao normal quando a requisição termina.

### Atualização da lista

Depois de criar ou editar um projeto, escolhi chamar `carregar()` novamente. Assim a lista é buscada outra vez na API, aparece atualizada sem F5 e também reflete qualquer alteração que tenha acontecido no servidor.

No Excluir usei outra estratégia: depois que a API confirma a exclusão, retiro o projeto do array local com `filter()`. Isso economiza uma viagem à rede, mas a lista local pode ficar desatualizada se algo mudar por fora, como em outra aba ou diretamente no banco.

### Teste do OPTIONS

Também testei o pré-voo pelo terminal com `curl -i -X OPTIONS`. A resposta foi **204 No Content** e o cabeçalho informou `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`.

O navegador precisa dessa resposta antes de algumas requisições, como DELETE, para confirmar que o servidor aceita aquele método e permite a requisição daquela origem.

### Melhoria pesquisada: lista vazia

Adicionei um estado próprio para quando não existir nenhum projeto cadastrado. Em vez de deixar um espaço em branco, a tela explica que ainda não existem projetos e orienta a pessoa a usar o formulário.

Pesquisei esse tipo de situação no Carbon Design System, na parte de **Empty states**. A recomendação é deixar claro por que não há conteúdo e, quando existir uma próxima ação útil, orientar o usuário sobre o que fazer.

Fonte consultada: https://carbondesignsystem.com/patterns/empty-states-pattern/

### Por que não usei um link para excluir

Um `<a href>` não deve apagar um projeto porque um link comum faz GET, e GET deve ser uma operação de leitura.
Na minha implementação, a exclusão usa DELETE; confirmei no Network que ela retornou 204.
Se a exclusão acontecesse por GET, apenas visitar ou pré-carregar aquela URL poderia apagar um registro sem intenção.

## 📋 Ficha de Diagnóstico

Durante os testes percebi que algumas mudanças de estado não apareciam imediatamente na tela. Corrigi isso usando `ChangeDetectorRef` nos pontos em que a interface precisava ser atualizada.

Também percebi que, depois de criar ou editar, a lista só mostrava a mudança depois de F5. Corrigi chamando `carregar()` após o sucesso e fazendo o formulário voltar ao modo de adicionar.

Acrescentei estados visíveis de carregamento, erro e lista vazia, além de foco visível nos campos e botões e ajustes para telas menores.

Decidi não trocar o `confirm()` nativo por `MatDialog`, porque escolhi como polimento pesquisado o estado de lista vazia. O `confirm()` continua pedindo confirmação com o nome do projeto antes de excluir.

## 🎯 Autoavaliação

**Conceito pretendido: A**

Considero que alcancei o conceito A porque completei os requisitos dos níveis C e B e também implementei os itens pedidos para o nível A.

- **R1 — API com CRUD e tratamento dos verbos:** `api/projetos.php`, linhas 23-246. POST retorna 201 nas linhas 65-123, PUT é tratado nas linhas 125-208 e DELETE nas linhas 210-240.
- **R1 — erros previstos:** `api/projetos.php`, linhas 72-92, 127-135, 185-200, 212-239 e 242-246. Os testes 400, 404 e 405 estão neste `README.md`, linhas 56-75.
- **R1 — pré-voo OPTIONS:** `api/projetos.php`, linhas 4-18. O teste e a explicação estão neste `README.md`, linhas 101-105.
- **R2 — operações feitas pelo service:** `portfolio-angular/src/app/projeto.service.ts`, linhas 18-51. A URL fica no service e os métodos de leitura, criação, alteração e exclusão usam `HttpClient`.
- **R2 — status rascunho/publicado:** `portfolio-angular/src/app/gestao/gestao.ts`, linhas 28-42 e 69-80; `portfolio-angular/src/app/gestao/gestao.html`, linhas 45-57 e 96-105; `api/projetos.php`, linhas 25-63, 82-114 e 152-183.
- **R2 — erros visíveis:** `portfolio-angular/src/app/gestao/gestao.ts`, linhas 48-66, 116-127, 131-164 e 167-179; `portfolio-angular/src/app/gestao/gestao.html`, linhas 75-94.
- **R2 — polimento pesquisado:** `portfolio-angular/src/app/gestao/gestao.html`, linhas 87-94. A pesquisa está neste `README.md`, linhas 107-113.
- **R3 — lista atualiza sem F5 e formulário volta ao modo Adicionar:** `portfolio-angular/src/app/gestao/gestao.ts`, linhas 83-128. No Excluir, o `filter()` que atualiza a lista local está nas linhas 148-154.
- **R4 — justificativa dos quatro verbos:** este `README.md`, linhas 31-35.
- **R4 — registro do Network:** este `README.md`, linhas 79-87, com método PUT, status 200 e Content-Type.
- **R4 — comparação das estratégias:** este `README.md`, linhas 95-99.
- **R4 — objeção ao link que apaga:** este `README.md`, linhas 115-119, usando o DELETE 204 observado no Network como evidência.
- **R5 — instruções de execução:** este `README.md`, linhas 5-23.
- **R5 — estados da Gestão:** `portfolio-angular/src/app/gestao/gestao.html`, linhas 75-94.
- **R5 — estados da página pública:** `portfolio-angular/src/app/projetos/projetos.html`, linhas 9-28.
- **R5 — foco visível e responsividade:** `portfolio-angular/src/app/gestao/gestao.css`, linhas 99-105 e 211-232.
- **R5 — Ficha de Diagnóstico:** este `README.md`, linhas 121-129.

Por esses motivos, considero que o projeto atende ao conceito A.