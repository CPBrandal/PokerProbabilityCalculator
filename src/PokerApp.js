import React, { useState } from 'react';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const generateCardOptions = () => {
    return values.flatMap(value => suits.map(suit => ({ value, suit })));
};

const getCardImagePath = (card) => {
    if (!card) return null;
    return `PNG-cards-1.3/${card.value} of ${card.suit}.png`;
};

const PokerApp = () => {
    const [hand, setHand] = useState([null, null]);
    const [tableCards, setTableCards] = useState(Array(5).fill(null));
    const [selectedSlot, setSelectedSlot] = useState({ type: null, index: null });
    const [availableCards, setAvailableCards] = useState(generateCardOptions());
    const [probability, setProbability] = useState(0);
    const [selectedSuit, setSelectedSuit] = useState('none');
    const [selectedValue, setSelectedValue] = useState('none');

    const handleSlotClick = (type, index) => {
        setSelectedSlot({ type, index });
    };

    const handleCardSelection = (card) => {
        if (selectedSlot.type === 'hand') {
            const newHand = [...hand];
            newHand[selectedSlot.index] = card;
            setHand(newHand);
        } else if (selectedSlot.type === 'table') {
            const newTableCards = [...tableCards];
            newTableCards[selectedSlot.index] = card;
            setTableCards(newTableCards);
        }

        setAvailableCards(prevCards => prevCards.filter(c => !(c.value === card.value && c.suit === card.suit)));
        setSelectedSlot({ type: null, index: null }); // Clear the selected slot
    };

    const handleCardRemoval = (type, index) => {
        let removedCard;
        if (type === 'hand') {
            const newHand = [...hand];
            removedCard = newHand[index];
            newHand[index] = null;
            setHand(newHand);
        } else if (type === 'table') {
            const newTableCards = [...tableCards];
            removedCard = newTableCards[index];
            newTableCards[index] = null;
            setTableCards(newTableCards);
        }

        // Add the removed card back to the available cards
        if (removedCard) {
            setAvailableCards(prevCards => [...prevCards, removedCard]);
        }
    };

    const calculateProbability = () => {
        if (selectedSuit === 'none' && selectedValue === 'none') {
            setProbability(0);
            return;
        }
        const remainingCards = availableCards.length;
        if(selectedValue === 'none'){
            const suitCount = availableCards.filter(card => card.suit === selectedSuit).length;
            const probability = suitCount / remainingCards;
            setProbability(probability);
            return;
        }
        if(selectedSuit === 'none'){
            const suitCount = availableCards.filter(card => card.value === selectedValue).length;
            const probability = suitCount / remainingCards;
            setProbability(probability);
            return;
        }
        const suitCount = availableCards.filter(card => (card.value === selectedValue) || card.suit === selectedSuit).length;
        const probability = suitCount / remainingCards;
        setProbability(probability);
    };

    const getSlotLabel = (index) => {
        if (index < 3) return 'Flop';
        if (index === 3) return 'Turn';
        if (index === 4) return 'River';
        return 'Empty';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h2>Table Cards:</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {tableCards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleSlotClick('table', index)}
                            style={{
                                width: '100px',
                                height: '140px',
                                border: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: selectedSlot.type === 'table' && selectedSlot.index === index ? '#e0e0e0' : 'white',
                                position: 'relative',
                            }}
                        >
                            {card ? (
                                <>
                                    <img 
                                        src={process.env.PUBLIC_URL + '/' + getCardImagePath(card)} 
                                        alt={`${card.value} of ${card.suit}`}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering slot selection
                                            handleCardRemoval('table', index);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            display: card ? 'block' : 'none',
                                        }}
                                    >
                                        X
                                    </button>
                                </>
                            ) : (
                                getSlotLabel(index) // Display names
                            )}
                        </div>
                    ))}
                </div>

                <h2>Hand:</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {hand.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleSlotClick('hand', index)}
                            style={{
                                width: '100px',
                                height: '140px',
                                border: '1px solid #ccc',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor: selectedSlot.type === 'hand' && selectedSlot.index === index ? '#e0e0e0' : 'white',
                                position: 'relative',
                            }}
                        >
                            {card ? (
                                <>
                                    <img 
                                        src={process.env.PUBLIC_URL + '/' + getCardImagePath(card)} 
                                        alt={`${card.value} of ${card.suit}`}
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering slot selection
                                            handleCardRemoval('hand', index);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                            display: card ? 'block' : 'none',
                                        }}
                                    >
                                        X
                                    </button>
                                </>
                            ) : (
                                'Empty'
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="suitSelect">Choose a suit: </label>
                    <select 
                        id="suitSelect" 
                        value={selectedSuit} 
                        onChange={(e) => setSelectedSuit(e.target.value)}
                    >
                        <option value="none">None</option>
                        {suits.map((suit, index) => (
                            <option key={index} value={suit}>{suit}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <label htmlFor="valueSelect">Choose a value: </label>
                    <select 
                        id="valueSelect" 
                        value={selectedValue} 
                        onChange={(e) => setSelectedValue(e.target.value)}
                    >
                        <option value="none">None</option>
                        {values.map((value, index) => (
                            <option key={index} value={value}>{value}</option>
                        ))}
                    </select>
                </div>

                <button onClick={calculateProbability} style={{ marginTop: '20px' }}>Calculate Probability</button>

                {(selectedSuit !== 'none' || selectedValue !== 'none') && (
                    <div style={{ marginTop: '10px' }}>
                        {selectedSuit !== 'none' && selectedValue !== 'none' && (
                            <>Probability of next card being {selectedSuit} or {selectedValue}'s: {probability.toFixed(3)}</>
                        )}
                        {selectedSuit !== 'none' && selectedValue === 'none' && (
                            <>Probability of next card being {selectedSuit}: {probability.toFixed(3)}</>
                        )}
                        {selectedSuit === 'none' && selectedValue !== 'none' && (
                            <>Probability of next card being {selectedValue}: {probability.toFixed(3)}</>
                        )}
                    </div>
                )}


            </div>

            {/* Deck as a 13x4 Grid */}
            <div>
                <h2>Deck:</h2>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(13, 1fr)', 
                    gap: '10px',
                    maxWidth: '90vw',
                    overflowX: 'auto'
                }}>
                    {availableCards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => selectedSlot.type && handleCardSelection(card)}
                            style={{
                                cursor: selectedSlot.type ? 'pointer' : 'not-allowed',
                                border: '1px solid #ccc',
                                padding: '5px',
                                textAlign: 'center',
                                backgroundColor: selectedSlot.type ? '#f0f0f0' : 'white',
                                opacity: selectedSlot.type ? 1 : 0.5,
                            }}
                        >
                            <img 
                                src={process.env.PUBLIC_URL + '/' + getCardImagePath(card)} 
                                alt={`${card.value} of ${card.suit}`}
                                style={{ width: '60px', height: 'auto' }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PokerApp;
