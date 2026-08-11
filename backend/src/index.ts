import app from './app';
import { config } from './config/env';

app.listen(config.port, () => {
  console.log(`🚀 Career 360 Backend Server running on http://localhost:${config.port}`);
});
