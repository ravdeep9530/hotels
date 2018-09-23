var connection = require('../config/config');
module.exports.fetchLoanType = function (req, res) {

    connection.query('SELECT * FROM L_LOAN_TYPE', function (error, results, fields) {
        {

            res.json({
                data: results
            })

            //res.send(JSON.stringify(results));
        }
    });
}


module.exports.fetchCatData = function (req, res) {

    connection.query('SELECT * FROM TRACK_CATEGORY', function (error, results, fields) {
        {

            res.json({
                data: results
            })

            //res.send(JSON.stringify(results));
        }
    });
}

module.exports.getGobalization = function (req, res) {

    connection.query('CALL `getGlobalizationByPageID`(' + req.params.page_id + ')', function (error, results, fields) {
        {

            res.json({
                data: results
            })

            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchLoanCycleData = function (req, res) {

    connection.query('SELECT * FROM L_LOAN_CYCLE', function (error, results, fields) {
        {

            res.json({
                data: results
            })

            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchPersonData = function (req, res) {

    connection.query('SELECT * FROM PEOPLE p inner join L_LOAN_TYPE lt on p.loan_type_id=lt.l_type_id  INNER join L_Active la on p.isActive=la.active_id ORDER BY id DESC', function (error, results, fields) {
        {

            res.json({
                data: results
            })

            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchPersonByIDData = function (req, res) {

    connection.query('SELECT * FROM PEOPLE WHERE id=' + req.params.pID, function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchPersonLoanByIDData = function (req, res) {

    connection.query('SELECT * from PEOPLE p INNER JOIN LOANS l on p.id=l.person_id Where p.isActive=1 and p.id=' + req.params.pID, function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchfineByLoanID = function (req, res) {

    connection.query('SELECT ROUND(ifnull(SUM(f.fine_amount)-(SELECT ifnull(SUM(ii.installment_amount),0) FROM INSTALLMENTS ii where ii.loan_id=f.l_id and ii.installment_type=2),0),2) ftot FROM `FINE` f  WHERE f.l_id=' + parseInt(req.params.lid), function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results,
                    err: error
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getTranctionReport = function (req, res) {

    var s = "CALL `getTransactions`('" + parseInt(req.params.id) + "','');";
    if (parseInt(req.params.id) < 0) {
        var ss = req.params.id.substr(1, req.params.id.length);
        //console.log(ss);
        var s = "CALL `getTransactions`(5,'" + ss + "');";
    }

    connection.query(s, function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results,
                    err: error
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getDateReport = function (req, res) {
    var fr = req.params.fr.split('-');
    var to = req.params.to.split('-');

//console.log(fr[2]+fr[0]+fr[1]+"&"+to[2]+to[0]+to[1]);
    connection.query("SELECT * FROM SUPER_USER WHERE uid=" + req.cookies.user.id, function (error, results, fields) {

        if (results.length > 0) {
            connection.query("CALL `getTransactions`('3','" + fr[2] + fr[0] + fr[1] + "&" + to[2] + to[0] + to[1] + "');", function (error, results, fields) {
                {
                    {
                        res.json({
                            status: 'true',
                            data: results,
                            err: error
                        });
                    }


                    //res.send(JSON.stringify(results));
                }
            });
        } else {
            res.json({
                status: 'false',
                data: error,
                err: error
            });
        }
    });
}
module.exports.getInstallmentsByID = function (req, res) {


    connection.query('SELECT I.*,U.name from INSTALLMENTS I LEFT JOIN USERS U ON I.depositByID=U.id where I.loan_id=' + req.params.lid, function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getLoanDetailByID = function (req, res) {

    connection.query('CALL getLoanDetail(' + req.params.lid + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getStart = function (req, res) {

    ///////////////---------Getting Globalization in a Array--------------------

    var page_id = 0;
    if (req.cookies.global_cache) {
        try {
            page_id = req.cookies.global_cache[0][0].previous_page_id;
        } catch (err) {
            page_id = 0;
        }

    }
    page_id = 0;
    connection.query('CALL S_getPageIDAndGloabalization(' + page_id + ')', function (error, results, fields) {
        if (error) {
            res.json({
                status: error,
                message: 'there are some error with query'
            })
        } else {
            res.cookie('global_cache', results, {maxAge: 900000, httpOnly: true});

            res.redirect("/" + results[0][0].url);
        }
    });
    //////////--End getting globalization
}

module.exports.getNextPage = function (req, res) {

    ///////////////---------Getting Globalization in a Array--------------------

    var page_id = req.params.page_id;


    connection.query('CALL S_getPageIDAndGloabalization(' + page_id + ')', function (error, results, fields) {
        if (error) {
            res.json({
                status: error,
                message: 'there are some error with query'
            })
        } else {
            res.cookie('global_cache', results, {maxAge: 900000, httpOnly: true});

            res.redirect("/" + results[0][0].url);
        }
    });
    //////////--End getting globalization
}
module.exports.getRoomCategory = function (req, res) {
    connection.query('CALL `C_getRoomCategory`(' + req.params.h_id + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getRoomsByCategoryID = function (req, res) {

    connection.query("CALL `C_getRoomsByCategoryID`(" + req.params.c_id + ",'" + req.params.d_date + "');", function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getLastTenBookingTransactions = function (req, res) {

    connection.query("CALL `C_lastTenBookingTransactions`("+req.params.h_id+");", function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getBookindDetailBySummaryID = function (req, res) {

    connection.query("CALL `C_getBookindDetailBySummaryID`(" + req.params.s_id + ");", function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getRoomDetailByRoomID = function (req, res) {

    connection.query('CALL `C_getRoomDetailByRoomID`(' + req.params.r_id + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getRoomDetailByRoomID_temp = function (req, res) {

    connection.query('CALL `C_getRoomDetailByRoomID_temp`(' + req.params.r_id + ');', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getSearchBymob_bid = function (req, res) {

    connection.query('CALL `C_getSearchBymob_book_id`(' + req.params.bid + ');', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getReportPDF = function (req, res) {


    connection.query('CALL `C_getSearchBymob_book_id`(' + req.params.bid + ');', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getTodayActivity = function (req, res) {

    connection.query('CALL `C_getTodayActivity`();', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getToltipForRooms = function (req, res) {

    connection.query('CALL `C_getRoomDetailForToolTip`();', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}

module.exports.getStatupMethodLoader = function (req, res) {

    connection.query('CALL `S_getStatupMethodLoader`(2);', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getIsolateReport = function (req, res) {

    connection.query('CALL `C_get_isolate_report`();', function (error, results, fields) {
        {
            {
                if (error) {
                    res.json({
                        status: 'false',
                        data: error
                    });
                }
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getForms = function (req, res) {

    connection.query('CALL `getForm`(1);', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}

module.exports.getL_fieldByname = function (req, res) {

    connection.query("CALL `getL_FieldValue`('" + req.params.fname + "');", function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getFormsByID = function (req, res) {

    connection.query('CALL `getForm`(' + req.params.id + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}


module.exports.getTabs = function (req, res) {

    connection.query('CALL `getTabs`(' + req.cookies.user.id + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getGridviewHeaderById = function (req, res) {

    connection.query('CALL `getGridviewHeading`(' + req.params.g_id + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getGridviewById = function (req, res) {

    connection.query('CALL `getGridviewById`(' + req.params.g_id + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results,

                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getReports = function (req, res) {

    connection.query("CALL `C_Reports`(" + req.params.id + ",'" + req.params.f_date + "','" + req.params.t_date + "',"+req.params.h_id+");", function (error, result1, fields) {
        {
            console.log(result1)
            res.json({
                data: result1, status: 'true', error: error

            });


            //res.send(JSON.stringfy(results));
        }
    });
}
module.exports.getGridviewByClassId = function (req, res) {

    connection.query('CALL `getStudentGridByClass_id`(' + req.body.select_class + ',1);', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getHotelsList = function (req, res) {

    connection.query('CALL `C_getHotelsList`()', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getStudentDetailById = function (req, res) {

    connection.query('CALL `getStudentDetailById`(' + req.params.sid + ');', function (error, results, fields) {
        {
            {
                res.json({
                    status: 'true',
                    data: results
                });
            }


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.getPrintByinID = function (req, res) {

    connection.query("SELECT p.address AS 'address',p.id AS 'acc',i.installment_id AS 'id',p.name AS 'pname',i.loan_id AS 'lid',i.installment_amount AS 'iam',SUBSTRING(i.installment_deposit_date,1,10) as 'idate',u.name AS 'uname' FROM INSTALLMENTS i inner join LOANS l ON i.loan_id=l.loan_id INNER JOIN USERS u ON u.id=i.depositByID inner JOIN PEOPLE p on p.id=l.person_id where i.installment_id=" + req.params.lid, function (error, results, fields) {
        {

            var str = "";
            //console.log(results);
            str += "<div style='width: 300px;'><center><h3>SUS Serve</h3></center><table style='text-transform: uppercase; border: #0a0a0a groove thin; text-align: left;' border='2px' cellpadding='2px' cellspacing='0px'>";
            for (i in results) {
                var s = results[i].idate;

                str += "<tr ><th>Reciept No.</th><td>" + results[i].id + "</td></tr>"
                str += "<tr><th>Loaner Name</th><td>" + results[i].pname + "</td></tr>"
                str += "<tr><th>Acc/Loan ID</th><td>" + results[i].acc + "/" + results[i].lid + "</td></tr>"
                str += "<tr><th>Address</th><td>" + results[i].address + "</td></tr>"
                str += "<tr><th>Deposit Amount</th><td>" + results[i].iam + ".RS</td></tr>"
                str += "<tr><th>Deposit Amount</th><td>" + inWords(results[i].iam) + "</td></tr>"
                str += "<tr><th>Deposit Date</th><td>" + s + "</td></tr>"
                str += "<tr><th>Deposit By</th><td style='text-transform: uppercase;'>" + results[i].uname + "</td></tr>"

            }
            str += "</table><center><h6>**Thanks for Serving**</center></h6></div>"
            res.json({
                status: 'true',
                data: str
            });


            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchTagData = function (req, res) {

    connection.query('SELECT * FROM TAGS', function (error, results, fields) {
        {




            //res.send(JSON.stringify(results));
        }
    });
}
module.exports.fetchTrackData = function (req, res) {

    connection.query('SELECT * FROM TRACKS t INNER JOIN TRACKS_DETAIL td ON t.track_id=td.track_id INNER JOIN TRACK_TAGS tg on t.track_id=tg.track_id   ' +
        'INNER JOIN LANGUAGES l on t.track_languageID=l.languagesID INNER JOIN TRACK_CATEGORY tc ON t.track_categoryID=tc.category_id where  tc.isActive=1 and l.isActive=1', function (error, results, fields) {
        {

            res.json({
                data: results
            });

            //res.send(JSON.stringify(results));
        }
    });
}
//////////////////////////////Digit To Words////////////////////////
var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    console.log(n[3][0]);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? ' ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}