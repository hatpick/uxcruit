var CategorySchema = require('../models/category');

exports.getAll = function(req, res) {    
    CategorySchema.find().sort({
    	title: 1
    }).exec(function(err,list){
    	if(err){
    		res.send({success: false, error: err.message});
    	}
    	else {
    		res.set('Content-Type', 'application/json');
    		res.send({success: true, data: list});
    	}
    });    
};

exports.add = function(req, res) {    
    var $title = req.body.title;    
    var $description = req.body.description;    

    var category = new CategorySchema({       
        title: $title,
        description: $description        
    });

    category.save(function (err, _category){
        if(err) {
            res.send({success: false, error: err.message});
        }
        else {
            res.set('Content-Type', 'application/json');
            res.send({success: true, data: _category});
        }
    });     
};