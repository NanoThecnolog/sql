import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = 3000;


app.use(bodyParser.json());

// Config da conexão com banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }

});
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Erro na conexão com o banco de dados:", err);
  } else {
    console.log("Banco de dados conectado:", res.rows[0]);
  }
});

// Rotas
app.post("/execute-sql", async (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: "Comando SQL é obrigatório." });
  }

  try {

    const result = await pool.query(sql);
    res.status(200).json({
      message: "Comando executado com sucesso.",
      rows: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao executar comando SQL.", details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
