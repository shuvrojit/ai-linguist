import { Server } from 'http';
import app from '../app';

describe('Server', () => {
  let server: Server;

  beforeAll((done) => {
    server = app.listen(0, done); // Use port 0 for random available port
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should start the server successfully', () => {
    expect(server.listening).toBe(true);
  });
});
