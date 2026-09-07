# portfolio-angular

## 🎯 Autoavaliação

Conceito pretendido: A

Eu considero que alcancei o conceito A porque consegui deixar a página de Contato funcionando de forma completa, tratando tanto os casos de sucesso quanto os erros.

No arquivo `src/app/contato/contato.ts`, usei formulário reativo com `FormBuilder` e `Validators`. O nome precisa ter pelo menos 3 letras, o e-mail precisa ser válido e a mensagem precisa ter no mínimo 10 caracteres.

No `src/app/contato/contato.html`, coloquei mensagens de erro específicas para cada campo. Elas só aparecem depois que o usuário interage com o campo e o valor continua inválido. Também deixei o botão Enviar desabilitado quando o formulário está inválido ou enquanto o envio está acontecendo.

O envio dos dados é feito pelo arquivo `src/app/contato.service.ts`, usando `HttpClient` com `POST`. Quando o envio dá certo, a mensagem de sucesso aparece e o formulário é limpo.

Também tratei situações de erro. No `src/app/contato/contato.ts`, usei `HttpErrorResponse` para conseguir mostrar os erros que vêm da API. Fiz um teste usando um e-mail que passou pelo front, mas foi recusado pelo PHP, e a mensagem retornada pelo backend apareceu corretamente na tela.

Também testei o caso em que a API está desligada. Nesse caso, aparece uma mensagem informando que não foi possível conectar ao servidor, e o botão volta ao normal para o usuário poder tentar novamente.

Na parte de acessibilidade e experiência do usuário, liguei os `label` aos campos usando `for` e `id`, usei mensagens de texto junto com o destaque visual dos erros e fiz o primeiro campo inválido receber foco quando o usuário tenta enviar o formulário incorretamente.

No arquivo `api/contato.php`, os dados são lidos em JSON com `php://input` e `json_decode`. O servidor valida os dados novamente, usa `prepared statement` para gravar no banco e retorna os status `201` para sucesso e `400` quando os dados são inválidos.

Por esses motivos, acredito que o formulário atende aos critérios pedidos para o conceito A.