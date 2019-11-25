FROM node:10

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apt-get update

RUN apt-get -yq install python-pip

RUN pip install awscli

RUN npm install -g serverless

RUN npm install -g knex

RUN npm install -g mocha

RUN npm install -g typescript@3.6

RUN npm install -g ts-node

RUN npm install -g mocha-simple-html-reporter

WORKDIR /vatr/task

EXPOSE 3000




