'use strict';

const db = require('../config/db');

var addDetail = (req, res) => {
    var debtorId = req.body.debtorId,
        amount = req.body.amount;

    var errors = [];
    var workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', ()=> {
        if (!debtorId){
            errors.push('debtorId required');
        };
        if (!amount){
            errors.push('amount required');
        };
        
        if (errors.length){
            workflow.emit('errors', errors);
        } else {
            workflow.emit('addDetail');
        };
    });

    workflow.on('errors', (errors)=> {
        res.status(500);
        return res.json({ 
            errors: errors
        });
    });

    workflow.on('addDetail', () => {
        db.debtors.findById(debtorId).then(debtor => {
            if (debtor.currentdebit < Math.abs(amount) && amount < 0) {
                errors.push('Số tiền trả cao hơn số tiền nợ.');
                workflow.emit('errors', errors);
            } else {
                debtor.currentdebit = parseFloat(debtor.currentdebit) + parseFloat(amount);
                debtor.save({fields: ['currentdebit']}).then(() => {
                    db.details.create({
                        debtor_id: debtorId,
                        amount: amount
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
                }).catch((error) => {
                    res.status(500);
                    return res.json({
                        errors: error,
                        stackError: error.stack
                    });
                });
            }
        });
    });

    workflow.emit('validateParams');
}

var deleteDetail = (req, res) => {
    var detailId = req.body.detailId;

    var errors = [];
    var workflow = new (require('events').EventEmitter)();

    workflow.on('validateParams', ()=> {
        if (!detailId){
            errors.push('detailId required');
        };
        
        if (errors.length){
            workflow.emit('errors', errors);
        } else {
            workflow.emit('deleteDetail');
        };
    });

    workflow.on('errors', (errors)=> {
        res.status(500);
        return res.json({ 
            errors: errors
        });
    });

    workflow.on('deleteDetail', () => {
        db.details.findById(detailId).then(detail => {
            var debtorId = detail.debtor_id,
                amount = detail.amount;
            detail.destroy();
            db.debtors.findById(debtorId).then(debtor => {
                debtor.currentdebit = parseFloat(debtor.currentdebit) - parseFloat(amount);
                debtor.save({fields: ['currentdebit']}).then(() => {
                    res.status(200);
                    return res.json();
                }).catch((error) => {
                    res.status(500);
                    return res.json({
                        errors: error,
                        stackError: error.stack
                    });
                });
            }); 
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

exports = module.exports = {
    addDetail: addDetail,
    deleteDetail: deleteDetail
}