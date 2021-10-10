const express = require('express');
const ws      = require('ws');
const http    = require('http');
const path    = require('path');

const app    = express();
const server = http.createServer();
const wss    = new ws.Server({ server });

// Code to setup the Express app (middleware, routes) can go here.
app.use(express.static(path.join(__dirname, 'client-side')));

wss.on('connection', client => {
  client.score = 0;

  client.on('message', message => {
    const { choice, userName } = JSON.parse(message);

    client.choice   = choice;
    client.username = userName;

    wss.clients.forEach(_client => {
      _client.send(JSON.stringify({
        messageType:  _client === client ? 'CHOICE ACCEPTED' : 'OPPONENT CHOICE',
        opponentName: client.username
      }));

      const winMessage = (winner, loser) => {
        winner.score = winner.score + 1;
        winner.send(JSON.stringify({
          messageType:   'WIN',
          ownScore:      winner.score,
          opponentScore: loser.score,
          opponentName:  loser.username,
        }));
      };

      const lossMessage = (loser, winner) => {
        loser.send(JSON.stringify({
          messageType:   'LOSE',
          ownScore:      loser.score,
          opponentScore: winner.score,
          opponentName:  winner.username,
        }));
      };

      const notify = (winner, loser) => {
        winMessage(winner, loser);
        lossMessage(loser, winner);
      };

      const tieMessage = clients => {
        clients.forEach(client => client.send(JSON.stringify({ messageType: 'TIE', })));
      };

      const resetChoices = clients => {
        clients.forEach(client => client.choice = null);
      };

      if (_client !== client && _client.choice) {
        const self  = client;
        const other = _client;

        if (other.choice === self.choice) {
          tieMessage([other, self]);
          resetChoices([other, self]);
          return;
        }

        switch (client.choice) {
          case 'Paper':
            other.choice === 'Rock' ? notify(self, other) : notify(other, self);
            break;
          case 'Rock':
            other.choice === 'Scissors' ? notify(self, other) : notify(other, self);
            break;
          case 'Scissors':
            other.choice === 'Paper' ? notify(self, other) : notify(other, self);
            break;
        }

        resetChoices([other, self]);
      }
    });
  });
});

server.on('request', app);
server.listen(3000, () => {
  console.log('The Server is listening on port 3000.');
});
