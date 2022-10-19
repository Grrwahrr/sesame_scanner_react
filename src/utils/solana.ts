import crypto from "crypto";
import {Connection, Keypair, PublicKey, TransactionSignature} from "@solana/web3.js";

const bs58 = require("bs58");
const idl = require("../idl/sesame.json");
const anchor = require("@project-serum/anchor");
import {Program} from "@project-serum/anchor";
import {notify} from "./notifications";
import NodeWalletClone from "./nodeWalletClone";


const textEncoder = new TextEncoder();
const RPC_URL = "https://api.devnet.solana.com"; // https://api.devnet.solana.com http://localhost:8899


// Notification functions
export const notifyTxError = (message: string, error: any, tx: TransactionSignature) => {
    notify({type: 'error', message: message, description: error?.message, txid: tx});
    console.log('error', message, error?.message, tx);
}

export const notifyTxSuccess = (message: string, tx: TransactionSignature) => {
    notify({type: 'success', message: message, txid: tx});
}

// Derivation functions
export const deriveTicket = (program: Program, event: PublicKey, offset: number) =>
    anchor.web3.PublicKey.findProgramAddressSync(
        [textEncoder.encode("Ticket"), event.toBuffer(), new anchor.BN(offset).toArrayLike(Buffer, "le", 2)],
        program.programId
    );


// Connection setup and key restoration functions
const getConnection = () => {
    return new Connection(RPC_URL, 'confirmed');
}

export const ticketProgram = (signer: Keypair) => {
    const provider = new anchor.AnchorProvider(getConnection(), new NodeWalletClone(signer), {});
    return new anchor.Program(idl, idl.metadata.address, provider);
}

export const base58ToPubKey = (base58: string) => {
    return new PublicKey(base58);
}

export const getKeyPairForSecretKeyBase58 = (secretKeyBase58: string) => {
    try {
        return Keypair.fromSecretKey(bs58.decode(secretKeyBase58));
    } catch (e) {
        return undefined;
    }
}

export const getKeyPairForSeed = (numArray: Buffer) => {
    try {
        return Keypair.fromSeed(Uint8Array.from(numArray));
    } catch (e) {
        return undefined;
    }
}

export const getKeyPairForTicket = (name: string, seatName: string, seed: string, event: string) => {
    let sha256 = crypto.createHash('sha256');
    sha256.update(name);
    sha256.update(seatName);
    sha256.update(seed);
    sha256.update(event);
    let signerSeedBytes = sha256.digest();
    return getKeyPairForSeed(signerSeedBytes);
}


export const ticketCheckIn = async (program: Program, ticketOffset: number, authorityCheckIn: Keypair, ticketOwner: Keypair, event: PublicKey, ticket: PublicKey) => {
    let tx;
    try {
        tx = await program.methods
            .ticketCheckIn(ticketOffset)
            .accounts({
                authority: authorityCheckIn.publicKey,
                ticketOwner: ticketOwner.publicKey,
                event: event,
                ticket: ticket,
            })
            .signers([authorityCheckIn, ticketOwner])
            .rpc();
    } catch (e) {
        return {success: false, error: e};
    }
    return {success: true, tx: tx};
}