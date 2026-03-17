const express = require('express');
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/connection');
connectToDb();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(cookieParser());

const userRoute = require('./routers/user.routes.js');
const pdfRoute = require('./routers/pdf.routes.js');
const chatRoute = require('./routers/chat.routes.js');
const { getVectorFor } = require('./utilities/vectorStore.utility');

app.use('/api/v1/users', userRoute);
app.use('/api/v1/pdf', pdfRoute);
app.use('/api/v1/chat', chatRoute);

// Debug endpoint: inspect in-memory vectorDB for a pdfId
app.get('/api/v1/debug/vector/:pdfId', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Forbidden in production' });
  }
  const pdfId = req.params.pdfId;
  const vectors = getVectorFor(pdfId);
  return res.json({ success: true, pdfId, count: vectors.length, vectors });
});

const errorMiddleware = require('./middlewares/error.middlware.js');
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


