| [Home](https://techlipe.github.io/Workshop-Zero-To-Hero) | [Dia 01](https://techlipe.github.io/Workshop-Zero-To-Hero/dia01-configuracoes) | [Dia 02](https://techlipe.github.io/Workshop-Zero-To-Hero/dia02-observabilidade) | [Dia 03](https://techlipe.github.io/Workshop-Zero-To-Hero/dia03-elasticsearch) | [Dia 04](https://techlipe.github.io/Workshop-Zero-To-Hero/dia04-logstash) | [Dia 05](https://techlipe.github.io/Workshop-Zero-To-Hero/dia05-kibana) | 

# Workshop Elastic - Zero to Hero (Dia 2)
* **Criado por:** Felipe Queiroz e Anselmo Borges <br>
* **Última atualização:** 05.04.2020

![slide](https://github.com/AnselmoBorges/zerotohero/blob/master/Slide1.jpg)

Fala pessoal! Sejam muito bem vindos ao nosso Dia 02 de Workshop de Zero to Hero com toda a Elastic Stack. Hoje vimos como funciona o conceito de observabilidade e como consumir métricas e logs de algumas aplicações como Apache Web Server e as métricas do próprio docker que está rodando nossos serviços. Além também de implementarmos uma solução para visualizarmos um pouco como funciona o Elastic APM.


## Configurando o Metricbeat para monitorar os containeres
**Baixar o pacote do metricbeat**
```
cd ~
curl -L -O https://artifacts.elastic.co/downloads/beats/metricbeat/metricbeat-7.6.1-x86_64.rpm
sudo rpm -vi metricbeat-7.6.1-x86_64.rpm
```

**Habilitar modulos docker no Metricbeat**
```
sudo metricbeat modules enable docker
```

**Subir os templates de Dashboard pro Kibana e Inicializar o Serviço**
```
sudo metricbeat setup
sudo service metricbeat start
```
Na imagem abaixo temos um exemplo do que é coletado no Metricbeats no Dashboard que ele já configura pra vc!
![Slide2](https://github.com/AnselmoBorges/zerotohero/blob/master/imagens/systemmetrics.png)

Podemos ver o Dashboard de Docker também com os cointainers e outras infos.
![Slide6](https://github.com/AnselmoBorges/zerotohero/blob/master/imagens/metricdocker.png)

## Usando o Filebeats para coletar logs de S.O e alimentar dados para outras ferramentas:
Agora vamos instalar o Filebeat, uma ferramenta que coleta logs dos mais diversos, Sistema Operacional, Apache, MySQL, Postgres, Kafka e muitos outros, é uma ferramenta perfeita para monitorarmos atividades dos serviços, realizarmos troubleshootings e detectarmos anomalias em combinado com as funções de Machine Learning do próprio Elastic.

Nesse exemplo, vamos realizar a instalação do Filebeat nesse server criado no GPC monitorando alguns logs importantes do S.O:

Rodamos os comandos abaixo para instalação do mesmo
```
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.6.1-x86_64.rpm
sudo rpm -vi filebeat-7.6.1-x86_64.rpm
```
**Como já esta configurado para a própria maquina (localhost) só iniciamos os serviços:**
```
sudo filebeat modules enable system
sudo filebeat setup
sudo service filebeat start
```
Com o Filebeat instalado, podemos ver no dashboards alguns logs, logins SSH, utilizações de sudo.
![Slide3](https://github.com/AnselmoBorges/zerotohero/blob/master/imagens/filebeat.png)

Mas para maiores informações de segurança apresento-lhes o **Auditbeat**.

## Instalando o Auditbeat:
O Auditbeat é a ferramenta principal que coleta atividades para o SIEM, que é uma ferramenta de segurança poderosissima que coleta logins indevidos, atividades inseguras e outras possibilidades.

```
curl -L -O https://artifacts.elastic.co/downloads/beats/auditbeat/auditbeat-7.6.1-x86_64.rpm
sudo rpm -vi auditbeat-7.6.1-x86_64.rpm
```

Do mesmo modo que os anteriores, a configuração está como localhost, então não vamos precisar editar os arquivos de configuração, só subir os serviços:
```
sudo auditbeat setup
sudo service auditbeat start
```
Na imagem podemos ter uma ideia da monitoração.

![Slide4](https://github.com/AnselmoBorges/zerotohero/blob/master/imagens/SIEM.png)

## Instalando HTTPD e Monitorando métricas e logs do Apache
**Instalando o Apache (HTTPD) e Verificando o Monitoramento Padrão http://seuipexterno/server-status**
```
sudo yum install httpd -y 
```
**Inicializando o Serviço do Apache**
```
sudo service httpd start
```

**(CURIOSIDADE) server-status do Apache - Adicionar no arquivo httpd.conf o seguinte trecho**
```
sudo vim /etc/httpd/conf/httpd.conf

<Location /server-status>
    SetHandler server-status
    Allow from SEUIP
</Location>
```
**Graceful no Serviço do Apache**
```
service httpd graceful
```

**Habilitando Modulo do Apache no Metricbeat**
```
sudo metricbeat modules enable apache
```

**Reiniciar Serviço do Metricbeat**
```
sudo metricbeat restart
```

Para você que perdeu algo da live e precisa ver como foi feito, segue um video abaixo que explica (clique na imagem):

[![](https://github.com/AnselmoBorges/zerotohero/blob/master/imagens/beats.jpg)](https://youtu.be/2wFSbVGGS4w "Instalação dos Beats")

## Laboratório de APM

**Clonar o repositorio do .git da aplicação modelo para a home do seu usuário**

```
cd ~
git clone https://github.com/techlipe/cm.git
```

**Instalar o pacote NPM e NodeJS no servidor**

```
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum install nodejs
```

**Instalar as dependências das aplicações**
```
cd ~/cm
npm install
```

Obs: Ao instalar as dependências já estamos instalando o agente do APM da Elastic na aplicaçao através da depndência abaixo:
```
"elastic-apm-node": "^3.5.0"
```

A inicialização está inserida no arquivo 'index.js' e deve vir antes da inicialização de todos os outros componentes da aplicação (ex: express)

Abaixo o trecho do código para fins didáticos. 
```
var apm = require('elastic-apm-node').start({
    serviceName: 'cm-back',

    secretToken: '',

    serverUrl: 'http://localhost:8200/'
  });
```

**Instalar e iniciar o MongoDB via dockercompose (Docker e docker compose foram instalados no lab do dia 01)**
```
cd ~/cm
sudo docker-compose up -d
```

**[OPCIONAL] Habilitar o modulo do mongodb no metricbeat** 
```
sudo metricbeat modules enable mongodb
sudo service metricbeat restart
```

**Validar inicalização do mongodb**
```
sudo netstat -anp | grep 27017
tcp6       0      0 :::27017                :::*                    LISTEN      pid/docker-proxy- 
```

**Baixar e instalar o APM Server **

```
cd ~
curl -L  -O https://artifacts.elastic.co/downloads/apm-server/apm-server-7.6.2-x86_64.rpm
sudo rpm -iv apm-server-7.6.2-x86_64.rpm
```

**Iniciar o serviço e aplicação**

Vamos agora inicializar o APM server com as configurações padrões e também a nossa aplicação NODEJS
```
sudo service apm-server start
cd cm
npm start
```

**Realizar consultas na aplicação**

Realizar consultas e inserções em:

```
http://seuip:3000
```

**Acessar o menu de APM na console do Kibana e verificar a nossa aplicação sendo monitorada!**

**Overview da Aplicação**

![](apm-menu.JPG)

**Transações**

![](apm-requisicoes.JPG)
