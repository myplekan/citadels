import { ChooseCharacter } from "../ChooseCharacter/ChooseCharacter";

import charactersData from "../../characters.json";
import cardsData from "../../cards.json";
import "./HomePage.css";
import { Card } from "../../types/card";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import React, { useEffect, useState } from "react";
import { actions } from "../../features/personsSlice";
import { PlayerArea } from "../PlayerArea/PlayerArea";
import { PlayerField } from "../PlayerField/PlayerField";
import classNames from "classnames";
import { Person } from "../../types/Person";

export const HomePage = React.memo(() => {
  const [chooseChar, setChooseChar] = useState(false);
  const [roundStart, setRoundStart] = useState(false);
  const [whoNeedPickIndex, setWhoNeedPickIndex] = useState(0);
  const [isTwoCards, setIsTwoCards] = useState(false);
  const [cardOne, setCardOne] = useState<Card | null>(null);
  const [cardTwo, setCardTwo] = useState<Card | null>(null);
  const [startGame, setStartGame] = useState(false);
  const [deck, setDeck] = useState<Card[]>(cardsData.cards);

  const [altValues, setAltValues] = useState<string[]>([]);
  const [king, setKing] = useState<Person | null>(null);
  const [killed, setKilled] = useState("");

  const dispatch = useAppDispatch();
  const persons = useAppSelector((state) => state.persons);

  useEffect(() => {
    setKing(persons[0]);
  }, []);

  let whoNeedPick = [...persons].sort((a, b) => {
    if (a.character.moveQueue !== null && b.character.moveQueue !== null) {
      return a.character.moveQueue - b.character.moveQueue;
    }

    return +a.id - +b.id;
  });

  if (killed) {
    whoNeedPick = [...persons].filter(who => who.character.name !== killed).sort((a, b) => {
      if (a.character.moveQueue !== null && b.character.moveQueue !== null) {
        return a.character.moveQueue - b.character.moveQueue;
      }

      return +a.id - +b.id;
    });
  }

  const getRandomCard = (): Card => {
    const randomNum = getRandomNumber();
    const foundCard = deck.find((item) => +item.id === randomNum);
    console.log(foundCard?.id);
    if (!foundCard) {
      return getRandomCard();
    } else {
      setDeck((prevDeck) =>
        prevDeck.filter((item) => item.id !== foundCard.id)
      );
      return foundCard;
    }
  };

  const num: number[] = [];

  const getRandomNumber = () => {
    const min = 1;
    const max = 61;
    let randomNum: number;

    while (true) {
      randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

      if (!num.includes(randomNum)) {
        num.push(randomNum);
        break;
      }
    }

    return randomNum;
  };

  const handleStartGame = () => {
    setStartGame(true);

    for (let i = 0; i < persons.length; i++) {
      dispatch(actions.addCoin({ id: i.toString(), coin: 2 }));
      for (let k = 0; k < 4; k++) {
        const card = getRandomCard();

        if (card) {
          const item = {
            id: i.toString(),
            card: card,
          };

          dispatch(actions.addCard(item));
        }
      }
    }
  };

  const handleChooseCharacter = () => {
    setChooseChar(true);
    setWhoNeedPickIndex(0);
    setKilled('');
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.body.style.overflowY = "hidden";

    // const containers = document.querySelectorAll<HTMLImageElement>(
    //   ".player-area__person-image"
    // );

    // setAltValues(() =>
    //   Array.from(containers).map((container) => container.alt)
    // );

    if (king) {
      const result = [...persons]
        .slice(+king.id, persons.length)
        .map((person) => person.name);
      setAltValues(
        result.concat(
          [...persons].slice(0, +king.id).map((person) => person.name)
        )
      );
    }
  };

  const handleRoundMove = (type: string, person?: Person, card?: Card | null) => {
    // console.log(person?.character.type, person)
    // if (person?.character.type !== 'none' && person) {
    //   let countCoin = person.builds.filter(build => build.type === person.character.type);
    //   dispatch(actions.addCoin({id: person.id, coin: countCoin.length}))
    // }
    setRoundStart(false);
    if (type === "coin") {
      dispatch(
        actions.addCoin({ id: whoNeedPick[whoNeedPickIndex].id, coin: 2 })
      );
    }
    if (type === "card") {
      if (card) {
        dispatch(
          actions.addCard({ id: whoNeedPick[whoNeedPickIndex].id, card })
        );
        setDeck(() => [...deck].filter((item) => item.id !== card.id));
        setIsTwoCards(false);
      }
    }
    if (whoNeedPick.length > whoNeedPickIndex) {
      setWhoNeedPickIndex(whoNeedPickIndex + 1);
    }
  };

  return (
    <>
      {chooseChar && (
        <ChooseCharacter
          setKing={setKing}
          altValues={altValues}
          setChooseChar={setChooseChar}
          chooseChar={chooseChar}
        />
      )}

      <div>
        <div className="board">
          <div className="character-cards">
            {charactersData.characters.map((character) => (
              <div
                key={character.id}
                className={classNames(
                  "character-card"
                  // "character-card--active"
                )}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/characters/${character.miniPhoto}`}
                  className={classNames("character-card__image")}
                  alt={character.name}
                />
              </div>
            ))}
          </div>

          <div className="players-area__container">
            {persons.map((person, index) => {
              return (
                <PlayerArea
                  key={person.id}
                  number={index + 1}
                  person={person}
                />
              );
            })}
          </div>
        </div>

        <div className="buttons">
          <button
            className="button"
            onClick={() => handleStartGame()}
            disabled={startGame}
          >
            Старт гри
          </button>
          <button
            className="button"
            onClick={() => handleChooseCharacter()}
            disabled={!startGame}
          >
            Вибір персонажів
          </button>
          <button
            className="button"
            onClick={() => setRoundStart(true)}
            disabled={whoNeedPickIndex === whoNeedPick.length || !startGame}
          >
            Розпочати хід
          </button>
        </div>

        {roundStart && (
          <>
            <div className="round-start">
              {`Ходить ${whoNeedPick[whoNeedPickIndex].name}`}
              <span>Потрібно вибрати 2 золота чи одну карту з 2</span>

              <div className="round-start__choose">
                {isTwoCards ? (
                  <>
                    <div className="round-start__choose-item">
                      <img
                        className="round-start__choose-img"
                        src={`/images${cardOne?.photo}`}
                        alt="Card one"
                        onClick={() => handleRoundMove("card", whoNeedPick[whoNeedPickIndex], cardOne)}
                      />
                    </div>
                    <div className="round-start__choose-item">
                      <img
                        className="round-start__choose-img"
                        src={`/images${cardTwo?.photo}`}
                        alt="Card two"
                        onClick={() => handleRoundMove("card", whoNeedPick[whoNeedPickIndex], cardTwo)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="round-start__choose-item"
                      onClick={() => handleRoundMove("coin")}
                    >
                      2 золота
                    </div>

                    <div
                      className="round-start__choose-item"
                      onClick={() => {
                        setIsTwoCards(true);
                        setCardOne(() => getRandomCard());
                        setCardTwo(() => getRandomCard());
                      }}
                    >
                      2 карти
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {persons.map((person) => (
          <PlayerField
            key={person.id}
            person={person}
            getRandomCard={getRandomCard}
            setKilled={setKilled}
            killed={killed}
          />
        ))}
      </div>
    </>
  );
});
