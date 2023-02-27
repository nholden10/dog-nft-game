// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./libraries/Base64.sol";

import "hardhat/console.sol";

contract Game is ERC721 {
    struct CharacterAttributes {
        uint characterId;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    struct BossAttributes {
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    using Counters for Counters.Counter;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    event CharacterNFTMinted(
        address sender,
        uint256 tokenId,
        uint256 characterIndex
    );
    event AttackCompleted(address sender, uint newBossHp, uint newPlayerHp);

    BossAttributes public bigBoss;
    CharacterAttributes[] defaultCharacters;
    Counters.Counter private _tokenIds;

    uint randNonce = 0;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint bossHp,
        uint bossAttackDamage
    ) ERC721("Heroes", "HERO") {
        bigBoss = BossAttributes({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });

        console.log(
            "Boss %s initialized with %s HP, img %s",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.imageURI
        );

        for (uint i = 0; i < characterNames.length; i++) {
            defaultCharacters.push(
                CharacterAttributes({
                    characterId: i,
                    name: characterNames[i],
                    imageURI: characterImageURIs[i],
                    hp: characterHp[i],
                    maxHp: characterHp[i],
                    attackDamage: characterAttackDmg[i]
                })
            );

            CharacterAttributes memory c = defaultCharacters[i];
            console.log(
                "Done initializing %s w/ HP %s, img %s",
                c.name,
                c.hp,
                c.imageURI
            );
        }
        _tokenIds.increment();
    }

    function mintCharacterNFT(uint _characterIndex) external {
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterId: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log(
            "Minted NFT w/ tokenId %s and characterIndex %s",
            newItemId,
            _characterIndex
        );

        nftHolders[msg.sender] = newItemId;
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);

        _tokenIds.increment();
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public {
        uint256 playersTokenId = nftHolders[msg.sender];
        CharacterAttributes storage playersNFT = nftHolderAttributes[
            playersTokenId
        ];

        console.log(
            "\nPlayer with character %s about to attack. Player has %s HP, and %s attack damage!",
            playersNFT.name,
            playersNFT.hp,
            playersNFT.attackDamage
        );
        console.log(
            "Boss %s has %s HP, and %s attack damage!",
            bigBoss.name,
            bigBoss.hp,
            bigBoss.attackDamage
        );

        require(playersNFT.hp > 0); // Character must be alive to attack the boss.
        require(bigBoss.hp > 0); // Boss must not already be dead.

        //players attack
        console.log("%s swings at %s!", playersNFT.name, bigBoss.name);
        if (randomInt(10) > 5) {
            console.log("%s hit %s!", playersNFT.name, bigBoss.name);
            if (bigBoss.hp < playersNFT.attackDamage) {
                bigBoss.hp = 0;
            } else {
                bigBoss.hp = bigBoss.hp - playersNFT.attackDamage;
                console.log(
                    "%s took %s damage!",
                    bigBoss.name,
                    playersNFT.attackDamage
                );
            }
            console.log(
                "Boss %s now has %s HP remaining!",
                bigBoss.name,
                bigBoss.hp
            );
        } else {
            console.log("Your attack missed!");
        }

        //boss attack
        console.log("Boss %s attacked %s!", bigBoss.name, playersNFT.name);
        if (randomInt(10) > 5) {
            if (playersNFT.hp < bigBoss.attackDamage) {
                playersNFT.hp = 0;
                console.log("You died! Go buy a new character!");
            } else {
                playersNFT.hp = playersNFT.hp - bigBoss.attackDamage;
                console.log(
                    "You took a hit! took %s damage!",
                    bigBoss.name,
                    playersNFT.attackDamage
                );
            }
            console.log(
                "%s has %s HP remaining!",
                playersNFT.name,
                playersNFT.hp
            );
        } else {
            console.log("The boss's attack missed!");
        }
        emit AttackCompleted(msg.sender, bigBoss.hp, playersNFT.hp);
    }

    function randomInt(uint _modulus) internal returns (uint) {
        randNonce++;
        return
            uint(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }

    function checkIfUserHasNFT()
        public
        view
        returns (CharacterAttributes memory)
    {
        uint256 userNftTokenId = nftHolders[msg.sender];

        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters()
        public
        view
        returns (CharacterAttributes[] memory)
    {
        return defaultCharacters;
    }

    function getBoss() public view returns (BossAttributes memory) {
        return bigBoss;
    }
}
