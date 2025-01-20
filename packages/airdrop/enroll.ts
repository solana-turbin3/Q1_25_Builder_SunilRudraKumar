import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Idl,
  Address,
} from "@coral-xyz/anchor";
import myWallet from "./Turbin3-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(myWallet));
const connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("SunilRudraKumar", "utf8");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const programId = new PublicKey("WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq");

(async () => {
  try {
    const program: Program<Idl> = await Program.at(
      programId as Address,
      provider
    );

    const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("prereq"), keypair.publicKey.toBuffer()],
      program.programId
    );

    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
        prereq: enrollmentKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log(
      `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
