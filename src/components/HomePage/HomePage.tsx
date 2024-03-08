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
import { EndGame } from "../EndGame/EndGame";

export const HomePage = React.memo(() => {
  const [chooseChar, setChooseChar] = useState(false);
  const [roundStart, setRoundStart] = useState(false);
  const [whoNeedPickIndex, setWhoNeedPickIndex] = useState(0);
  const [isTwoCards, setIsTwoCards] = useState(false);
  const [cardOne, setCardOne] = useState<Card | null>(null);
  const [cardTwo, setCardTwo] = useState<Card | null>(null);
  const [startGame, setStartGame] = useState(false);
  const [deck, setDeck] = useState<Card[]>(cardsData.cards);
  const [gameEnd, setGameEnd] = useState<boolean>(false);

  const [robbedPerson, setRobbedPerson] = useState<string | null>(null);

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
    whoNeedPick = [...persons]
      .filter((who) => who.character.name !== killed)
      .sort((a, b) => {
        if (a.character.moveQueue !== null && b.character.moveQueue !== null) {
          return a.character.moveQueue - b.character.moveQueue;
        }

        return +a.id - +b.id;
      });
  }

  const getRandomCard = (): Card => {
    const randomNum = getRandomNumber();
    const foundCard = deck.find((item) => +item.id === randomNum);

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
    const max = 68;
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
    setKilled("");
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

  const handleRoundMove = (
    type: string,
    person?: Person,
    card?: Card | null
  ) => {
    // console.log(person?.character.type, person)
    // if (person?.character.type !== 'none' && person) {
    //   let countCoin = person.builds.filter(build => build.type === person.character.type);
    //   dispatch(actions.addCoin({id: person.id, coin: countCoin.length}))
    // }
    setRoundStart(false);

    if (robbedPerson === person?.character.name) {
      const ThiefPerson = [...persons].find(
        (person) => person.character.name === "Thief"
      );
      if (ThiefPerson) {
        const countMoney = persons[+person.id].money;

        dispatch(actions.addCoin({ id: ThiefPerson.id, coin: countMoney }));
        dispatch(
          actions.removeCoin({
            id: person.id,
            coin: countMoney,
          })
        );
      }
      setRobbedPerson(null);
    }

    if (person && person.character.name !== killed) {
      if (person.character.type !== "none") {
        let countCoin = person.builds.filter(
          (build) =>
            build.type === person.character.type ||
            build.name === "schoolOfMagic"
        );
        if (countCoin.length > 0) {
          dispatch(actions.addCoin({ id: person.id, coin: countCoin.length }));
        }
      }
    }

    if (person?.character.name === "Comerciante") {
      dispatch(actions.addCoin({ id: person.id, coin: 1 }));
    }

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

  const handleChooseTwoCards = () => {
    if (
      whoNeedPick[whoNeedPickIndex].builds.some(
        (build) => build.name === "library"
      )
    ) {
      const cardOne = getRandomCard();
      const cardTwo = getRandomCard();
      dispatch(
        actions.addCard({ id: whoNeedPick[whoNeedPickIndex].id, card: cardOne })
      );
      dispatch(
        actions.addCard({ id: whoNeedPick[whoNeedPickIndex].id, card: cardTwo })
      );
      setDeck(() => [...deck].filter((item) => item.id !== cardOne.id));
      setDeck(() => [...deck].filter((item) => item.id !== cardTwo.id));

      if (whoNeedPick.length > whoNeedPickIndex) {
        setWhoNeedPickIndex(whoNeedPickIndex + 1);
      }
      setRoundStart(false);
    } else {
      setIsTwoCards(true);
      setCardOne(() => getRandomCard());
      setCardTwo(() => getRandomCard());
    }
  };

  const handleNewGame = () => {
    setStartGame(false);
    setDeck(cardsData.cards);
    setKing(persons[0]);
    setAltValues([]);
    persons.forEach((person) => {
      dispatch(actions.reset({ id: person.id }));
    });
  };

  const handleGameEnd = () => {};

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

        <div className="buttons__mid">
          <button
            className="button"
            onClick={() => handleNewGame()}
            // disabled={whoNeedPickIndex === whoNeedPick.length || !startGame}
          >
            Нова гра
          </button>

          <button
            className="button"
            onClick={() => setGameEnd(true)}
            // disabled={whoNeedPickIndex === whoNeedPick.length || !startGame}
          >
            Кінець гри
          </button>
        </div>

        {gameEnd && (
          <div className="end-game">
            <div className="end-game__container">
              {persons.map((person) => (
                <EndGame key={person.id} person={person} king={king} />
              ))}
            </div>

            <button className="button" onClick={() => setGameEnd(false)}>
              Вийти на головну
            </button>
          </div>
        )}

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
                        src={`${process.env.PUBLIC_URL}/images${cardOne?.photo}`}
                        alt="Card one"
                        onClick={() =>
                          handleRoundMove(
                            "card",
                            whoNeedPick[whoNeedPickIndex],
                            cardOne
                          )
                        }
                      />
                    </div>
                    <div className="round-start__choose-item">
                      <img
                        className="round-start__choose-img"
                        src={`${process.env.PUBLIC_URL}/images${cardTwo?.photo}`}
                        alt="Card two"
                        onClick={() =>
                          handleRoundMove(
                            "card",
                            whoNeedPick[whoNeedPickIndex],
                            cardTwo
                          )
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="round-start__choose-item"
                      onClick={() =>
                        handleRoundMove("coin", whoNeedPick[whoNeedPickIndex])
                      }
                    >
                      2 золота
                    </div>

                    <div
                      className="round-start__choose-item"
                      onClick={() => handleChooseTwoCards()}
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
            setRobbedPerson={setRobbedPerson}
            setDeck={setDeck}
          />
        ))}
      </div>
    </>
  );
});
