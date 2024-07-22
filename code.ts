import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    sendAndConfirmTransaction, 
    clusterApiUrl
  } from '@solana/web3.js';
  import { createFreezeAccountInstruction } from '@solana/spl-token';
  import bs58 from 'bs58';
  
  async function freezeTokenAccount(
    connection: Connection,
    payer: Keypair,
    tokenMint: PublicKey,
    tokenAccountToFreeze: PublicKey,
    freezeAuthority: Keypair
  ): Promise<void> {
    // Tạo một giao dịch mới
    let transaction = new Transaction();
  
    // Thêm lệnh freezeAccount vào giao dịch
    transaction.add(
      createFreezeAccountInstruction(
        tokenAccountToFreeze,
        tokenMint,
        freezeAuthority.publicKey,
        []
      )
    );
  
    // Gửi và xác nhận giao dịch
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, freezeAuthority]
    );
  
    console.log('Signature:', signature);
    console.log('The token account has been successfully frozen');
  }
  
  async function main(): Promise<void> {
    // Kết nối đến mạng Solana (sử dụng 'mainnet-beta' cho mạng chính)
    const endpoint = 'https://api.devnet.solana.com';

    const connection = new Connection(endpoint);
  
    // Chuyển đổi khóa Base58 thành Uint8Array
    const payerSecretKey = Buffer.from(bs58.decode('5Xzq2LkDmV9gKzneofcaQRVNUbLxuP5jN9QtU66ayBv6fnnftqbKKq1HLPCoKcXn1pLsoMmmLEzZCmYAJDT2gK7e'));
    const payer = Keypair.fromSecretKey(new Uint8Array(payerSecretKey));
  
    // Thay thế khóa này bằng khóa thực của quyền đóng băng
    const freezeAuthoritySecretKey =  Buffer.from(bs58.decode('5Xzq2LkDmV9gKzneofcaQRVNUbLxuP5jN9QtU66ayBv6fnnftqbKKq1HLPCoKcXn1pLsoMmmLEzZCmYAJDT2gK7e'));
    const freezeAuthority = Keypair.fromSecretKey(new Uint8Array(freezeAuthoritySecretKey));
  
    // Thay thế các địa chỉ này bằng địa chỉ thực của bạn
    const tokenMint = new PublicKey('4MpUuKoTMZLjVg36TdANUcQMiZ2od5rcC2k5Tc5GnyN3');
    const tokenAccountToFreeze = new PublicKey('5xYKrxVcfkbKCtTLDh8rfTgBVmZB6LbXNF2w6rdvLfpX');
  
    await freezeTokenAccount(connection, payer, tokenMint, tokenAccountToFreeze, freezeAuthority);
  }
  
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });