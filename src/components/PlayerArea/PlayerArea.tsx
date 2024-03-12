import React from "react";
import "./PlayerArea.css";
import { Person } from "../../types/Person";
import classNames from "classnames";

type Props = {
  number: number;
  person: Person;
};

export const PlayerArea: React.FC<Props> = ({ number, person }) => {
  const { money, builds, name, avatar, character, cards } = person;

  const grayElements = [];
  let grayNumber = 0;
  while (builds.length + grayElements.length < 7) {
    grayElements.push(grayNumber++);
  }
  return (
    <div className="player-area" style={{ gridArea: `item${number}` }}>
      <div className="player-area__person">
        <div style={{ display: "flex", gap: "5px" }}>
          <img
            src={`${process.env.PUBLIC_URL}/images/persons/${avatar}`}
            className="player-area__person-image"
            alt={name}
          />

          {!character.photo ? (
            <div className="player-area__card-image"></div>
          ) : (
            <img
              src={`${process.env.PUBLIC_URL}/images/characters/${character.photo}`}
              className="player-area__person-image"
              alt={name}
            />
          )}
        </div>

        {name}

        <div className="player-area__coins">
          {money}
          <div className="player-area__coin"></div>
        </div>
      </div>

      <div className="player-area__cards">
        {cards.length !== 0 ? (
          cards.map((card, index) => (
            <div
              className="player-area__card"
              key={card.id}
              style={{ top: `${index * 5}px` }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/back.png`}
                className="player-area__card-image"
                alt={card.name}
              />
            </div>
          ))
        ) : (
          <div className="player-area__card-image"></div>
        )}
      </div>
      <div
        className={classNames("player-area__builds", {
          "player-area_builds--top-right":
            number === 3 || number === 5 || number === 8,
        })}
      >
        {builds.map((build) => {
          return (
            <img
              key={build.id}
              src={`${process.env.PUBLIC_URL}/images/${build.photo}`}
              className="player-area__card-image"
              alt={build.name}
            />
          );
        })}
        {grayElements.map((item) => (
          <div key={item} className="player-area__card-image"></div>
        ))}
      </div>
    </div>
  );
};
