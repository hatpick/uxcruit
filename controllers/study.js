var StudySchema = require('../models/study'),
    ExperimenterSchema = require('../models/experimenter');

exports.getAll = function(req, res) {    
    StudySchema.find().sort({
    	createdAt: 1
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
    var $investigatorName =req.body.investigatorName;
    var $investigatorEmail = req.body.investigatorEmail;
    var $price = parseInt(req.body.price, 10);
    var $location = req.body.location || "Remote";
    var $category = req.body.category;
    var $tags = req.body.tags || "";    
    var $investigatorEmail = req.body.investigatorEmail;
    var $user = req.user.username;    

    var study = new StudySchema({
        investigatorName: $investigatorName,
        investigatorEmail: $investigatorEmail,
        title: $title,
        description: $description,
        price: $price,
        location: $location,
        category: $category,
        tags: $tags
    });

    study.save(function (err, _study){
        if(err) {
            res.send({success: false, error: err.message});
        }
        else {            
            ExperimenterSchema.findOne({'username': $user}).exec(function(err, experimenter) {
                if(err){                    
                    res.send({success: false, error: err.message});
                }
                else {                
                    experimenter.addStudy(_study);
                    res.set('Content-Type', 'application/json');
                    res.send({success: true, data: _study});                
                }
            });
        }
    });     
};