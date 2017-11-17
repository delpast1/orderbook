'use strict';

const db = require('../config/db');

//add new debtor
var addDebtor = (req, res) => {
    var name = req.body.name,
        phonenumber = req.body.phonenumber,
        address = req.body.address,
        district = req.body.district,
        firstdebit = req.body.firstdebit;

    var errors = [];
    var workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', ()=> {
        if (!name){
            errors.push('name required');
        };
        if (!phonenumber){
            errors.push('phonenumber required');
        };
        if (!address){
            errors.push('address required');
        };
        if (!district){
            errors.push('district required');
        };
        if (!firstdebit){
            errors.push('firstdebit required');
        };
        
        if (errors.length){
            workflow.emit('errors', errors);
        } else {
            workflow.emit('addDebtor');
        };
    });

    workflow.on('errors', (errors)=> {
        res.status(500);
        return res.json({ 
            errors: errors
        });
    });

    workflow.on('addDebtor', () => {
        db.debtors.create({
            name: name,
            phonenumber: phonenumber,
            address: address,
            district: district,
            firstdebit: firstdebit,
            currentdebit: firstdebit
        }).then((data) => {
            res.status(200);
            return res.json(data.get({plain: true}));
        }).catch((error) => {
            res.status(500);
            return res.json({
                errors: error,
                stackError: error.stack
            });
        });
    });

    workflow.emit('validateParams');
};

var getDebtor = (req, res) => {
    var debtorId = req.body.debtorId;

    var errors = [];
    var workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', ()=> {
        if (!debtorId){
            errors.push('debtorId required');
        };
        
        if (errors.length){
            workflow.emit('errors', errors);
        } else {
            workflow.emit('getDebtor');
        };
    });

    workflow.on('errors', (errors)=> {
        res.status(500);
        return res.json({ 
            errors: errors
        });
    });

    workflow.on('getDebtor', () => {
        db.debtors.findById(debtorId).then(debtor => {
            db.details.findAll({where: {debtor_id: debtorId}}).then(details => {
                res.status(200);
                return res.json({
                    debtorInfo: debtor,
                    details: details
                });
            }).catch((error) => {
                res.status(500);
                return res.json({
                    errors: error,
                    stackError: error.stack
                });
            });
        });
    });

    workflow.emit('validateParams');
};

var getDebtors = (req, res) => {
    db.debtors.findAll().then(debtors => {
        return res.json(debtors);
    });
};

var updateDebtor = (req, res) => {
    var id = req.body.id,
        name = req.body.name,
        phonenumber = req.body.phonenumber,
        address = req.body.address,
        district = req.body.district,
        firstdebit = req.body.firstdebit;

    var errors = [];
    var workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', ()=> {
        if (!id){
            errors.push('id required');
        };
        if (!name){
            errors.push('name required');
        };
        if (!phonenumber){
            errors.push('phonenumber required');
        };
        if (!address){
            errors.push('address required');
        };
        if (!district){
            errors.push('district required');
        };
        if (!firstdebit){
            errors.push('firstdebit required');
        };
        
        if (errors.length){
            workflow.emit('errors', errors);
        } else {
            workflow.emit('updateDebtor');
        };
    });

    workflow.on('errors', (errors)=> {
        res.status(500);
        return res.json({ 
            errors: errors
        });
    });

    workflow.on('updateDebtor', () => {
        db.debtors.findById(id).then(debtor => {
            db.details.findAll({where: {debtor_id: debtorId}}).then(details => {
                if (details.length && debtor.firstdebit !== firstdebit) {
                    errors.push('Cannot change First Debit.');
                    workflow.emit('errors', errors);
                }
            }).then(() => {
                debtor.update({
                    name: name,
                    phonenumber: phonenumber,
                    address: address,
                    district: district,
                    firstdebit: firstdebit,
                    currentdebit: firstdebit
                }).then((data) => {
                    res.status(200);
                    return res.json(data.get({plain: true}));
                });
            });
        }).catch((error) => {
            res.status(500);
            return res.json({
                errors: error,
                stackError: error.stack
            });
        });;
    });

    workflow.emit('validateParams');
}

var deleteDebtor = (req, res) => {
    var id = req.body.id;

    var errors = [];
    var workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', ()=> {
        if (!id){
            errors.push('id required');
        };
        
        if (errors.length){
            workflow.emit('errors', errors);
        } else {
            workflow.emit('deleteDebtor');
        };
    });

    workflow.on('errors', (errors)=> {
        res.status(500);
        return res.json({ 
            errors: errors
        });
    });

    workflow.on('deleteDebtor', () => {
        db.debtors.findById(id).then(debtor => {
            db.details.findAll({where: {debtor_id: id}}).then(details => {
                for(let i=0; i<details.length; i++){
                    details[i].destroy();
                };
            }).then(() => {
                debtor.destroy();
            });
        }).then(() => {
            res.status(200);
            return res.json();
        }).catch((error) => {
            res.status(500);
            return res.json({
                errors: error,
                stackError: error.stack
            });
        });;
    });

    workflow.emit('validateParams');
}
exports = module.exports = {
    addDebtor: addDebtor,
    getDebtor: getDebtor,
    getDebtors: getDebtors,
    updateDebtor: updateDebtor,
    deleteDebtor: deleteDebtor
}