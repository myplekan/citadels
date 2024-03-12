import React, { useEffect, useState } from "react";
import charactersData from "../../characters.json";
import "./ChooseCharacter.css";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { actions } from "../../features/personsSlice";
import { Character, Person } from "../../types/Person";

type WillAddChar = {
  id: string,
  role: Character
};
type Props = {
  altValues: string[],
  setChooseChar: React.Dispatch<React.SetStateAction<boolean>>,
  chooseChar: boolean,
  setKing: React.Dispatch<React.SetStateAction<Person | null>>,
};

export const ChooseCharacter: React.FC<Props> = React.memo(
  ({ setChooseChar, chooseChar, altValues, setKing }) => {
    const persons = useAppSelector((state) => state.persons);

    const [isVisible, setIsVisible] = useState(true);
    const [whoPick, setWhoPick] = useState(altValues[0]);
    const [startId, setStartId] = useState(0);
    const [isChoosen, setIsChoosen] = useState<string[]>([]);
    const [willAddChar, setWillAddChar] = useState<WillAddChar[]>([]);

    const dispatch = useAppDispatch();

    const visibleNotice = () => {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timeout);
    };

    useEffect(() => {
      visibleNotice();
    }, []);

    const handleButtonClick = () => {
      willAddChar.forEach((char) => {
        dispatch(actions.addCharacter(char));
      });

      setChooseChar(false);
      document.body.style.overflowY = "auto";
      setStartId(0);
    };

    const handleCharacterClick = (charImg: string, moveQueue: number, name: string, type: string) => {
      const id = [...persons]
      .filter((person) => person.name === altValues[startId])
      .map((item) => item.id);

      setWillAddChar((char) => [
        ...char,
        {
          id: id[0],
          role: { photo: charImg, moveQueue, name, type },
        },
      ]);

      setStartId(() => startId + 1);

      if (name === 'King') {
        const person = [...persons].find(person => person.id === id[0]);
        if (person) {
          setKing(person);
        }
      }

      if (startId + 1 < altValues.length) {
        setWhoPick(altValues[startId + 1]);
        setIsVisible(true);
        visibleNotice();
      }
    };

    const checkIfchoosen = (check: string) => {
      return isChoosen.some((item) => item === check);
    };

    return (
      <>
        {chooseChar && (
          <div
            className={classNames("choose-char", {
              "choose-char--show": chooseChar,
            })}
          >
            {!isVisible && (
              <>
                {charactersData.characters.map((character) => (
                  <div className="choose-char__container" key={character.id}>
                    <div className="choose-char__character">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/characters/${character.bigPhoto}`}
                        className="choose-char__character-image"
                        alt={character.name}
                      />
                    </div>

                    <button
                      className={`choose-char__button-choose ${
                        checkIfchoosen(character.bigPhoto) ? "disabled" : ""
                      }`}
                      onClick={() => {
                        setIsChoosen((items) => [...items, character.bigPhoto]);
                        handleCharacterClick(
                          character.bigPhoto,
                          character.moveQueue,
                          character.name,
                          character.type,
                        );
                      }}
                      disabled={
                        altValues.length <= startId ||
                        checkIfchoosen(character.bigPhoto)
                      }
                    >
                      вибрати
                    </button>
                  </div>
                ))}

                <button
                  className="choose-char__button"
                  onClick={() => handleButtonClick()}
                >
                  закінчити вибір
                </button>
              </>
            )}

            {isVisible && (
              <div className="choose-char__notice">{`${whoPick} вибирає персонажа`}</div>
            )}
          </div>
        )}
      </>
    );
  }
);
