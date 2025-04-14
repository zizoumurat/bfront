#!/bin/bash

apt-get update

cd BuyerSoft
npm install --force
npm install -g @angular/cli
ng build --configuration=production