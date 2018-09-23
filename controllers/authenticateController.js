    var jwt=require('jsonwebtoken');
    var connection = require('../config/config');
    module.exports.authenticate=function(req,res){
        var email=req.body.email;
        var password=req.body.pass;
        var h_id=req.body.h_id;
        connection.query("SELECT * FROM USERS u LEFT join L_ROLE lr ON u.role=lr.role_id LEFT JOIN C_HOTEL_ACCESS a ON a.user_id=u.id WHERE u.email ='"+email+"' AND a.hotel_id="+h_id+" AND a.isActive=1;", function (error, results, fields) {
          if (error) {
              res.json({
                status:error,
                message:'there are some error with query'
                })
          }else{

            if(results.length >0){
                if(password==results[0].password){
                    results[0].password="";
                     const payload = {
      admin: results[0]
    };

        var token = jwt.sign(payload,process.env.SECRET_KEY, {
          expiresIn : 60*60*60*24
        });


                var tokenCookie=req.cookies.logToken;
                if(!tokenCookie)
                {





                    res.cookie('logToken',token,{maxAge:900000,httpOnly:true});
                    res.cookie('user',results[0],{maxAge:900000,httpOnly:true});



                }


                res.redirect('trackSession');
                   var message="Login Successful";

                }else{
                    res.end(

                      'Email and password does not match'
                     );
                }

            }
            else{
                res.end(

                      'Email does not exits'
                     );

            }
          }
        });
    }