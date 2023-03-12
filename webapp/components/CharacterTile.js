import Image from "next/image";

export default function CharacterTile({ character }) {
  return (
    <div className="CharacterTile-container">
      <h1>{character.name}</h1>
      <Image src={character.imageURI} width={200} height={200} alt="Error" />
      <div className="hp-bar-container">
        <progress
          value={parseInt(character.hp)}
          max={parseInt(character.maxHp)}
        />
        <p>
          {parseInt(character.hp)} / {parseInt(character.maxHp)}
        </p>
      </div>

      <p>Attack Damage: {parseInt(character.attackDamage)}</p>
    </div>
  );
}
