import 'dotenv/config';
import { createServer } from './server';

const port = process.env.PORT || 3001;
const server = createServer();

server.listen(port, () => {
  console.log(`Stocks API running on port ${port}`);
});
