// import sha256 from 'crypto-js/sha256';
// import hexer from 'crypto-js/enc-hex';
import crypto from 'crypto';

// fallback module
let ed25519 = require('supercop.js')
try {
  // try to load native version
  ed25519 = require('ed25519-supercop')
} catch (err) {}


// getAddress accepts a hex formatted pubkey
export function getAddress (pubkey) {
    const hash = crypto.createHash('sha256');
    hash.update(pubkey, 'hex');
    let hex = hash.digest('hex');
    // let hex = sha256(pubkey).toString(hexer);
    return hex.slice(0, 40);  // 20 bytes
}

export function generateSeedKeys() {
    let seed = ed25519.createSeed();
    let keypair = ed25519.createKeyPair(seed)
    return {
        seed: seed.toString('hex'),
        pubkey: keypair.publicKey.toString('hex'),
        secret: keypair.secretKey.toString('hex')
    }
}

// signBytes creates a replay protected sign bytes, which we use
export function signBytes(msg, chainID, seq) {
    const extra = Buffer.alloc(chainID.length + 8);
    extra.write(chainID);
    // TODO: handle 64 bytes...
    extra.writeUInt32BE(0, 0);
    extra.writeUInt32BE(seq, 0);

    const total = msg.length + extra.length;
    const res = Buffer.concat([msg, extra], total);
    return res;
}

export function sign(msg, pubkey, secret) {
    return ed25519.sign(msg, pubkey, secret).toString('hex');
}

export function verify(sig, msg, pubkey) {
    return ed25519.verify(sig, msg, pubkey);
}
