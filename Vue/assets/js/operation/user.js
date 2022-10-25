let column, id, usernam, m_code, num_agent, type_util;

let currentPage, userIdToDelete;

//liste user 
//====
let userDataTable = $("#userDataTable").DataTable({
    'ajax': {
        'url': '/allUser',
        'dataSrc': '',
    },
    'columns': [
                    {'data': 'mcode'},
                    {'data': 'name'},
                    {'data': 'email'},
                    {'data': 'typeUtil'},
                    {'defaultContent': "\
                                        <div class='d-flex justify-content-center'>\
                                            <button type='button'  class='btn px-2 btn-sm btn-warning rounded mx-1 btnUpdateUser' type='button' data-toggle='modal' data-target='#modalUpdateAgent' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                            <button type='button'  class='btn px-2 btn-sm btn-danger rounded btnDeleteUser'><i class='fa fa-trash'></i></button>\
                                        </div>\
                                        "
                    }
                ],
    'select':  { 'style': 'multi' },
    'order': [[0, 'asc']],
    "scrollX": true,

});

//Function to filter table by the new  perofrmed action value

function searchOnDatatable(datatable, value)
{
    datatable.search(value).draw();
}

// $('#deleteSelectedUser').on('click', function(e)
//     {
//         var rows_selected = userDatatable.column(0).checkboxes.selected();
//         usersIdToDelete = new Array();
//         currentPage = parseInt(userDatatable.page.info().page);

//         $.each(rows_selected, function(rowId, userId)
//         {
//             usersIdToDelete.push(userId);
//         });

//         if(usersIdToDelete.length > 0)
//         {
//             formDeleteMultiple = { userlistToDelete: usersIdToDelete };
//             Swal.fire(
//                 {
//                     title: 'Are you sure to delete all?',
//                     text: "This action will remove all selected",
//                     icon: 'warning',
//                     showCancelButton: true,
//                     confirmButtonColor: 'red',
//                     cancelButtonColor: 'green',
//                     confirmButtonText: 'Yes, delete all!'
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         $.ajax(
//                             {
//                                 url: "/dropusers",
//                                 method: 'post',
//                                 data: formDeleteMultiple,
//                                 success: function(response)
//                                     {
//                                         if(response === 'success')
//                                         {
//                                             Swal.fire(
//                                                 {
//                                                     position: 'center',
//                                                     icon: 'success',
//                                                     title: 'Selected User are deleted successfuly!',
//                                                     showConfirmButton: false,
//                                                     timer: 1500
//                                                 });
//                                             userDatatable.ajax.reload(null, false);
//                                             userDatatable.page(currentPage).draw('page');
//                                         } else {
//                                             Swal.fire(
//                                                 {
//                                                     icon: 'error',
//                                                     title: 'Oops...',
//                                                     text:"Can't delete",
//                                                 });
//                                             userDatatable.ajax.reload(null, false);
//                                             userDatatable.page(currentPage).draw('page');
//                                         }
//                                     },
//                                 error: function(response)
//                                     {
//                                         Swal.fire(
//                                             {
//                                                 icon: 'error',
//                                                 title: 'Oops...',
//                                                 text: 'Something went wrong!',
//                                             });
//                                         userDatatable.ajax.reload(null, false);
//                                         userDatatable.page(currentPage).draw('page');
//                                     }
//                             }
//                         )
//                     }
//                 });
//         } else { 
//             Swal.fire('Please, check on table all list you want to perform this action')
//         }
      
        
//     }
// );

$('#btnCreateUser').on('click', function()
{
    $('#largeModalLabelAdd').css('display', 'block');
    $('#largeModalLabelUpdate').css('display', 'none');
});

//=======start
//Save user
$('#saveUser').on("click", function()
{
    //currentPage = parseInt(userDatatable.page.info().page);
    var typeUtil = $('#type_util').val()
    var mcode = ""
    if (typeUtil == 'TL') {
        mcode = $('#m-codeTL').val()
    } else {
        mcode = $('#m-code').val()
    }
    var name = $('#name').val()
    var email = $('#mail').val()
    formAddData = {
            type_util: typeUtil,
            mcode: mcode,
            name: name,
            email: email,
        }

    $.ajax({
        url: '/signup',
        method: 'post',
        data: formAddData,
        success: function(response)
        {
            if(response == 'error')
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cet utilisateur existe déjà'
                })
            }
            else 
            {
                resetForm(action='add');
                responsetxt = response + ' sauvegarder avec succès';
                Swal.fire(
                    'Utilisateur sauvegarder',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    $('#cancelAgent').click();
                    window.location = "/user"
                    // if (result.isConfirmed) {
                    //     userDatatable.ajax.reload(null, false);
                    //     searchOnDatatable(datatable=userDatatable, value=response);
                    //     setTimeout(function() { 
                    //         userDatatable.search('').draw();
                    //         userDatatable.page(currentPage).draw('page');
                    //     }, 3000);
                    // }
                })
            }
        }
    });
});


$('#cancelAgent').on("click", function () {
    videForm()
})

function videForm() {
    $('#type_util').val("")
    $('#m-code').val("")
    $('#name').val("")
    $('#mail').val("")
}

var ancien_mcod = ""
var emailA = ""
var typeA = ""
var nameA = ""
$(document).on('click', '.btnUpdateUser', function(){
    var column = $(this).closest('tr');
    emailA = column.find('td:eq(2)').text();
    ancien_mcod = column.find('td:eq(0)').text();
    typeA = column.find('td:eq(3)').text()
    nameA = column.find('td:eq(1)').text()

    $("#emailUpdat").val(emailA);
    $('#type_utilUpdat').val(typeA);
    $('#nameUpdat').val(nameA);
    $('#mcodeUpdat').val(ancien_mcod);
});

$('#m-codeTL').css('display', 'none')
//on change type utilisateur
$('#type_util').on('change', function () {
    var typeUtil = $('#type_util').val();
    if (typeUtil == "TL") {
        $('#m-code').css("display", 'none')
        $('#m-codeTL').css('display', 'block')
        $.ajax({
            url: "/allTL",
            method: 'get',
            success: function (res) {
                // console.log("res", res);
            }
        })
    }else{
        $('#m-codeTL').css('display', 'none')
        $('#m-code').css("display", 'block')

    }
})


//on change m-code TL
$(document).on('change', "#m-codeTL", function () {
    var user = {
        mcode: $("#m-codeTL").val().trim()
    }
    // console.log("user", user);
    $.ajax({
        url: "/getOneTL",
        data :  user,
        method: "post",
        success : function (res) {
            // console.log("res ", res);
            $('#name').val(res.name)
        }
    })
})

//==============end 
$(document).on('click', '#saveUpdatUser', function(){
    // currentPage = parseInt(userDatatable.page.info().page);
    // console.log("currentPage", currentPage);
    formUpdateData = {
        //id : $('#user_id').val(),
        username: $('#nameUpdat').val(),
        email: $('#emailUpdat').val(),
        type_util: $('#type_utilUpdat').val(),
        mcode: $('#mcodeUpdat').val(),
        ancien_mcod: ancien_mcod,

        nameA: nameA,
        typeA: typeA,
        emailA: emailA
    }

    $.ajax({
        url: '/updateUser',
        method: 'post',
        data : formUpdateData,
        success : function(response){
            if(response == 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cet utilisateur existe déjà'
                })     
            } else {
                $('#closeModalUpdate').click();
                resetForm(action='update');
                responsetxt = response + ' mis à jour avec succès';
                Swal.fire(
                    "Mis à jour d'utilisateur",
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        window.location = '/user'
                        // userDatatable.ajax.reload(null, false);
                        // searchOnDatatable(datatable=userDatatable, value=response);
                        // setTimeout(function() { 
                        //     userDatatable.search('').draw();
                        //     userDatatable.page(currentPage).draw('page');
                        // }, 3000);
                    }
                });                
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    })
});

// Function to delete User
$(document).on('click', '.btnDeleteUser', function()
{
    column = $(this).closest('tr');
    mcode = column.find('td:eq(0)').text();
    $.ajax(
        {
            url : "/getOneUser",
            method: 'post',
            dataType: 'json',
            data: {mcode: mcode},
            success: function(user){
                // console.log("userONe", user);
                    var name = user.name
                    var txt = "Etes-vous sûr de vouloir supprimer " + name +"?";
                        Swal.fire({
                            title: 'Supprimer '+name,
                            text: txt,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'red',
                            cancelButtonColor: 'green',
                            confirmButtonText: 'Oui'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/deleteUser',
                                    method: 'post',
                                    data: { mcode: mcode },
                                    success: function(){
                                        responsetxt = name + ' supprimer avec succès';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                        window.location = "/user"
                                        //userDataTable.ajax.reload(null, false);
                                        // userDatatable.page(currentPage).draw('page');
                                    },
                                    error: function(response){
                                        Swal.fire({
                                            position: 'top-center',
                                            icon: 'error',
                                            title: response,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                    }
                                })
                            }
                        })
                },
            error: function(err){
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: err
                });
            }
        }
    )
});

// Function to reset all Modal form
function resetForm(action)
{
    switch(action){
        case 'add':
            $('#name').val('');
            $('#email').val('');
            $('#m_code').val('');
            $('#num_agent').val('');
            $('#user_type').val('');
            $('#errorAddUser').css('display', 'none');
            break;
        case 'update':
            $('#name_update').val('');
            $('#email_update').val('');
            $('#m_code_update').val('');
            $('#num_agent_update').val('');
            $('#user_type_update').val('');
            $('#errorUpdateUser').css('display', 'none');
            break;
    }
}