import express from 'express';
import { HttpAgent, Actor } from '@dfinity/agent';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const canisterId = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
const host = 'http://127.0.0.1:4943';
const agent = new HttpAgent({ host });

// Only in local development!
agent.fetchRootKey().catch(err => {
  console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
  console.error(err);
});

let actor;

async function initialize() {
  try {
    const declarationsPath = join(__dirname, '..', 'declarations', 'wayfare_backend', 'wayfare_backend.did.js');
    const { idlFactory } = await import(declarationsPath);
    actor = Actor.createActor(idlFactory, { agent, canisterId });
    console.log('Actor created successfully');
  } catch (error) {
    console.error("Failed to create actor:", error);
    process.exit(1);
  }

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  app.post('/api/createUser', async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const result = await actor.createUser(name, email, password);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await actor.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/initiateDeposit', async (req, res) => {
    const {email, amount} = req.body;
    try {
      const result = await actor.initiateDeposit(email, amount);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/verifyDeposit', async (req, res) => {
    const {email, amount, password} = req.body;
    try {
      const result = await actor.verifyDeposit(email, BigInt(amount), password);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/getPendingDeposits', async (req, res) => {
    const {email} = req.body;
    try {
      const result = await actor.getPendingDeposits(email);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
}

initialize();