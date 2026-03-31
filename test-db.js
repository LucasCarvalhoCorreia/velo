import pg from 'pg';
const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:pTeQUNVJGUpfCget@db.lgfzajbndddiwevgdvrn.supabase.co:5432/postgres',
  max: 1,
});

async function checkConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ A conexão foi bem-sucedida! O banco de dados está online e a senha está correta.');
    const res = await client.query('SELECT version()');
    console.log('📝 Versão do Servidor:', res.rows[0].version);
    client.release();
  } catch (err) {
    console.error('❌ ERRO AO CONECTAR. Mensagem:');
    if (err.code === 'ENOTFOUND') {
      console.error('O endereço do banco (db.lgfzajbndddiwevgdvrn...) não foi encontrado. Provavelmente o projeto está pausado no Supabase ou o link direto foi desativado.');
    } else if (err.message.includes('password authentication failed')) {
      console.error('A senha inserida na URL (pTeQUNVJGUpfCget) está incorreta!');
    } else {
      console.error(err.message);
    }
  } finally {
    await pool.end();
  }
}

checkConnection();
