const express = require('express');
const mysql = require('mysql');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MAya47..',
  database: 'creditsystem'
});

connection.connect();
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send real-time loan data to the client
  const query = connection.query('SELECT * FROM loans');
  const loans = [];

  query.on('result', (row) => {
    const loan = {
      loanId: row.loanId,
      amount: row.amount,
      duration: row.duration,
      interestRate: row.interestRate,
      interest: row.interest,
      approved: row.approved,
      repaid: row.repaid
    };
    loans.push(loan);
  });

  query.on('end', () => {
    try {
      socket.emit('loansUpdate', loans);
      console.log('sending data', loans);
    } catch (error) {
      console.error('Error sending loans update:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/store-loans', (req, res) => {
  const loans = req.body;
  console.log('Received loan data:', loans);

  // Check if loan exists in the database
  connection.query('SELECT * FROM loans', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error checking for existing loans');
      return;
    }

    // Filter out loans that already exist in the database
    let newLoans = loans.filter((loan) => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].loanId === loan.loanId) {
          if (rows[i].amount !== loan.amount ||
            rows[i].duration !== loan.duration ||
            rows[i].interestRate !== loan.interestRate ||
            rows[i].interest !== loan.interest ||
            rows[i].approved !== loan.approved ||
            rows[i].repaid !== loan.repaid) {
            // Update existing loan with new values
            connection.query('UPDATE loans SET amount=?, duration=?, interestRate=?, interest=?, approved=?, repaid=? WHERE loanId=?',
              [loan.amount, loan.duration, loan.interestRate, loan.interest, loan.approved, loan.repaid, loan.loanId],
              (error, result) => {
                if (error) {
                  console.error(error);
                  res.status(500).send('Error updating loan data');
                  return;
                }
                console.log('Loan data updated successfully');
              }
            );
          }
          return false;
        }
      }
      return true;
    });

    if (newLoans.length === 0) {
      console.log('All loans already exist in the database');
      res.send('All loans already exist in the database');
      return;
    }

    // Store new loans in the database
    let values = newLoans.map((loan) => [loan.loanId, loan.amount, loan.duration, loan.interestRate, loan.interest, loan.approved, loan.repaid]);
    connection.query('INSERT INTO loans (loanId, amount, duration, interestRate, interest, approved, repaid) VALUES ?', [values], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error storing loan data');
      } else {
        console.log('Loan data stored successfully');
        res.send('Loan data stored successfully');
        io.emit('loansUpdate', JSON.stringify(newLoans));
      }
    });
  });
});


server.listen(8000, () => {
  console.log('Server started on port 8000');
});
