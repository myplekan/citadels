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
};

export const PlayerField: React.FC<Props> = ({
  person,
  getRandomCard,
  setKilled,
  killed,
}) => {
  const { name, avatar, money, cards, builds, id, character } = person;

  const persons = useAppSelector((state) => state.persons);

  const dispatch = useAppDispatch();

  const [clickedTimes, setClickedTimes] = useState(0);
  const [assassin, setAssassin] = useState(false);
  const [thief, setThief] = useState(false);
  const [warlord, setWarlord] = useState(false);
  const [warlordCrash, setWarlordCrash] = useState<Person | null>(null);

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
      dispatch(actions.removeCoin({ id, coin: card.price }));
    }

    setClickedTimes((clickedTimes) => clickedTimes + 1);
  };

  const handleHeroPower = () => {
    if (character.type !== "none") {
      let countCoin = builds.filter((build) => build.type === character.type);
      dispatch(actions.addCoin({ id: id, coin: countCoin.length }));
    }
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
      case charName === "King":
        // dispatch(actions.addCoin({ id, coin: 1 }));
        break;
      case charName === "Comerciante":
        dispatch(actions.addCoin({ id, coin: 1 }));
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

  const handleRobbedChar = (robbedName: string) => {
    setThief(false);
    const robbedId = [...persons].find(
      (person) => person.character.name === robbedName
    )?.id;

    if (robbedId) {
      dispatch(actions.addCoin({ id, coin: persons[+robbedId].money }));
      dispatch(
        actions.removeCoin({
          id: persons[+robbedId].id,
          coin: persons[+robbedId].money,
        })
      );
    }
  };

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

  return (
    <div className="player-field">
      {warlord && (
        <div className="player-field__warlord">
          <span>Потрібно вибрати в кого і який квартал знищити</span>

          <div className="player-field__warlord-enemies">
            {warlordCrash
              ? warlordCrash.builds.map((build) => (
                  <div className="player-field__block" key={build.id}>
                    <img
                      src={`/images/${build.photo}`}
                      className="player-field__block-image"
                      alt={build.name}
                      onClick={() => handleDestroy(build)}
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

      {thief && (
        <div className="player-field__thief">
          <span>Потрібно вибрати персонажа</span>
          <span>в якого хочете забрати золото</span>
          <div className="player-field__thief-enemies">
            {charactersData.characters.slice(2).map((char) => (
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

      {assassin && (
        <div className="player-field__assassin">
          <span>Потрібно вибрати персонажа якого хочете вбити</span>

          <div className="player-field__assassin-enemies">
            {charactersData.characters.slice(1).map((char) => (
              <div className="player-field__assassin-enemy" key={char.id}>
                <img
                  className="player-field__assassin-enem-img"
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
      <div className="player-field__person">
        <div style={{ display: "flex", gap: "15px" }}>
          <img
            src={`${process.env.PUBLIC_URL}/images/persons/${avatar}`}
            className="player-field__person-image"
            alt={name}
          />
          {!character.photo ? (
            <img
              src="/images/back.png"
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

        {name}

        <div className="player-field__coins">
          {money}
          <div className="player-field__coin"></div>
        </div>

        <button
          className="player-field__button"
          onClick={handleHeroPower}
          disabled={killed === character.name}
        >
          Використати силу персонажа
        </button>
      </div>

      <div className="player-field__right">
        {cards.length !== 0 ? (
          <div className="player-field__cards">
            {cards.map((card) => (
              <div
                className="player-field__card"
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
                  src={`/images/${card.photo}`}
                  className="player-field__card-image"
                  alt={card.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="player-field__block"></div>
        )}

        <div className="player-field__blocks">
          {builds.map((build) => (
            <div className="player-field__block" key={build.id}>
              <img
                src={`/images/${build.photo}`}
                className="player-field__block-image"
                alt={build.name}
              />
            </div>
          ))}

          {grayElements.map((gray) => (
            <div className="player-field__block" key={gray}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
