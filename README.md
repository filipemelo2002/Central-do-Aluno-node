# Central do Aluno API em Node.JS 
## Descrição do projeto
Este pequeno sistema faz parte do conjunto que diz respeito ao App [Central do Aluno](https://play.google.com/store/apps/details?id=com.feathercompany.www&hl=pt_BR).
Esta API Restful tem o intuito de prover os dados para serem consumidos pela Aplicação Mobile. Ainda mais, este software aborda as melhores práticas de arquitetura de APIs, possuindo suas principais camadas: _controllers_, _model_ entre outras boas práticas que são recomendadas no quesito de Desenvolvimento de Softwares.

## Pré-requisitos
* [Node.js](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/) _(Opcional)_
## Instalação
* Faça download do repositório em sua máquina
* Faça a instalação de todas as dependências que podem ser acessadas no arquivo [package.json](https://github.com/filipemelo2002/Central-do-Aluno-node/blob/master/package.json) _(recomendamos utilizar o Yarn por ser mais rápido)_
* `npm start` ou `yarn start`
## Endpoints
Todas as Rotas podem ser vistas no arquivo [routes.js](https://github.com/filipemelo2002/Central-do-Aluno-node/blob/master/src/routes.js).
  * `/sessions` rota que serve para autenticar o usuário, salvando-o no banco de dados Mongo, e retornando seu `userToken`
    * exemplo: 
        ```
          #Request
          {	
            "email":"seuusuario",
            "senha":"suasenha"
          }
          
          #Response
          {
            "_id": //id do usuário,
            "email": "seuusuario",
            "senha": "suasenha",
            "userToken": //userToken que será utilizado em futuras requisições,
            "__v": 0
          }
        ```
  * `/boletins` retorna todos os boletins do aluno
    * Exemplo: 
      ```
        [
          {
            "label": //Título do boletin,
            "boletimId": //identificador do Boletin,
            "ano": //ano que o usuário possui tal boletin
          },
          ...
        ]
      ```
  * `/boletins/view` recebe como _query params_ `boletimId` e `ano`, para retornar os dados do Boletin solicitado
    * A _Response_ desta requisição seguirá o seguinte padrão: 
      
      ```
        [
          "info":{
            //todas informações a respeito do aluno naquele ano escolar
          },
          "data":[
            {
              "materia":"Português",
              "nota_p1": "-",
              "nota_p2": "-",
              "nota_p3": "-",
              "nota_p4": "-",
              "nota_rf": "-",
              "nota_rec": "-"
            },
            ...
          ] // Array de JSONs que possuirá o nome da matéria e as notas do Usuário
        ]
      ```
  * `/faltas` Retornará os dados de falta, dividido em duas sessões: `percent` (percentual de falta no Bimestre) e `details` (quantidade bruta de faltas por matérias):
    * exemplo de retorno 
      ```
        {
          "percent": {
            "perc1": " - ",
            "perc3": " - ",
            "perc2": " - ",
            "perc4": " - "
          },
          "details": [
            {
              "materia": "Português",
              "fnj_p1": null,
              "fj_p1": null,
              "fnj_p2": null,
              "fj_p2": null,
              "fnj_p3": null,
              "fj_p3": null,
              "fnj_p4": null,
              "fj_p4": null
            },
        ...
      }
      ```
  * Com excessão da Rota `/sessions`, todas as outras deverão incluir no cabeçalho o parâmetro obrigatório `userToken`, para validar a sessão do usuário. Caso isso não ocorra, a API retornará um _status code 400_
