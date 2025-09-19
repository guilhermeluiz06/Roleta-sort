// src/App.jsx
import React, { useState, useMemo } from 'react';
import './App.css'; // Importa nosso CSS

// --- DADOS DOS PARTICIPANTES ---
// Coloque os dados das suas pessoas aqui.
// O caminho da imagem começa com /img/ porque elas estão na pasta `public/img`
const DADOS_PARTICIPANTES = [
  { id: 1, nome: "Ana Silva",    imagem: "/img/pessoa1.jpg" },
  { id: 2, nome: "Bruno Costa",  imagem: "/img/pessoa2.jpg" },
  { id: 3, nome: "Carla Dias",   imagem: "/img/pessoa3.jpg" },
  { id: 4, nome: "Daniel Matos", imagem: "/img/pessoa4.jpg" },
  { id: 5, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 6, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 7, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 8, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 9, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 10, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 11, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 12, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 13, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 14, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 15, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 16, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 17, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 18, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 19, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },
  { id: 20, nome: "Eduarda Lima", imagem: "/img/pessoa5.jpg" },  
];

// --- O COMPONENTE PRINCIPAL ---
function App() {
  // --- ESTADO (STATE) ---
  // Variáveis que, quando mudam, fazem o componente re-renderizar
  const [isSpinning, setIsSpinning] = useState(false);
  const [transformStyle, setTransformStyle] = useState({ transform: 'translateX(0px)', transition: 'none' });
  const [winner, setWinner] = useState(null);

  const IMAGE_WIDTH = 200; // Largura de cada imagem em pixels

  // Para o efeito de "loop infinito", triplicamos a lista de participantes
  // useMemo evita que este cálculo pesado seja refeito a cada renderização
  const carrosselItems = useMemo(() => {
    return [...DADOS_PARTICIPANTES, ...DADOS_PARTICIPANTES, ...DADOS_PARTICIPANTES];
  }, []);

  // --- FUNÇÕES DE EVENTO ---
  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // 1. Sorteia o vencedor
    const winnerIndex = Math.floor(Math.random() * DADOS_PARTICIPANTES.length);
    const apostaVencedora = DADOS_PARTICIPANTES[winnerIndex];
    setWinner(apostaVencedora);

    // 2. Calcula a posição final
    const offsetInicial = DADOS_PARTICIPANTES.length * IMAGE_WIDTH;
    const posicaoVencedor = offsetInicial + (winnerIndex * IMAGE_WIDTH);
    const correcaoDeCentralizacao = (600 / 2) - (IMAGE_WIDTH / 2); // 600 é a largura do container
    const voltasExtras = DADOS_PARTICIPANTES.length * IMAGE_WIDTH;
    const posicaoFinal = posicaoVencedor - correcaoDeCentralizacao + voltasExtras;
    
    // 3. Reinicia a posição e aplica a nova transição
    // Primeiro, um reset rápido sem animação
    setTransformStyle({
      transition: 'none',
      transform: `translateX(-${offsetInicial}px)`
    });

    // Usamos setTimeout para garantir que o reset seja aplicado antes da animação começar
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
      // Usamos setTimeout para o alerta não bloquear a última renderização
      setTimeout(() => alert(`O vencedor é: ${winner.nome}!`), 10);
    }
  };

  // --- RENDERIZAÇÃO (O que aparece na tela) ---
  return (
    <div className="app-container">
      <div className="ponteiro"></div>

      <div className="sorteador-container">
        <div 
          className="carrossel"
          style={transformStyle} // O estilo é controlado pelo nosso estado
          onTransitionEnd={handleTransitionEnd} // Evento de fim da transição
        >
          {/* Mapeamos a lista de itens para criar os elementos de imagem */}
          {carrosselItems.map((participante, index) => (
            <div className="participante" key={index}>
              <img src={participante.imagem} alt={participante.nome} />
            </div>
          ))}
        </div>
      </div>

      <button 
        className="botao-sortear" 
        onClick={handleSpin} // Evento de clique
        disabled={isSpinning} // Desabilita o botão enquanto gira
      >
        {isSpinning ? 'Sorteando...' : 'Sortear!'}
      </button>
    </div>
  );
}

export default App;