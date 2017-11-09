// Debtor.sync({force: true}).then(() => {
//     // Table created
//     return Debtor.create({
//       name: 'John',
//       phonenumber: '0963225057'
//     });
//   });

'use strict'

module.exports = (sequelize, Sequelize) => {  
  const Debtors = sequelize.define('debtors', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        required: true
    },
    phonenumber: {
        type: Sequelize.STRING,
        required: true
    },
    address : {
        type: Sequelize.STRING,
        required: true
    },
    district: {
        type: Sequelize.STRING,
        required: true,
        // isIn: ['Chantabuly', 'Sikhottabong', 'Xaysetha', 'Sisattanak', 'Hadxaifong', 'Mayparkngum', 'Naxaithong', 'Sangthong', 'Xaythany'],
        validate: { isIn: [['Chantabuly', 'Sikhottabong', 'Xaysetha', 'Sisattanak', 'Hadxaifong', 'Mayparkngum', 'Naxaithong', 'Sangthong', 'Xaythany']] }
    },
    firstdebit: {
        type: Sequelize.DOUBLE,
        required: true
    },
    currentdebit: {
        type: Sequelize.DOUBLE,
        required: true
    }
  }, {
    underscored: true
  });

// create table
//   Debtors.sync({force: true});
  return Debtors;
};
  