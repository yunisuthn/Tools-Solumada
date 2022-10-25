let id, currentPage;

getCoursList();

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "extract-date-pre": function (value) {
        date = value.split('/')
        return Date.parse(date[1] + '/' + date[0] + '/' + date[2])
    },
    "extract-date-asc": function (a, b) {
        return ((a<b) ? -1 : ((a > b) ? 1 : 0));
    },
    "extract-date-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0))
    }

})

let coursDataTable = $('#CoursTable').DataTable(
    {
        "ajax": {
            "url": "/allCours",
            "dataSrc": "",
        },
        "columns": [
            // {"data": "_id"},
            {"data": "name_Cours"},
            {"data": "professeur", 'render': function(professeur){ if(!professeur){ return ""; }else{ return professeur; }}},
            {"data": "date_Commenc", 'render': function(date_Commenc){ 
                if(!date_Commenc){ return ""; }else{ 
                    var date = new Date(date_Commenc).toLocaleDateString("fr");
                    return date; 
                }}},
            {"data": "nbrePart"},
            {"data": "type"},
            {"data": "description", 'render': function(description){ if(!description){ return ""; }else{ return description; }}},
            {"defaultContent": "\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm rounded mx-1 btn-warning btnUpdateCours' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm rounded btn-danger btnDeleteCours' ><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ],
        "columnDefs": [ 
            {
            type : "extract-date",
            targets: 2,
            } 
        ],
        "scrollX": true,
    }
);

$('#btnCreateCours').on('click', function()
{
    $('#largeModalLabelAdd').css('display', 'block');
    $('#largeModalLabelUpdate').css('display', 'none');
});


function searchOnDatatable(datatable, value)
{
    datatable.search(value).draw();
}

// Function to Save new Cours
$("#saveCours").on("click", function()
{
    AddCourData = {
            nameCours: $('#nameCours').val(),
            date_Commenc: $('#date_Commenc').val(),
            professeur: $('#professeur').val(),
            typeCours: $('#typeCours').val(),
            description : $('#description_add').val()
        }

    $.ajax({
        url: '/addcours',
        method: 'post',
        data: AddCourData,
        success: function(response)
        {
            if(response == 'error')
            {
                $('#errorAddCour').css('display', 'block');
                $('#errorAddCour').html('<strong>'+response+'</strong>' + ': Cours name already exist');
            }
            else {
                resetCoursForm(action='addCours');
                getCoursList();
                responsetxt = response + ' Saved successfully';
                Swal.fire(
                    'Cours Saved',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        coursDataTable.ajax.reload(null, false);
                        searchOnDatatable(datatable=coursDataTable, value=response);
                        setTimeout(function() { 
                            coursDataTable.search('').draw();
                            coursDataTable.page(currentPage).draw('page');
                        }, 3000);
                    }
                });
            }
        }
    });
});

var updC = ""
// Function to get Cours from backend and insert it at Modal Update Cours
$(document).on('click', '.btnUpdateCours', function()
{
    column = $(this).closest('tr');
    var name_Cours = column.find('td:eq(0)').text();
    updC = name_Cours
    //console.log("updC ", updC);
    $.ajax(
            {
                url : "/getCours",
                method: 'post',
                dataType: 'json',
                data: {name_Cours: name_Cours},
                success: function(cours)
                    {
                        console.log("cours.nomProf", cours.nomProf);
                        $('#cours_id').val(cours._id);
                        $('#nameCours_update').val(cours.name_Cours);
                        $('#typeCours_update').val(cours.type);
                        $('#description_update').val(cours.description);
                        $('#professeur_update').val(cours.nomProf);
                        var date = new Date(cours.date_Commenc).toLocaleDateString("fr");
                        date = date.split('/').reverse().join('-');
                        $('#date_Commenc_update').val(date);
                    },
                error: function(err){
                        //alert(JSON.stringify(err));
                        console.log("err", JSON.stringify(err));
                }
            }
        )
});

// Function to Save the Update on Cours
$(document).on('click', '#saveUpdateCours', function(){
    formUpdateCoursData = {
        id : $('#cours_id').val(),
        coursAncien: updC,
        name_Cours: $('#nameCours_update').val(),
        date_Commenc: $('#date_Commenc_update').val(),
        typeCours: $('#typeCours_update').val(),
        professeur: $('#professeur_update').val(),
        description :$('#description_update').val()
    }

    $.ajax({
        url: '/updatecours',
        method: 'post',
        data : formUpdateCoursData,
        success : function(response){
            if(response == 'error'){
                $('#errorUpdateUser').css('display', 'block');
                $('#errorUpdateUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                resetCoursForm(action='updateCours');
                responsetxt = "cours " + response + ' Updated successfully';
                getCoursList();
                Swal.fire(
                    'Cours Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        coursDataTable.ajax.reload(null, false);
                        searchOnDatatable(datatable=coursDataTable, value=response);
                        setTimeout(function() { 
                            coursDataTable.search('').draw();
                            coursDataTable.page(currentPage).draw('page');
                        }, 3000);
                    }
                })
            }
        },
        error: function(response){
            //alert(JSON.stringify(response));
            console.log("error", JSON.stringify(response));
        }
    })
});

// Function to Delete Cours
$(document).on('click', '.btnDeleteCours', function()
{
    var column = $(this).closest('tr');
    var name_Cours = column.find('td:eq(0)').text();
    $.ajax(
        {
            url : "/getCours",
            method: 'post',
            dataType: 'json',
            data: {name_Cours: name_Cours},
            success: function(cours)
            {
                    var coursName = cours.name_Cours
                    var txt = "Are you sure to delete " + coursName +"?";
                    Swal.fire({
                            title: 'Delete Cours',
                            text: txt,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'red',
                            cancelButtonColor: 'green',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/dropcours',
                                    method: 'post',
                                    data: { name_Cours: coursName },
                                    success: function(coursName){

                                        responsetxt = "Cours " + coursName + ' Deleted successfully';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1700
                                        });
                                        coursDataTable.ajax.reload(null, false);
                                        getCoursList();
                                        coursDataTable.search('').draw();
                                        coursDataTable.page(currentPage).draw('page');
                                    },
                                    error: function(response){
                                        Swal.fire({
                                            position: 'top-center',
                                            icon: 'error',
                                            title: response,
                                            showConfirmButton: false,
                                            timer: 1700
                                        });
                                    }
                                })
                            }
                        })
                }
        }
    )
});



// Reset the Cours Modal Form
function resetCoursForm(action)
{
    $('#closeCoursModal').click();
    switch(action){
        case 'addCours':
            $('#nameCours').val('');
            $('#date_Commenc').val('');
            $('#typeCours').val('');
            $('#professeur').val('');
            $('#errorAddCour').css('display', 'none');
            $('#closeCoursModal').click();
            break;
        case 'updateCours':
            $('#cours_id').val('');
            $('#nameCours_update').val('');
            $('#date_Commenc_update').val('');
            $('#typeCours_update').val('');
            $('#professeur_update').val('');
            $('#errorUpdateCour').css('display', 'none');
            $('#closeAddCoursModal').click();
            break;
    }
}


// Get all cours List from the Database and diplay asyncronously on menu
function getCoursList()
{
    $.ajax(
        {
            url: '/allCoursLists',
            method: 'get',
            dataType: 'json',
            success: function(data)
                {
                    $('#dropdownCoursObligatory').empty();
                    $('#dropdownCoursOptional').empty();

                    obligatoryCours = data.listcourOblig;
                    optionalCours =data.listcourFac;

                    $.each(obligatoryCours, function(key, value)
                    {
                        $("#dropdownCoursObligatory").append(`<li class="sub-menu-item"><i class="fa fa-arrow-circle-o-right"></i><a href="/listeCours/${value.name_Cours}"</a>${value.name_Cours}</li>`);
                    });

                    $.each(optionalCours, function(key, value)
                    {
                        $("#dropdownCoursOptional").append(`<li class="sub-menu-item"><i class="fa fa-arrow-circle-o-right"></i><a href="/listeCours/${value.name_Cours}"</a>${value.name_Cours}</li>`);
                    });
                },
            error: function(error)
                {
                    //alert(error);
                    console.log("error", error);
                }      
        }
    );
}