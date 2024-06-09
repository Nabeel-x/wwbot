const app = require('./src/app');

// Server is listening on port 3001 if we're not in production
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
