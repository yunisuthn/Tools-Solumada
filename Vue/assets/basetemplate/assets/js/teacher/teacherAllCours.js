let coursTable = $("#teacherDataTable").DataTable(
    {
        "ajax":{
            "url":"/allCoursTeacher",
            "dataSrc": ""
        },
        "columns":[
            {"data": "name_Cours"},
            {"data": "description", 'render': function (description) {
                if (!description) {
                    return ""
                } else {
                    return description
                }
            }},
            {"data": "date_Commenc", "render": function (date_Commenc) {
                //console.log("date_Commenc ", date_Commenc);
                if (date_Commenc == "01/01/1970") {
                    return ""
                } else {
                    return date_Commenc
                }
            }},
            {"data": "nbrePart"},
            {
                "defaultContent": `\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 px-2 rounded mx-1 btn-sm btn-warning btnUpdateCours'  data-toggle='modal' data-target='#UpdateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                </div>\
                                `
            }
        ], 
        "scrollX": true,
    }
)

var name_cours = ""
var description = ""
var date_cours = ""
var id_cours = ""
var ancien_cours = ""
$(document).on('click', '.btnUpdateCours', function () {
    var column = $(this).closest('tr');
    name_cours = column.find('td:eq(0)').text();
    description = column.find('td:eq(1)').text();
    date_cours = column.find('td:eq(2)').text();
    ancien_cours = name_cours
    var listeCours = {
        cours: name_cours,
        description: description,
        date: date_cours,
    }

    date = date_cours.split("/").reverse().join("-")
    $("#nameCoursUpdat").val(name_cours)
    $("#descriptionUpdate").val(description)
    $("#updatedate").val(date)
    $.ajax({
        url:'/getCoursUpdate',
        method: 'post',
        data : listeCours,
        dataType: 'json',
        success: function (res) {
            id_cours = res._id
        }
    })
})

$("#saveUpdateCours").on('click', function () {
    var cours = $('#nameCoursUpdat').val();
    var descrip = $("#descriptionUpdate").val();
    var date_deb = $("#updatedate").val()
    var dataupdat = {
        cours: cours,
        descrip: descrip,
        date: date_deb,
        id: id_cours,  
        ancien_cours: ancien_cours    
    }


    $.ajax({
        url: "/save_update_cours",
        method: "post",
        data: dataupdat,
        success: function (res) {
            if(res === "success"){
                $("#teacherDataTable").DataTable().ajax.reload(null, false);
                Swal.fire(
                    'Cours saved',
                    'Cours update successfully !',
                    'success',
                    {
                        confirmButtonText: 'Ok',
                    }
                )
                $('#nameCoursUpdat').val("");
                $("#descriptionUpdate").val("");
                $("#updatedate").val("")
                $("#closeUpdateCours").click()

            } else {
                Swal.fire(
                    'Error',
                    'Please, complete the name of the cours',
                    'info',
                    {
                        confirmButtonText: 'OK'
                    }
                )
            }
            
        }
    })
})