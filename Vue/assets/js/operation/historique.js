// var historyDataTable = $('#historyDataTable').DataTable(
//     {
//         "ajax": {"url": "/allHistory", "dataSrc": ""},
//         "columns": [
//             {'data': 'user'},
//             {'data': "model"},
//             {'data': 'old', 'render': function (old) {
//                 var jsonD = JSON.stringify(old)
//                 console.log("jsonD", JSON.parse(jsonD));

//                 var dataPars = JSON.parse(jsonD)
//                 var c = ""
//                 for (let x in dataPars) {
//                     //console.log(x + ": "+ dataPars[x])
//                     c = x
//                      $(`.${x}`).append(`<option value="${x}">${dataPars[x]}</option>`)
//                  }
//                  var returnD = `\
//                      <select name="" id="" class="form-control ${old.lenth}">
                     
//                      </select>
//                  \
//                  `
//                 //  var returnD = `\
//                 //     <li>
//                 //     ${jsonD}
//                 //     </li>
//                 //     \
//                 //     `
//                 return  returnD
//                 //return jsonD
//             }},
//             {'data': "new", 'render': function (old) {
//                 var json = JSON.stringify(old)
//                 return  json
//             }},
//         ]
//     }
// )

// <input type="hidden" name="" id="typeUtil" value= "<%= type_util %> ">


// [
//     {'data': 'user'},
//     {'data': "model"},
//     // {
//     //     "data": "old",
//     //     "render":function(old)//, type, row)
//     //     {
//     //       return old//'<button id="actionButton" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Aktion</button><div class="dropdown-menu" aria-labelledby="actionButton"><a class="dropdown-item" data-toggle="modal" data-target="#ticketModal'+data[0]+'" href="#">Ticket öffnen</a><a class="dropdown-item" href="#" onclick="reopenTicket('+data[0]+')">Ticket neu öffnen.</a><a class="dropdown-item" href="#" onclick="closeTicket('+data[0]+')">Ticket schließen</a><a class="dropdown-item" href="#">Ticket löschen</a></div>';
//     //     },
//     //     "targets": -1
//     // }
//     {'data': 'old', 'render': function (old) {
//         var json = JSON.stringify(old)
//         return  json
//         // return ({
//         //     'defaultContent': `\
//         //             <button type='button' class='btn px-2 px-2 rounded mx-1 btn-sm btn-warning btnUpdateInventaire' data-toggle='modal' data-target='#modalUpdateInventaire' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                    
//         //     `
//         // })
//     }},
//     {'data': "new", 'render': function (old) {
//         var json = JSON.stringify(old)
//         return  json
//     }},
// ]