import { program } from 'commander';
import {
    PublicKey
} from '@solana/web3.js';
import { setClusterConfig, unlockPnft } from './scripts';

program.version('0.0.1');

programCommand('unlock')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-m, --mint <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, mint } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);
        if (mint === undefined) {
            console.log("Error token amount Input");
            return;
        }

        await unlockPnft(new PublicKey(mint));
    });

function programCommand(name: string) {
    return program
        .command(name)
        .option('-e, --env <string>', 'Solana cluster env name', 'mainnet-beta') //mainnet-beta, testnet, devnet
        .option('-r, --rpc <string>', 'Solana cluster RPC name', 'https://api.mainnet-beta.solana.com')
        .option('-k, --keypair <string>', 'Solana wallet Keypair Path', '../key/artpunk.json')
}

program.parse(process.argv);

/*

yarn script unlock -m 61NtLagJfqAttnrYHDrpSu5hHrUivr8AGgEsSi6Z6WML -k ../user.json

*/
