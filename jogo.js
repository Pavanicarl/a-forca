let jogo, palavras;

palavras = {
  facil: ['sutil', 'desde', 'inato', 'audaz', 'vigor', 'chegar', 'facil', 'legal', 'chute', 'bacana', 'flor', 'azul', 'paz'],
  medio: ['refutar', 'alusão', 'cordial', 'ênfase', 'naruto', 'brilhar', 'parceria', 'rodeio'],
  dificil: ['modesto', 'misoginia', 'empirismo', 'impetuoso', 'rechaçar', 'depravado', 'sortear', 'arruaça']
};

function limpar() {
  jogo = {
    dificuldade: undefined,
    palavra: undefined,
    palavraSemAcentos: undefined,
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function(palavraSorteada) {
      this.palavra = palavraSorteada;
      this.acertos = '';
      this.palavraSemAcentos = this.palavra
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      for (let i = 0; i < jogo.palavra.length; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function(letraJogada){
      let acertou = false;
      this.jogadas.push(letraJogada);
      for(let i = 0; i<this.palavraSemAcentos.length; i++){
        const letra = this.palavraSemAcentos[i];
        if(letra==letraJogada.toLowerCase()){
          acertou=true;
          this.acertos = replace(this.acertos, i, this.palavra[i]);
        }
      }
      if(!acertou){
        this.chances--;
      }
      return acertou;
    },
    ganhou: function(){
      return this.palavraSemAcentos === this.acertos;
    },
    perdeu: function(){
      return this.chances <= 0;
    },
    acabou: function(){
      return this.ganhou() || this.perdeu();
    }
  };

  document.querySelector('#inicial').style.display = 'flex';
  document.querySelector('#jogo').style.display = 'none';
  document.querySelector('.mensagem').style.display = 'none';

  document
    .querySelector('.enforcado-braco-esquerdo')
    .classList.add('escondido');
  document.querySelector('.enforcado-braco-direito').classList.add('escondido');
  document
    .querySelector('.enforcado-perna-esquerda')
    .classList.add('escondido');
  document.querySelector('.enforcado-perna-direita').classList.add('escondido');
  document.querySelector('.enforcado-corpo').classList.add('escondido');
  document.querySelector('.enforcado-cabeca').classList.add('escondido');

  criarTeclado();
}

function iniciarJogo(dificuldade) {
  jogo.dificuldade = dificuldade;
  document.querySelector('#inicial').style.display = 'none';
  document.querySelector('#jogo').style.display = 'flex';

  sortearPalavra();
  mostrarPalavra();
}

function sortearPalavra() {
  const tamanho = palavras[jogo.dificuldade].length;
  const i = Math.floor(Math.random() * tamanho);
  const palavraSorteada = palavras[jogo.dificuldade][i];
  jogo.definirPalavra(palavraSorteada);
  return jogo.palavra;
}

function mostrarPalavra() {
  const palavraDOM = document.querySelector('.palavra');
  palavraDOM.textContent = '';
  const palavraMostrar = jogo.acertos.toUpperCase();
  for (const letra of palavraMostrar) {
    palavraDOM.innerHTML += `<div class="letra-${letra}">${letra}</div>`;
  }
}

function criarTeclado() {
  const letras = 'abcdefghijklmnopqrstuvwxyz';
  const tecladoDOM = document.querySelector('.teclado');
  tecladoDOM.textContent = '';
  for (const letra of letras) {

    const button = document.createElement('button');
    const textNode = document.createTextNode(letra.toUpperCase());
    button.appendChild(textNode);
    button.classList.add(`botao-${letra}`);
    tecladoDOM.appendChild(button);
    button.addEventListener('click', function(e) {
      jogar(letra, button);
    });
  }
}

function jogar(letra, button){
  if(!jogo.jogadas.includes(letra) && !jogo.acabou()){
    const acertou = jogo.jogar(letra);
    button.classList.add(acertou ? 'certo' : 'errado');
    if(!acertou){
      enforcar();
    }
    mostrarPalavra();
    if(jogo.ganhou()){
      mostrarMensagem(true);
    }else if(jogo.perdeu()){
      mostrarMensagem(false);
    }
  }
}

function mostrarMensagem(vitoria){
  const mensagem = vitoria 
  ? '<p>Parabéns!</p><p>Acertou</p>' 
  : '<p>Você</p><p>Perdeu!</p>';
  const caixaDOM = document.querySelector('.mensagem');
  const textoDOM = caixaDOM.querySelector('.texto');
  textoDOM.innerHTML = mensagem;
  caixaDOM.style.display = 'flex';
  caixaDOM.classList.remove('mensagem-vitoria');
  caixaDOM.classList.remove('mensagem-derrota');
  caixaDOM.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);
}

function enforcar(){
  const pecas = ['perna-direita', 'perna-esquerda', 'braco-direito', 'braco-esquerdo', 'corpo', 'cabeca']
  const pecaDOM = document.querySelector(`.enforcado-${pecas[jogo.chances]}`);
  pecaDOM.classList.remove('escondido');
}

function replace(str, i, newChar){
  return str.substring(0,i) + newChar + str.substring(i + 1);
}

document.querySelector('.botao-facil').addEventListener('click', function() {
  iniciarJogo('facil');
});

document.querySelector('.botao-medio').addEventListener('click', function() {
  iniciarJogo('medio');
});

document.querySelector('.botao-dificil').addEventListener('click', function() {
  iniciarJogo('dificil');
});

document.querySelector('.reiniciar').addEventListener('click', limpar);

limpar();