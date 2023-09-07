import { httpTerminator, server } from '../index.js';

export const handleShutdown = () => {
    console.log('Shutting down Gracefully');
    try {
      server.close(() => {
        httpTerminator.terminate();
        console.log('Express Server Closed');
        process.exit(0);
      });
    } catch (err) {
      console.error('Error while closing server:', err);
      process.exit(1);
    }
  };