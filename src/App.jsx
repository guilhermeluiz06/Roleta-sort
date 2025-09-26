import React, { useState, useMemo } from 'react';
import './App.css';
import Logo from './component/Logo';

// --- DADOS DOS PARTICIPANTES ---
const DADOS_PARTICIPANTES = [
    { id: 1, nome: "Ester Horrany", imagem: "/img/ester.jpg" },
    { id: 2, nome: "Eduardo Euzébio", imagem: "/img/eduardo.jpg" },
    { id: 3, nome: "Leticia da Silva", imagem: "/img/leticia.jpg" },
    { id: 4, nome: "Fernando Roberto", imagem: "/img/fernando.jpg" },
    { id: 5, nome: "Marisa Leal", imagem: "/img/marisa.jpg" },
    { id: 6, nome: "Ewelly Santos", imagem: "/img/ewelly.jpg" },
    { id: 7, nome: "Pedrus", imagem: "/img/petrus.jpg" },
    { id: 8, nome: "Parabéns RH", imagem: "/img/RH.png" },
    { id: 9, nome: "Natalie Rego", imagem: "/img/natalie.jpg" },
    { id: 10, nome: "Yuliane Banegas", imagem: "/img/yuliane.jpg" },
    { id: 11, nome: "Karolaynne Rayssa", imagem: "/img/karolaynne rayssa.jpg" },
    { id: 12, nome: "Joao Marcelo", imagem: "/img/joao marcelo.jpg" },
    { id: 13, nome: "Efraim Ferreira", imagem: "/img/efraim ferreira.jpg" },
    { id: 14, nome: "Mais Sorte na Próxima Vez", imagem: "/img/Sorte.png" },
    { id: 15, nome: "Manuela Viana", imagem: "/img/pessoa2.jpg" },
    { id: 16, nome: "Marisa Leal", imagem: "/img/pessoa2.jpg" },
    { id: 17, nome: "Matheus Rodrigues", imagem: "/img/pessoa2.jpg" },
    { id: 18, nome: "Natalie Rego", imagem: "/img/pessoa2.jpg" },
    { id: 19, nome: "Thaina Carolline", imagem: "/img/pessoa2.jpg" },
    { id: 20, nome: "Yuliany Banegas", imagem: "/img/pessoa2.jpg" },
    { id: 21, nome: "Mais Sorte na Próxima Vez", imagem: "/img/Sorte.png" }, // O nosso vencedor forçado
    // ... pode adicionar mais participantes aqui
];

// --- VENCEDORES FORÇADOS (ESCOLHA OS IDs) ---
// Define a lista de IDs que devem ser sorteados nas 3 primeiras vezes.
// O ideal é escolher IDs de participantes que realmente existam nos DADOS_PARTICIPANTES.
const FORCED_WINNER_IDS = [21, 14, 8];

// --- O COMPONENTE PRINCIPAL ---
function App() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [transformStyle, setTransformStyle] = useState({ transform: 'translateX(0px)', transition: 'none' });
    const [winner, setWinner] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Usa o useState para gerenciar a lista de IDs que ainda precisam ser sorteados.
    const [remainingForcedWinners, setRemainingForcedWinners] = useState([...FORCED_WINNER_IDS]);

    // Modificado de 200 para 300 para o novo tamanho das imagens
    const IMAGE_WIDTH = 300;

    const carrosselItems = useMemo(() => {
        return [...DADOS_PARTICIPANTES, ...DADOS_PARTICIPANTES, ...DADOS_PARTICIPANTES];
    }, []);

    // --- FUNÇÃO DE SORTEIO MODIFICADA ---
    const handleSpin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setWinner(null);

        let winnerIndex;
        // A LÓGICA DA "BATOTA" ACONTECE AQUI:
        // Se ainda houver IDs na lista de vencedores forçados, usamos o primeiro.
        if (remainingForcedWinners.length > 0) {
            const nextForcedWinnerId = remainingForcedWinners[0];
            console.log(`Sorteio forçado: o próximo ganhador é o ID ${nextForcedWinnerId}`);

            const forcedIndex = DADOS_PARTICIPANTES.findIndex(p => p.id === nextForcedWinnerId);

            // Se o ID forçado for encontrado, usamos o seu índice.
            winnerIndex = (forcedIndex !== -1) ? forcedIndex : Math.floor(Math.random() * DADOS_PARTICIPANTES.length);

            // Remove o ID da lista para que ele não seja sorteado novamente.
            setRemainingForcedWinners(currentWinners => currentWinners.slice(1));
        } else {
            // Se a lista estiver vazia, faz um sorteio aleatório normal.
            console.log('Sorteio aleatório!');
            winnerIndex = Math.floor(Math.random() * DADOS_PARTICIPANTES.length);
        }

        const apostaVencedora = DADOS_PARTICIPANTES[winnerIndex];
        setWinner(apostaVencedora);

        // O resto da lógica da animação continua igual
        const offsetInicial = DADOS_PARTICIPANTES.length * IMAGE_WIDTH;
        const posicaoVencedor = offsetInicial + (winnerIndex * IMAGE_WIDTH);
        // Modificado de 600 para 900 para o novo tamanho do contêiner da roleta
        const correcaoDeCentralizacao = (900 / 2) - (IMAGE_WIDTH / 2);
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
