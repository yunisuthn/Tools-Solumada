let column, id, usernam, m_code, num_agent, type_util;

let currentPage, userIdToDelete;

let userDatatable = $("#userTable").DataTable({
    'ajax': {
        'url': '/allUsers',
        'dataSrc': '',
    },
    'columns': [
                    {'data': '_id'},
                    {'data': 'username'},
                    {'data': 'name'},
                    {'data': 'm_code'},
                    {'data': 'num_agent'},
                    {'data': 'type_util'},
                    {'defaultContent': "\
                                        <div class='d-flex justify-content-center'>\
                                            <button type='button'  class='btn px-2 btn-sm btn-warning rounded mx-1 btnUpdateUser' type='button' data-toggle='modal' data-target='#UserUpdateModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                            <button type='button'  class='btn px-2 btn-sm btn-danger rounded btnDeleteUser'><i class='fa fa-trash'></i></button>\
                                        </div>\
                                        "
                    }
                ],
    'columnDefs':  [
                        { 'targets': 0, 'className': 'select-checkbox', 'checkboxes':  { 'selectRow': true } },
                        { 'targets': 1, 'width': '20%' },
                        { 'targets': 2, 'width': '20%' },
                        { 'targets': 3, 'width': '15%' },
                        { 'targets': 4, 'width': '15%' }
                    ],
    'select':  { 'style': 'multi' },
    'order': [[0, 'asc']],
    "scrollX": true,

});

// Function to filter table by the new  perofrmed action value
function searchOnDatatable(datatable, value)
{
    datatable.search(value).draw();
}

$('#deleteSelectedUser').on('click', function(e)
    {
        var rows_selected = userDatatable.column(0).checkboxes.selected();
        usersIdToDelete = new Array();
        currentPage = parseInt(userDatatable.page.info().page);

        $.each(rows_selected, function(rowId, userId)
        {
            usersIdToDelete.push(userId);
        });

        if(usersIdToDelete.length > 0)
        {
            formDeleteMultiple = { userlistToDelete: usersIdToDelete };
            Swal.fire(
                {
                    title: 'Are you sure to delete all?',
                    text: "This action will remove all selected",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'red',
                    cancelButtonColor: 'green',
                    confirmButtonText: 'Yes, delete all!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax(
                            {
                                url: "/dropusers",
                                method: 'post',
                                data: formDeleteMultiple,
                                success: function(response)
                                    {
                                        if(response === 'success')
                                        {
                                            Swal.fire(
                                                {
                                                    position: 'center',
                                                    icon: 'success',
                                                    title: 'Selected User are deleted successfuly!',
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                            userDatatable.ajax.reload(null, false);
                                            userDatatable.page(currentPage).draw('page');
                                        } else {
                                            Swal.fire(
                                                {
                                                    icon: 'error',
                                                    title: 'Oops...',
                                                    text:"Can't delete",
                                                });
                                            userDatatable.ajax.reload(null, false);
                                            userDatatable.page(currentPage).draw('page');
                                        }
                                    },
                                error: function(response)
                                    {
                                        Swal.fire(
                                            {
                                                icon: 'error',
                                                title: 'Oops...',
                                                text: 'Something went wrong!',
                                            });
                                        userDatatable.ajax.reload(null, false);
                                        userDatatable.page(currentPage).draw('page');
                                    }
                            }
                        )
                    }
                });
        } else { 
            Swal.fire('Please, check on table all list you want to perform this action')
        }
      
        
    }
);

$('#btnCreateUser').on('click', function()
{
    $('#largeModalLabelAdd').css('display', 'block');
    $('#largeModalLabelUpdate').css('display', 'none');
});


$('#saveUser').on("click", function()
{
    currentPage = parseInt(userDatatable.page.info().page);
    formAddData = {
            name: $('#name').val(),
            email: $('#email').val(),
            m_code: $('#m_code').val(),
            num_agent: $('#num_agent').val(),
            type_util: $('#type_util').val(),
        }

    $.ajax({
        url: '/addemp',
        method: 'post',
        data: formAddData,
        success: function(response)
        {
            if(response == 'error')
            {
                $('#successAddUser').css('display', 'none');
                $('#errorAddUser').css('display', 'block');
                $('#errorAddUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            }
            else {
                resetForm(action='add');
                responsetxt = response + ' Saved successfully';
                Swal.fire(
                    'User Saved',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    $('#closeModal').click();
                    if (result.isConfirmed) {
                        userDatatable.ajax.reload(null, false);
                        searchOnDatatable(datatable=userDatatable, value=response);
                        setTimeout(function() { 
                            userDatatable.search('').draw();
                            userDatatable.page(currentPage).draw('page');
                        }, 3000);
                    }
                })
            }
        }
    });
});

var ancien_type_util = ""
$(document).on('click', '.btnUpdateUser', function(){
    column = $(this).closest('tr');
    email = column.find('td:eq(1)').text();
    $.ajax(
            {
                url : "/getuser",
                method: 'post',
                dataType: 'json',
                data: {email: email},
                success: function(user){
                    ancien_type_util = user.type_util
                        $('#user_id').val(user._id);
                        $('#name_update').val(user.name);
                        $('#email_update').val(user.username);
                        $('#m_code_update').val(user.m_code);
                        $('#num_agent_update').val(user.num_agent);
                        $('#type_util_update').val(user.type_util);
                    },
                error: function(err){
                        alert(JSON.stringify(err));
                }
            }
        )

});


$(document).on('click', '#saveUpdateUser', function(){
    currentPage = parseInt(userDatatable.page.info().page);
    console.log("currentPage", currentPage);
    formUpdateData = {
        id : $('#user_id').val(),
        username: $('#name_update').val(),
        email: $('#email_update').val(),
        m_code: $('#m_code_update').val(),
        num_agent: $('#num_agent_update').val(),
        type_util: $('#type_util_update').val(),
        ancien_type_util: ancien_type_util
    }

    $.ajax({
        url: '/updateuser',
        method: 'post',
        data : formUpdateData,
        success : function(response){
            if(response == 'error'){
                $('#errorUpdateUser').css('display', 'block');
                $('#errorUpdateUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                $('#closeModalUpdate').click();
                resetForm(action='update');
                responsetxt = response + ' Updated successfully';
                Swal.fire(
                    'User Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        userDatatable.ajax.reload(null, false);
                        searchOnDatatable(datatable=userDatatable, value=response);
                        setTimeout(function() { 
                            userDatatable.search('').draw();
                            userDatatable.page(currentPage).draw('page');
                        }, 3000);
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
    email = column.find('td:eq(1)').text();
    $.ajax(
        {
            url : "/getuser",
            method: 'post',
            dataType: 'json',
            data: {email: email},
            success: function(user){
                    var user_email = user.username
                    var txt = "Are you sure to delete " + user_email +"?";
                        Swal.fire({
                            title: 'Delete User',
                            text: txt,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'red',
                            cancelButtonColor: 'green',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/dropuser',
                                    method: 'post',
                                    data: { email: user_email },
                                    success: function(response){
                                        responsetxt = user_email + ' Deleted successfully';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                        userDatatable.ajax.reload(null, false);
                                        userDatatable.page(currentPage).draw('page');
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