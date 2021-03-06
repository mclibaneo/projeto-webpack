import { NegociacaoController } from './controllers/NegociacaoController.js';
import { Negociacao } from './domain/index.js';
import 'bootstrap/dist/css/bootstrap.css'; //procura direto direto dentro da pasta modules
import 'bootstrap/dist/css/bootstrap-theme.css'; //npm le o css como um module
import 'bootstrap/js/modal.js'; //para uso do modal pelo bootstrap
import '../css/meu-css.css'; //'../' indica para ler na pasta do diretorio raiz

const controller = new NegociacaoController();
const negociacao = new Negociacao(new Date(), 1, 200);
const headers = new Headers();
headers.set('Content-Type', 'application/json');
const body = JSON.stringify(negociacao);
const method = 'POST';
const config = { 
    method,
    headers,
    body 
};

fetch(`${SERVICE_URL}/negociacoes`, config)
    .then(() => console.log('Dado enviado com sucesso'));