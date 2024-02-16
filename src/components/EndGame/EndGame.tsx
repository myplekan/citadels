import React from "react";
import { Person } from "../../types/Person";
import "./EndGame.css";

type Props = {
  person: Person;
  king: Person | null;
};

export const EndGame: React.FC<Props> = ({ person, king }) => {
  const { name, avatar, money, cards, builds, id } = person;

  const special = builds.filter((build) => (build.type === "special"));
  const aristocratic = builds.some((build) => (build.type === "aristocratic"));
  const trade = builds.some((build) => (build.type === "trade"));
  const military = builds.some((build) => (build.type === "military"));
  const church = builds.some((build) => (build.type === "church"));

  const unique = new Set(builds.map((build) => build.type));

  let result = builds.reduce((sum, cur) => sum + cur.price, 0);

  if (
    (special.length > 0 && aristocratic && trade && military && church) ||
    (Array.from(unique).length === 4 &&
      special.length > 1 &&
      builds.some((build) => build.name === "hauntedQuarter"))
  ) {
    result += 3;
  }

  if (builds.length >= 7) {
    result += 2;
  }

  if (builds.some((build) => build.name === "wellOfWishes")) {
    result += builds.filter((build) => build.type === "special").length;
  }

  if (king?.id === id) {
    result += 5;
  }

  if (builds.some((build) => build.name === "dragonGate")) {
    result += 2;
  }

  if (builds.some((build) => build.name === "archive")) {
    result += cards.length;
  }

  if (builds.some((build) => build.name === "imperialTreasury")) {
    result += money;
  }

  return (
    <div className="end-game__person">
      <img
        src={`${process.env.PUBLIC_URL}/images/persons/${avatar}`}
        className="end-game__person-image"
        alt={name}
      />

      {name}

      <span>{`Бали: ${result}`}</span>
    </div>
  );
};
