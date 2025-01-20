import {
    Transaction,
    SystemProgram,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction,
    PublicKey,
  } from "@solana/web3.js";
  
  // Import your dev wallet private key from dev-wallet.json
  import wallet from "./dev-wallet.json";
  
  // Recreate the Keypair object from your secret key array
  const from = Keypair.fromSecretKey(new Uint8Array(wallet));
  
  // Define the Turbin3 public key you received in the instructions
  const to = new PublicKey("GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ");
  
  // Create a connection to Solana devnet
  const connection = new Connection("https://api.devnet.solana.com");
  
  (async () => {
    try {
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from.publicKey,
          toPubkey: to,
          lamports: LAMPORTS_PER_SOL / 10, // changed to 10 as we needed to send 0.1 sol
        })
      );
  

      transaction.recentBlockhash = (
        await connection.getLatestBlockhash("confirmed")
      ).blockhash;
      transaction.feePayer = from.publicKey;
  
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
      );
      console.log(`Success! Check out your TX here:
  https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (e) {
      console.error(`Oops, something went wrong: ${e}`);
    }
  })();
  