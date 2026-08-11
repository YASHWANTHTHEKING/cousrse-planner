import app from './app';
import { config } from './config/env';
import { ensureInitialSeed } from './services/autoSeed';

app.listen(config.port, async () => {
  console.log(`🚀 Career 360 Backend Server running on http://localhost:${config.port}`);
  await ensureInitialSeed();
});
