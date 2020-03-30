
# Workshop Elastic - Zero to Hero (Dia 1)
* **Criado por:** Anselmo Borges<br>
* **Última atualização:** 29.03.2020

[![](https://github.com/AnselmoBorges/zerotohero/blob/master/Slide1.jpg)](https://youtu.be/3PldhJq3ANc "Criação da infra no Google Cloud")

Nesse repositório estarão dispostos os arquivos necessários para configuração do ambiente, lembrando que vamos subir esse ambiente usando Google Cloud, o custo do mesmo é de responsabilidade do Aluno, estimo que a utilização do mesmo em umas 3 horas dará menos do que 10 reais, portanto lembre-se de excluir o ambiente depois de utilizado, caso contrário ele será cobrado enquanto ligado.

Nesse tutorial, vamos fazer uma instalação usando Docker, o que deixa o processo muito mais rápido e como nosso foco será mais na utilização do que na configuração da infra, acredito ser a melhor opção.

## Acessando o Google Cloud:
Para utilização do Google Cloud é necessário o uso de um Cartão de crédito, mas nada é debitado dele quando cadastrado, caso seja a sua primeira vez na plataforma, após o cadastro você ganha 300 dolares para usar na infra por 12 meses, sendo assim a criação dessa infra não terá custo.

Para acessar e fazer seu cadastro basta ter um email do gmail e entrar nesse link: 

https://cloud.google.com/

Acho que o processo de cadastro dura menos de 3 min e você já pode usar.

## Configuração do servidor:
Iremos criar um CentOS7 com 1VCPU, 3,75GB de RAM e 20GB de disco. Isso é mais do que o suficiente para nossos testes. Para criar sua maquina faça conforme vídeo abaixo (Clique na imagem para ver):

[![](https://i9.ytimg.com/vi/3PldhJq3ANc/mqdefault.jpg?time=1585525451897&sqp=CNDjhPQF&rs=AOn4CLDq_TrcgkqGVXNtbXDF8BjRmyXQpQ)](https://youtu.be/3PldhJq3ANc "Criação da infra no Google Cloud")

## Pré requisitos no S.O:
* Docker instalado
* Docker compose instalado
* Git instalado

## Instalando Pré-reqs
Para instalar todos os pré reqs citados acima rode os comandos abaixo:

```
sudo yum update -y
sudo yum install docker git -y
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

Com tudo instalado validamos o docker compose:

```
docker-compose -version
```

## Ambiente do laboratório:
* ElasticSearch (versão 7.6.1 atualmente) - Onde serão inseridos os dados
* Kibana (versão 7.6.1 atualmente) - Onde serão dispostos os dashboards e faremos os ajustes do index.

## Docker compose
É um arquivo yml que vem com as configurações necessárias para subirmos esses dados em Docker para iniciarmos os trabalhos. Maiores detalhes sobre o conteudo dele, basta ver o vídeo abaixo.

[![](http://img.youtube.com/vi/sKnrKFVlDQQ/0.jpg)](http://www.youtube.com/watch?v=sKnrKFVlDQQ "Criação de ambiente do LAB")

Para baixar o repositorio com o compose digite o comando abaixo:
```
git clone https://github.com/AnselmoBorges/zertoahero.git
```
Entre dentro do diretório baixado:
```
cd zerotohero
```

## Realize o start do deamon do Docker:
Por padrão o Docker não vem iniciado, sendo assim rodamos os comandos abaixo para iniciar o Docker:
```
sudo service docker start
```

## Como fazer a execução.
Com o docker e o docker-compose instalados (no meu caso num Linux) basta baixar esse conteudo via ```git clone``` e entrando na pasta baixada rodar o comando abaixo:

```
sudo docker-compose up -d
```

Não precisa passar o nome do arquivo pois ele considera que já está no diretório corrente e certifique-se disso, rs. O conteudo de cada uma das imagens será baixado o que pode demorar um pouco, mas estando tudo no ar basta acessar no navegador com ```http://localhost:portas_abaixo```:
* Elasticsearch - Porta 9200
* Kibana - Porta 5601
  
## Monitorando o start dos serviços:
Podemos acompanhar os logs de inicialização de cada serviço com o comando abaixo:
```
sudo docker-compose logs -f
```
Caso haja alguma duvida, segue o link do vídeo com toda essa implantação passo a passo. Clique na imagem!
[![](https://i9.ytimg.com/vi/aV1euh4B4XE/mqdefault.jpg?time=1585531117773&sqp=CJSQhfQF&rs=AOn4CLB-MuFpMBH7KnXFGoqIgYFBR-BlBw)](https://youtu.be/aV1euh4B4XE "Instalação do Elasticsearch e Kibana via Docker")

## Criação de Cluster no Elastic Cloud:
Uma outra opção, simples, rápida e eficiente é subir o seu Cluster no ambiente Elastic Cloud, que já vem configurado da maneira adequada, ajustavel de acordo com a sua necessidade, trabalha na infra cloud de sua preferencia (Amazon AWS, Google GCP e Microsoft Azure), e tem um trial de 14 dias sem necessidade de cartão de crédito, somente a conta de email.

O Cluster já vem como todas as ferramentas da versão licenciada, como Machine Learning, Grafos, Watcher e outras além de já vir com TLS e Autenticação ativada, ou seja, você chega a ganhar alguns dias de implantação no que diz respeito a velocidade.

No vídeo abaixo eu explico como criar a conta trial e subir um cluster básico na infra Elastic Cloud. (Clique na imagem para abrir!)

[![](https://i9.ytimg.com/vi/m-aLIWEZyvU/mqdefault.jpg?time=1585535473390&sqp=CKizhfQF&rs=AOn4CLAjcYIo9NpWy5i96bvVrjND8TEMIQ)](https://youtu.be/m-aLIWEZyvU "Criação de um cluster na Elastic Cloud")
