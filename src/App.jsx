// src/App.jsx
import React, { useState, useMemo } from 'react';
import './App.css';
import Logo from './component/Logo';

// --- DADOS DOS PARTICIPANTES ---
const DADOS_PARTICIPANTES = [
  { id: 1, nome: "Ana Silva",    imagem: "/img/pessoa1.jpg" },
  { id: 2, nome: "Bruno Costa",  imagem: "/img/pessoa2.jpg" },
  { id: 3, nome: "Carla Dias",   imagem: "/img/pessoa2.jpg" },
  { id: 4, nome: "Daniel Matos", imagem: "/img/pessoa2.jpg" },
  { id: 5, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 6, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 7, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 8, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 9, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 10, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 11, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 12, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 13, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 14, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 15, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 16, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 17, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg" },
  { id: 18, nome: "Eduarda Lima", imagem: "/img/pessoa2.jpg"},
  { id: 19, nome: "Eduarda Lima", imagem: "/img/Sorte.png"},
  { id: 20, nome: "Sorte Grande", imagem: "/img/Sorte.png" }, // O nosso vencedor forçado
  // ... pode adicionar mais participantes aqui
];

// --- VENCEDOR FORÇADO (ESCOLHA O ID) ---
// É aqui que definimos o ID do participante que queremos que ganhe.
const FORCED_WINNER_ID = 20
// --- O COMPONENTE PRINCIPAL ---
function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [transformStyle, setTransformStyle] = useState({ transform: 'translateX(0px)', transition: 'none' });
  const [winner, setWinner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinCount, setSpinCount] = useState(0); // Contador de sorteios

  const IMAGE_WIDTH = 200;

  const carrosselItems = useMemo(() => {
    return [...DADOS_PARTICIPANTES, ...DADOS_PARTICIPANTES, ...DADOS_PARTICIPANTES];
  }, []);

  // --- FUNÇÃO DE SORTEIO MODIFICADA ---
  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setSpinCount(currentCount => currentCount + 1);

    let winnerIndex;

    // A LÓGICA DA "BATOTA" ACONTECE AQUI:
    // Verificamos se já fizemos menos de 2 sorteios.
    // spinCount é 0 no primeiro clique, e 1 no segundo.
    if (spinCount < 2) {
      console.log(`Sorteio N.º ${spinCount + 1}: A FORÇAR o resultado para o ID ${FORCED_WINNER_ID}!`);
      
      const forcedIndex = DADOS_PARTICIPANTES.findIndex(p => p.id === FORCED_WINNER_ID);
      
      // Se o ID forçado for encontrado, usamos o seu índice. Senão, fazemos um sorteio normal para não dar erro.
      winnerIndex = (forcedIndex !== -1) ? forcedIndex : Math.floor(Math.random() * DADOS_PARTICIPANTES.length);
    } else {
      console.log(`Sorteio N.º ${spinCount + 1}: Sorteio ALEATÓRIO!`);
      winnerIndex = Math.floor(Math.random() * DADOS_PARTICIPANTES.length);
    }
    
    const apostaVencedora = DADOS_PARTICIPANTES[winnerIndex];
    setWinner(apostaVencedora);

    // O resto da lógica da animação continua igual
    const offsetInicial = DADOS_PARTICIPANTES.length * IMAGE_WIDTH;
    const posicaoVencedor = offsetInicial + (winnerIndex * IMAGE_WIDTH);
    const correcaoDeCentralizacao = (600 / 2) - (IMAGE_WIDTH / 2);
    const voltasExtras = DADOS_PARTICIPANTES.length * IMAGE_WIDTH;
    const posicaoFinal = posicaoVencedor - correcaoDeCentralizacao + voltasExtras;
    setTransformStyle({
      transition: 'none',
      transform: `translateX(-${offsetInicial}px)`
    });
    setTimeout(() => {
      setTransformStyle({
        transition: 'transform 6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        transform: `translateX(-${posicaoFinal}px)`
      });
    }, 50);
  };
  
  const handleTransitionEnd = () => {
    setIsSpinning(false);
    if (winner) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <Logo />
      <div className="ponteiro"></div>
      <div className="sorteador-container">
        <div 
          className="carrossel"
          style={transformStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {carrosselItems.map((participante, index) => (
            <div className="participante" key={index}>
              <img src={participante.imagem} alt={participante.nome || 'Prémio da Sorte'} />
            </div>
          ))}
        </div>
      </div>

      <button 
        className="botao-sortear" 
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? 'A sortear...' : 'Sortear!'}
      </button>

      {isModalOpen && winner && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Temos um Vencedor!</h2>
            <img 
              src={winner.imagem} 
              alt={winner.nome || 'Prémio da Sorte'} 
              className="winner-image"
            />
            <h3>{winner.nome || 'Sorte Grande!'}</h3>
            <button onClick={handleCloseModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

