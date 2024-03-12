import { useEffect, useState } from "react";
import { actions } from "../../features/personsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Person } from "../../types/Person";
import { Card } from "../../types/card";
import "./PlayerField.css";

import charactersData from "../../characters.json";

type Props = {
  person: Person;
  getRandomCard: () => Card;
  setKilled: React.Dispatch<React.SetStateAction<string>>;
  killed: string;
  setRobbedPerson: React.Dispatch<React.SetStateAction<string | null>>;
  setDeck: React.Dispatch<React.SetStateAction<Card[]>>;
  setRoundStart: React.Dispatch<React.SetStateAction<boolean>>;
  whoMakesMove: Person;
  whoNeedPick: Person[];
  handleChooseCharacter: () => void;
};

export const PlayerField: React.FC<Props> = ({
  person,
  getRandomCard,
  setKilled,
  killed,
  setRobbedPerson,
  setDeck,
  setRoundStart,
  whoMakesMove,
  whoNeedPick,
  handleChooseCharacter,
}) => {
  const { name, avatar, money, cards, builds, id, character } = person;

  const persons = useAppSelector((state) => state.persons);

  const dispatch = useAppDispatch();

  const [clickedTimes, setClickedTimes] = useState(0);
  const [assassin, setAssassin] = useState(false);
  const [thief, setThief] = useState(false);
  const [warlord, setWarlord] = useState(false);
  const [magician, setMagician] = useState(false);
  const [magicianExchangePerson, setMagicianExchangePerson] = useState(false);
  const [magicianExchangeDeck, setMagicianExchangeDeck] = useState(false);
  const [cardsForExchange, setCardsForExchange] = useState<Card[]>([]);
  const [warlordCrash, setWarlordCrash] = useState<Person | null>(null);
  const [laboratory, setLaboratory] = useState<boolean>(false);
  const [thiecesDen, setThiecesDen] = useState<boolean>(false);
  const [exchangeCards, setExchangeCards] = useState<Card[]>([]);

  useEffect(() => {
    setClickedTimes(0);
  }, [character]);

  const grayElements = [];
  let grayNumber = 0;
  while (builds.length + grayElements.length < 7) {
    grayElements.push(grayNumber++);
  }

  const handleClickOnHand = (card: Card) => {
    const item = {
      id,
      card: card,
    };
    if (card.price <= money) {
      dispatch(actions.addBuilds(item));
      dispatch(actions.removeCards(item));
      card.type === "special" &&
      builds.some((build) => build.name === "factory")
        ? dispatch(actions.removeCoin({ id, coin: card.price - 1 }))
        : dispatch(actions.removeCoin({ id, coin: card.price }));
      setClickedTimes((clickedTimes) => clickedTimes + 1);
    }
  };

  const handleHeroPower = () => {
    charPower(character.name, id);
  };

  const charPower = (charName: string, id: string) => {
    switch (true) {
      case charName === "Assassin":
        setAssassin(true);
        break;
      case charName === "Thief":
        setThief(true);
        break;
      case charName === "Magician":
        setMagician(true);
        break;
      case charName === "King":
        break;
      case charName === "Comerciante":
        break;
      case charName === "Architect":
        dispatch(actions.addCard({ id, card: getRandomCard() }));
        dispatch(actions.addCard({ id, card: getRandomCard() }));
        break;
      case charName === "Warlord":
        setWarlord(true);
        break;
      default:
        break;
    }
  };

  const handleKillChar = (kill: string) => {
    setAssassin(false);
    setKilled(kill);
  };

  function handleRobbedChar(robbedName: string) {
    setThief(false);
    setRobbedPerson(robbedName);
  }

  const handleDestroy = (destroyItem: Card) => {
    if (warlordCrash) {
      const destroyCard = warlordCrash.builds.filter(
        (item) => item.id === destroyItem.id
      );
      dispatch(
        actions.removeBuild({ id: warlordCrash.id, card: destroyCard[0] })
      );
      dispatch(actions.removeCoin({ id, coin: destroyCard[0].price - 1 }));
    }

    setWarlord(false);
  };

  const handleExhangeWithPerson = (enemyId: string) => {
    const ownCards = persons[+id].cards;
    const enemyCards = persons[+enemyId].cards;

    dispatch(actions.setCards({ cards: ownCards, id: enemyId }));
    dispatch(actions.setCards({ cards: enemyCards, id }));

    setMagicianExchangePerson(false);
  };

  const handleExhangeWithDeck = () => {
    cardsForExchange.forEach((card) => {
      dispatch(actions.removeCards({ id, card }));
      dispatch(actions.addCard({ id, card: getRandomCard() }));
    });
    setDeck((prev) => prev.concat(cardsForExchange));
    setMagicianExchangeDeck(false);
    setCardsForExchange([]);
  };

  const handleBuildClick = (buildName: string) => {
    if (buildName === "laboratory") {
      setLaboratory(true);
    }
    if (buildName === "smithy") {
      if (money >= 2) {
        dispatch(actions.removeCoin({ id, coin: 2 }));
        dispatch(actions.addCard({ id, card: getRandomCard() }));
        dispatch(actions.addCard({ id, card: getRandomCard() }));
        dispatch(actions.addCard({ id, card: getRandomCard() }));
      }
    }
    if (buildName === "thieces_den") {
      setThiecesDen(true);
    }
  };

  const handleLaboratoryClick = (clickedCard: Card) => {
    setLaboratory(false);
    dispatch(actions.removeCards({ id, card: clickedCard }));
    dispatch(actions.addCoin({ id, coin: 2 }));
    setDeck((prev) => [...prev, clickedCard]);
  };

  const handleThiecesDen = (exchangeCard?: Card, buildIt?: string) => {
    if (exchangeCard) {
      exchangeCards.push(exchangeCard);
    }

    if (buildIt === "reset") {
      setExchangeCards([]);
    }

    if (buildIt === "build") {
      const thiecesDenCard = cards.filter(
        (card) => card.name === "thieces_den"
      );
      let cardPrice = thiecesDenCard[0].price;
      if (builds.filter((build) => build.name === "factory")) {
        cardPrice = cardPrice - 1;
      }

      if (money + exchangeCards.length >= 6) {
        exchangeCards.forEach((card) => {
          dispatch(actions.removeCards({ id, card }));
        });
        setDeck((prev) => prev.concat(exchangeCards));
        dispatch(actions.removeCards({ id, card: thiecesDenCard[0] }));
        dispatch(actions.addBuilds({ id, card: thiecesDenCard[0] }));
        dispatch(
          actions.removeCoin({ id, coin: cardPrice - exchangeCards.length })
        );
        setExchangeCards([]);
        setThiecesDen(false);
      }
    }
  };

  const handleEndRound = () => {
    if (whoNeedPick[whoNeedPick.length - 1].id === id) {
      handleChooseCharacter();
    } else {
      setRoundStart(true);
    }
  };

  return (
    <div className="player-field">
      {thiecesDen && (
        <div className="player-field__warlord">
          <span>Виберіть карти якими заплатите за цю карту</span>

          <div className="player-field__warlord-enemies">
            {cards
              .filter((card) => card.name !== "thieces_den")
              .filter(
                (card) =>
                  !exchangeCards.some(
                    (exchangeCard) => exchangeCard.id === card.id
                  )
              )
              .map((item) => (
                <div className="player-field__magician-enemy" key={item.id}>
                  <img
                    className="player-field__magician-img"
                    src={`${process.env.PUBLIC_URL}/images/${item.photo}`}
                    alt={item.name}
                  />
                  {item.name}

                  <button
                    className="player-field__warlord__button"
                    onClick={() => handleThiecesDen(item)}
                  >
                    Вибрати
                  </button>
                </div>
              ))}
          </div>

          <button
            className="player-field__warlord__button"
            onClick={() => handleThiecesDen(undefined, "build")}
          >
            Побудувати
          </button>

          <button
            className="player-field__warlord__button"
            onClick={() => {
              setThiecesDen(false);
              handleThiecesDen(undefined, "reset");
            }}
          >
            Повернутись назад
          </button>
        </div>
      )}

      {laboratory && (
        <div className="player-field__warlord">
          <span>Виберіть карту яку скидаєте щоб получити 2 золота</span>

          <div className="player-field__warlord-enemies">
            {cards.map((item) => (
              <div className="player-field__magician-enemy" key={item.id}>
                <img
                  className="player-field__magician-img"
                  src={`${process.env.PUBLIC_URL}/images/${item.photo}`}
                  alt={item.name}
                />
                {item.name}

                <button
                  className="player-field__warlord__button"
                  onClick={() => handleLaboratoryClick(item)}
                >
                  Вибрати
                </button>
              </div>
            ))}
          </div>

          <button
            className="player-field__warlord__button"
            onClick={() => setLaboratory(false)}
          >
            Закінчити обмін
          </button>
        </div>
      )}

      {assassin && (
        <div className="player-field__assassin">
          <span>Потрібно вибрати персонажа якого хочете вбити</span>

          <div className="player-field__assassin-enemies">
            {charactersData.characters.slice(1).map((char) => (
              <div className="player-field__assassin-enemy" key={char.id}>
                <img
                  className="player-field__assassin-enemy-img"
                  src={`${process.env.PUBLIC_URL}/images/characters/${char.bigPhoto}`}
                  alt={char.name}
                />

                <button
                  className="player-field__assassin__button"
                  onClick={() => handleKillChar(char.name)}
                >
                  Вибрати
                </button>
              </div>
            ))}
          </div>

          <button
            className="player-field__assassin__button"
            onClick={() => setAssassin(false)}
          >
            Відмінити
          </button>
        </div>
      )}

      {thief && (
        <div className="player-field__thief">
          <span>Потрібно вибрати персонажа</span>
          <span>в якого хочете забрати золото</span>
          <div className="player-field__thief-enemies">
            {charactersData.characters
              .slice(2)
              .filter((item) => item.name !== killed)
              .map((char) => (
                <div className="player-field__thief-enemy" key={char.id}>
                  <img
                    className="player-field__thief-enemy-img"
                    src={`${process.env.PUBLIC_URL}/images/characters/${char.bigPhoto}`}
                    alt={char.name}
                  />

                  <button
                    className="player-field__thief__button"
                    onClick={() => handleRobbedChar(char.name)}
                  >
                    Вибрати
                  </button>
                </div>
              ))}
          </div>
          <button
            className="player-field__thief__button"
            onClick={() => setThief(false)}
          >
            Відмінити
          </button>
        </div>
      )}

      {magician && (
        <div className="player-field__warlord">
          <span>Використайте тільки одну з двох властивостей:</span>

          <div className="player-field__warlord-enemies">
            <div className="player-field__warlord-enemy">
              <div className="player-field__magician-block">
                Обміняйте усі свої не розіграні карти кварталів, на карти
                кварталів з руки іншого гравця.
              </div>

              <button
                className="player-field__warlord__button"
                onClick={() => {
                  setMagicianExchangePerson(true);
                  setMagician(false);
                }}
              >
                Вибрати
              </button>
            </div>

            <div className="player-field__warlord-enemy">
              <div className="player-field__magician-block">
                Виберіть будь-яку кількість карт з руки, вони попадуть в колоду,
                візьміть стільки ж нових карт з Колоди кварталів
              </div>

              <button
                className="player-field__warlord__button"
                onClick={() => {
                  setMagicianExchangeDeck(true);
                  setMagician(false);
                }}
              >
                Вибрати
              </button>
            </div>
          </div>
        </div>
      )}

      {magicianExchangePerson && (
        <div className="player-field__warlord">
          <span>Виберіть гравця з яким обміняєтесь картами</span>

          <div className="player-field__warlord-enemies">
            {persons
              .filter((person) => person.id !== id)
              .map((item) => (
                <div className="player-field__warlord-enemy" key={item.id}>
                  <img
                    className="player-field__warlord-enemy-img"
                    src={`${process.env.PUBLIC_URL}/images/characters/${item.character.photo}`}
                    alt={item.name}
                  />
                  {item.name}

                  <button
                    className="player-field__warlord__button"
                    onClick={() => handleExhangeWithPerson(item.id)}
                  >
                    Вибрати
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {magicianExchangeDeck && (
        <div className="player-field__warlord">
          <span>Виберіть карти які хочете обміняти</span>

          <div className="player-field__warlord-enemies">
            {persons[+id].cards
              .filter(
                (card) =>
                  !cardsForExchange.map((change) => change.id).includes(card.id)
              )
              .map((item) => (
                <div className="player-field__magician-enemy" key={item.id}>
                  <img
                    className="player-field__magician-img"
                    src={`${process.env.PUBLIC_URL}/images/${item.photo}`}
                    alt={item.name}
                  />
                  {item.name}

                  <button
                    className="player-field__warlord__button"
                    onClick={() =>
                      setCardsForExchange((prev) => [...prev, item])
                    }
                  >
                    Вибрати
                  </button>
                </div>
              ))}
          </div>

          <button
            className="player-field__warlord__button"
            onClick={() => handleExhangeWithDeck()}
          >
            Закінчити обмін
          </button>
        </div>
      )}

      {warlord && (
        <div className="player-field__warlord">
          <span>Потрібно вибрати в кого і який квартал знищити</span>

          <div className="player-field__warlord-enemies">
            {warlordCrash
              ? warlordCrash.builds
                  .filter((build) => build.name !== "fort")
                  .map((build) => (
                    <div className="player-field__block" key={build.id}>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/${build.photo}`}
                        className="player-field__block-image"
                        alt={build.name}
                        onClick={() => {
                          if (build.price <= money) {
                            handleDestroy(build);
                          }
                        }}
                      />
                    </div>
                  ))
              : persons
                  .filter((person) => person.character.name !== "Bishop")
                  .filter((person) => person.character.name !== "Warlord")
                  .map((item) => (
                    <div className="player-field__warlord-enemy" key={item.id}>
                      <img
                        className="player-field__warlord-enemy-img"
                        src={`${process.env.PUBLIC_URL}/images/characters/${item.character.photo}`}
                        alt={item.name}
                      />
                      {item.name}

                      <button
                        className="player-field__warlord__button"
                        onClick={() => setWarlordCrash(item)}
                      >
                        Вибрати
                      </button>
                    </div>
                  ))}
          </div>

          <button
            className="player-field__warlord__button"
            onClick={() => setWarlord(false)}
          >
            Відмінити
          </button>
        </div>
      )}

      <div className="player-field__person">
        <div style={{ display: "flex", gap: "15px" }}>
          <img
            src={`${process.env.PUBLIC_URL}/images/persons/${avatar}`}
            className="player-field__person-image"
            alt={name}
          />
          {!character.photo ? (
            <img
              src={`${process.env.PUBLIC_URL}/images/back.png`}
              className="player-field__person-image"
              alt="Player cards"
            />
          ) : (
            <img
              src={`${process.env.PUBLIC_URL}/images/characters/${character.photo}`}
              className="player-field__person-image"
              alt={name}
            />
          )}
        </div>

        <span>
          {name}
          {whoNeedPick[0].id === id && (
            <svg
            fill="#e5f047"
            height="25px"
            width="25px"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="-13.2 -13.2 246.40 246.40"
            xmlSpace="preserve"
            stroke="#e5f047"
            stroke-width="0.0022"
            transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#CCCCCC"
              stroke-width="8.36"
            >
              {" "}
              <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14 l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544 c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865 c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z" />{" "}
            </g>

            <g id="SVGRepo_iconCarrier">
              {" "}
              <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14 l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544 c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865 c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z" />{" "}
            </g>
          </svg>
          )}
        </span>

        <div className="player-field__coins">
          {money}
          <div className="player-field__coin"></div>
        </div>

        <button
          className="player-field__button"
          onClick={handleHeroPower}
          disabled={killed === character.name || whoMakesMove.id !== id}
        >
          Використати силу персонажа
        </button>

        <button
          className="player-field__button"
          onClick={handleEndRound}
          disabled={killed === character.name || whoMakesMove.id !== id}
        >
          Закінчити хід
        </button>
      </div>

      <div className="player-field__right">
        {cards.length !== 0 ? (
          <div className="player-field__cards">
            {cards.map((card) => (
              <div className="player-field__block-card">
                <div
                  className={`player-field__card ${
                    killed === character.name ||
                    (!builds.some((build) => build.name === "career") &&
                      builds.some((build) => build.name === card.name))
                      ? "disabled"
                      : ""
                  }`}
                  key={card.id}
                  onClick={() => {
                    if (clickedTimes < 3 && character.name === "Architect") {
                      handleClickOnHand(card);
                    }
                    if (clickedTimes < 1 && character.name !== "Architect") {
                      handleClickOnHand(card);
                    }
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${card.photo}`}
                    className="player-field__card-image"
                    alt={card.id}
                  />
                </div>

                {card.name === "thieces_den" && (
                  <button
                    className="player-field__block-button"
                    onClick={() => handleBuildClick(card.name)}
                    disabled={card.name !== "thieces_den"}
                  >
                    Використати
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="player-field__block"></div>
        )}

        <div className="player-field__blocks">
          {builds.map((build) => (
            <>
              <div className="player-field__block-card" key={build.id}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/${build.photo}`}
                  className="player-field__block-image"
                  alt={build.name}
                />

                {(build.name === "laboratory" || build.name === "smithy") && (
                  <button
                    className="player-field__block-button"
                    onClick={() => handleBuildClick(build.name)}
                  >
                    Використати
                  </button>
                )}
              </div>
            </>
          ))}

          {grayElements.map((gray) => (
            <div className="player-field__block" key={gray}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
