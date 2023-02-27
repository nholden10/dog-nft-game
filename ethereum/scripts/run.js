const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("Game");
  const gameContract = await gameContractFactory.deploy(
    ["James", "Frank", "Willy"],
    [
      "https://i.imgur.com/1JS84AK_d.webp?maxwidth=520&shape=thumb&fidelity=high",
      "https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/samoyed-detail.jpg?bust=1535566500&width=355",
      "https://www.akc.org/wp-content/uploads/2017/11/Chihuahua-standing-in-three-quarter-view.jpg",
    ],
    [100, 200, 10],
    [150, 75, 10],
    "Munster",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Frankenstein%27s_monster_%28Boris_Karloff%29.jpg/640px-Frankenstein%27s_monster_%28Boris_Karloff%29.jpg",
    1000,
    3
  );
  await gameContract.deployed();
  console.log("Contract deployed to: ", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait;

  txn = await gameContract.attackBoss();
  await txn.wait;

  txn = await gameContract.attackBoss();
  await txn.wait;
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
