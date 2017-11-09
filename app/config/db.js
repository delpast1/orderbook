const Sequelize = require('sequelize');

const sequelize = new Sequelize('orderbook', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        underscored: true
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.debtors = require('../models/debtors')(sequelize, Sequelize);
db.details = require('../models/details')(sequelize, Sequelize);

// Association
db.details.belongsTo(db.debtors);
db.debtors.hasMany(db.details);

// sequelize
// .authenticate()
// .then(() => {
//   console.log('Connection has been established successfully.');
// })
// .catch(err => {
//   console.error('Unable to connect to the database:', err);
// });

exports = module.exports = db;
