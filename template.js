const Json2csvParser = require('json2csv').Parser;

exports.get = function (req, res) {

    const fields = [
        'subject',
        'semester',
        'notebook.id',
        'notebook.title',
        'notebook.description',
        'notebook.video.title',
        'notebook.video.link',
        'notebook.career.title',
        'notebook.career.link'
        /*,
        'notebook.movie.title',
        'notebook.movie.link'*/
    ];

    const myData = { "notebook" : { "video" : { "title" : "video 16", "link" : "video url 16" }, "career" : { "title" : "career 16", "link" : "careel url 16" }, "movie" : { "title" : "movie 16", "link" : "movie url 16" }, "id" : 16, "title" : "Title 16", "description" : "Description 16" },  "subject" : "MB", "semester" : 2};

    const opts = { fields };

    try {
        //const csv = new jsontocsv(fields).parse;
        //const csv = parser.parse(myData);
        //const parser = new Json2csvParser({fields, delimiter: '\t'});
        const parser = new Json2csvParser(opts);
        const csv = parser.parse(myData);
        console.log(csv);       
        
        res.set("Content-Disposition", "attachment;filename=lessonsV3.csv");
        res.set("Content-Type", "application/octet-stream");
    
        res.send(csv);
       } catch (err) {
        console.error(err);
    } 
};