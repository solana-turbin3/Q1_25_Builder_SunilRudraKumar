import prompt from "prompt-sync";
import bs58 from "bs58";

const ps = prompt();
// base58 to wallet
function base58ToWallet(): void {
  const base58Key = ps("Enter your base58-encoded private key: ");

  const walletBytes = bs58.decode(base58Key);
  console.log("Your wallet array is:\n", Array.from(walletBytes));
}

// byte array to base58
function walletToBase58(): void {
  const input = ps("Enter your wallet byte array (comma-separated numbers):\n");

  const walletArray = input.split(",").map((n) => parseInt(n.trim(), 10));
  const base58Key = bs58.encode(new Uint8Array(walletArray));
  console.log("Your base58 private key is:\n", base58Key);
}

function main() {
  const choice = ps(
    "Select conversion:\n  1) base58 -> wallet array\n  2) wallet array -> base58\n> "
  );

  switch (choice.trim()) {
    case "1":
      base58ToWallet();
      break;
    case "2":
      walletToBase58();
      break;
    default:
      console.log("Invalid choice. Exiting.");
      break;
  }
}

main();
