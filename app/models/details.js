
'use strict'

module.exports = (sequelize, Sequelize) => {  
    const Details = sequelize.define('details', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        debtor_id: {
            type: Sequelize.INTEGER,
            required: true
        },
        amount: {
            type: Sequelize.DOUBLE,
            required: true
        }
    }, {
        underscored: true
      });
      // create table
//   Details.sync({force: true});
      return Details;
}