const mongoose = require('mongoose')

const URI = 'mongodb://localhost/my_database'  

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(db => console.log('Data Base is connected'))
.catch(err => console.log('Data Base error :: ' + err))

module.exports = mongoose