import './App.css';
//ethereumのライブラリー
import { ethers } from "ethers";
//NFT.solのdeployファイルをとりこむ。cracoを使ってModuleScopePluginの設定を削除しないとimportできない。
import {abi,bytecode} from "../../contracts/artifacts/contracts/NFT.sol/NFT.json";

// Metamask を利用している状態でアクセスすること
// https://metamask.io/

//Providerを作成。Ethereumへのネットワーク接続を管理します。
let provider;
let address = ""; //NFTのdeploy時のアドレスを指定する。
(async() => {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  provider = new ethers.providers.Web3Provider(window.ethereum);
})();

//Clickの処理.NFTをDeploy
const buttonDeploy = async() => {
  //署名を取得します。コントラクトの作成には署名が必要です。基本的に、コントラクトの生成や値が変わる処理にはマイニングが必要なので署名が必要です。
  const signer = provider.getSigner();
  //abi,bytecode,署名からコントラクトを作成するためのfactoryを作ります。
  const factory = new ethers.ContractFactory(abi,bytecode,signer);
  //NFTをdeployします。
  const contract = await factory.deploy();//metamaskの署名を要求する
  address = contract.address;//deployしたアドレス。
  console.log(contract);
  console.log(address);
  //rinkebyのchainidのときはetherscanのリンクを表示
  const net = await signer.provider.getNetwork();
  if( net.chainId == 4) console.log("https://rinkeby.etherscan.io/tx/" + contract.deployTransaction.hash);//Tx Hash Etherscanで探す。
};
//Clickの処理.consoleにnameが表示されればOK.Txがcommitされる前に押すとエラーになる。
const buttonGetName = async() => {
  const contract = new ethers.Contract(address, abi, provider);
  console.log(await contract.name())
  console.log(address);
};
//Clickの処理.NFTをmint
const buttonMint = async() => {
  const signer = provider.getSigner();
  //以前にdeployしたコントラクトのアドレスからコントラクトを特定します。
  const contract = new ethers.Contract(address, abi, provider);
  //署名を付けてコントラクトのmintを実行します。
  const {hash } = await contract.connect(signer).mint(signer.getAddress());//metamaskの署名を要求する
  console.log(contract);
  console.log(address);
  //rinkebyのchainidのときはetherscanのリンクを表示
  const net = await signer.provider.getNetwork();
  if( net.chainId == 4) console.log("https://rinkeby.etherscan.io/tx/" + hash);//Tx Hash Etherscanで探す。
};
//Clickの処理.NFTのtotalSupply
const buttonSupply = async() => {
  const contract = new ethers.Contract(address, abi, provider);
  console.log(address);
  console.log(await contract.totalSupply());
};

function App() {
  return (
    <div className="App">
    <p>動作</p>
    <button id="test" onClick={buttonDeploy}>NFT deploy</button><br/>
    <button id="test1" onClick={buttonGetName}>NFT get name</button><br/>
    <button id="test2" onClick={buttonMint}>NFT mint</button><br/>
    <button id="test2" onClick={buttonSupply}>NFT totalSupply</button>
    </div>
  );
}
export default App;