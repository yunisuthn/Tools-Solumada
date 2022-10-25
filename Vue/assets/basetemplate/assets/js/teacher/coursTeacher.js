var coursNameTeacher = $("#courNameTeacher").text();
var groupMemberList = [];
var groupMemberPresentList = [];
var groupMemberAbsentList = [];

var parcoursDataTable = $('#parcoursDatatable').DataTable(
    {
        "ajax": { "url": `/teacherParcours/${coursNameTeacher}`, "dataSrc": "" },
        "columns": [
            {'data': 'date', 'render': function(date){ if(!date){ return ""; }else{ return date; } }},
            {'data': 'start_time', 'render': function(start_time){ if(!start_time){ return ""; }else{ return start_time; } }},
            {'data': 'end_time', 'render': function(end_time){ if(!end_time){ return ""; }else{ return end_time; } }},
            {'data': 'group_name', 'render': function(group_name){ if(!group_name){ return ""; }else{ return group_name; } }},
            {'data': 'present', 'render': function(present){
                        var presenceOptionData = '';
                        present.forEach(element => {
                            presenceOptionData = presenceOptionData + `<option class="presentMember" value="${element}">${element}</option>`;
                        });
                        presentOptions = `<select data-placeholder="Choose One" class="standartselect form-control" tabindex="1">${presenceOptionData}</select>`;
                        return presentOptions;
                    }
        },
            {'data': 'absent', 'render': function(absent)
            {
                var absentOptionData = '';
                absent.forEach(element => {
                    absentOptionData = absentOptionData + `<option value="${element}">${element}</option>`
                });
                absentOptions = `<select data-placeholder="" class="standartselect form-control" tabindex="1">${absentOptionData}</select>`;
                return absentOptions;
            }
        },
            {"defaultContent": "\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours'  class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteParcours' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ],
        "scrollX": true,
    }
);

$("#addParcours").on('click', function(){
    $("#dateParcours").val("");
});

function searchOnDatatable(datatable, value)
{
    datatable.search(value).draw();
}

$("#groupParcours").on('change', function(){
    var groupMemberList = [];
    var groupName = $("#groupParcours").val();
    var groupMemberData = { gpe: groupName, cours:coursNameTeacher };
    $.ajax({
        url: "/presence",
        data: groupMemberData,
        method: "post",
        success: function(response){ 
            $("#presentParcours").empty();
            
            response.forEach(element => {
                groupMemberList.push(element.username);
                $('#presentParcours').append(`<option value="${element.username}">${element.username}</option>`);
            });
            
        },
        error: function(error){ alert(JSON.stringify(error)); }
    });
    alert(JSON.stringify(groupMember));

});


$("#saveParcours").on('click', function()
{
    var dateParcours = $("#dateParcours").val();
    var startAtParcours = $("#timeStartParcours").val();
    var endAtParcours = $("#timeEndParcours").val();
    var groupNameParcours = $("#groupParcours").val();
    var presentParcours = $("#presentParcours").val();
    var absentParcours = [];
    groupMemberList.forEach(member => {
        if (presentParcours.indexOf(member) === -1) {absentParcours.push(member);}
    });

    var parcoursData = {
        dateNewParcours: dateParcours,
        timestartAt: startAtParcours,
        timeEndAt: endAtParcours,
        cours: coursNameTeacher,
        groupParcoursName: groupNameParcours,
        present: presentParcours,
        absent: absentParcours
    }

    // alert(JSON.stringify(parcoursData));

    $.ajax({
        url: "/Teacheraddparcours",
        method: "post",
        data: parcoursData,
        success: function(res) 
        { 
            if(res === "exist"){
                Swal.fire(
                    'Error',
                    "this parcours already exist!",
                    'info',
                    {
                    confirmButtonText: 'Ok',
                });
                
            }else{
                $("#parcoursDatatable").DataTable().ajax.reload(null, false);
                Swal.fire(
                    'Parcours Saved',
                    'New parcours saved successfully!',
                    'success',
                    {
                    confirmButtonText: 'Ok',
                });
                clearParcoursForm('add');
            }
        },
        error: function(err) { 
            Swal.fire(
                'Error',
                `${err}`,
                'error',
                {
                confirmButtonText: 'Ok',
            })
         }
    });
});

// Update parcours
$(document).on('click', '.btnUpdateParcours', function(){

    var column = $(this).closest('tr');
    var date = column.find('td:eq(0)').text();
    var startTimeDelete = column.find('td:eq(1)').text();
    var endTimeDelete = column.find('td:eq(2)').text();
    var groupNameDelete = column.find('td:eq(3)').text();
    parcoursUpdateData = {
        cours: coursNameTeacher,
        date: date,
        heureStart: startTimeDelete,
        heureFin: endTimeDelete,
        groupe: groupNameDelete,
    }

    $.ajax({
        url: '/getParcours',
        method: 'post',
        data: parcoursUpdateData,
        dataType: 'json',
        success: function(res){
            var data = JSON.parse(JSON.stringify(res));
            $("#presentParcoursUpdate").find("option").remove().end();
            $("#groupUpdateParcours").val(data[0]._id.groupe);
            var date = data[0]._id.date;
            date = date.split("/").reverse().join("-");
            $("#dateUpdateParcours").val(date);
            $("#timeStartUpdateParcours").val(data[0]._id.heureStart);
            $("#timeEndUpdateParcours").val(data[0]._id.heureFin);
            var users = data[0].tabl;
            
            users.forEach(user =>{
                if(user.presence === true)
                {
                    var option = `<option value="${user.id}" selected>${user.user}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }else{
                    var option = `<option value="${user.id}">${user.user}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }
            });
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
    });
});

$("#saveUpdateParcours").on('click', function(){
    var gpnmUpdate = $("#groupUpdateParcours").val();
    var dateUpdate = $("#dateUpdateParcours").val();
    var timeStartUpdate = $("#timeStartUpdateParcours").val();
    var timeEndUpdate = $("#timeEndUpdateParcours").val();
    var presentParcours = $("#presentParcoursUpdate").val();
    var absentParcours = [];
    var updateMemberList = [];

    $("#presentParcoursUpdate option").each(function(){
        var options = $(this).val();
        if (options != ''){ updateMemberList.push(options); }
    });
    updateMemberList.forEach(member => {
        if (presentParcours.indexOf(member) === -1) {absentParcours.push(member);}
    });

    var parcoursDataUpdate = {
        dateNewParcours: dateUpdate,
        timestartAt: timeStartUpdate,
        timeEndAt: timeEndUpdate,
        // cours: cour_name,
        groupParcoursName: gpnmUpdate,
        present: presentParcours,
        absent: absentParcours
    }
    $.ajax({
        url: "/update_parcoursajax",
        method: "post",
        data: parcoursDataUpdate,
        success: function(res){
            $("#parcoursDatatable").DataTable().ajax.reload(null, false);
            clearParcoursForm("update");
            Swal.fire(
                'Parcours Saved',
                'Parcours updated successfully!',
                'success',
                {
                confirmButtonText: 'Ok',
            });

        },
        error: function(err){
            Swal.fire(
                'Error',
                `Error occured when perform this action!`,
                'error',
                {
                confirmButtonText: 'Ok',
            })
        }
    });
});

// delete parcours
$(document).on('click', '.btnDeleteParcours', function(){
    Swal.fire({
        title: 'Delete Parcours',
        text: "Are you sure do delete this parcours?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var column = $(this).closest('tr');
            var date = column.find('td:eq(0)').text();
            var startTimeDelete = column.find('td:eq(1)').text();
            var endTimeDelete = column.find('td:eq(2)').text();
            var groupNameDelete = column.find('td:eq(3)').text();
            // var presentDelete = column.find('td:eq(4)').find("select").text();
            // var absentDelete = column.find('td:eq(5)').find("select").text();
            // var presentslistfiltered = [];
            // var absentslistfiltered = [];
            
            // if (presentDelete != "")
            // {
            //     presentDelete = presentDelete.split(".com");
            //     presentDelete.forEach(item =>{
            //         var newItem = '' + item + '.com';
            //         presentslistfiltered.push(newItem);
            //     });
            //     presentslistfiltered.splice(-1);
            // }

            // if (absentDelete != "")
            // {
            //     absentDelete = absentDelete.split(".com");
            //     absentDelete.forEach(item =>{
            //         var newItem = '' + item + '.com';
            //         absentslistfiltered.push(newItem);
            //     });
            //     absentslistfiltered.splice(-1);
            // }
            date = date = date.split('/').reverse().join('-');
            parcoursDeleteData = {
                cours: coursNameTeacher,
                date: date,
                heureStart: startTimeDelete,
                heureFin: endTimeDelete,
                groupe: groupNameDelete,
            }

            $.ajax({
                url: '/deleteParcoursajax',
                method: 'post',
                data: parcoursDeleteData,
                success: function(res){
                    responsetxt = "Parcours deleted successfully!";
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: responsetxt,
                        showConfirmButton: true,
                    });
                    $("#parcoursDatatable").DataTable().ajax.reload(null, false);
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
            });
        }
    })
});

$("#cancelAddParcours").on('click', function(){
    $("#formAddPacours").trigger("reset");
    $("#presentParcours").empty();
});

function clearParcoursForm(action)
{
    switch(action)
    {
        case 'add':
            $("#formAddPacours").trigger("reset");
            $("#presentParcours").empty();
            $("#cancelAddParcours").click();
        case 'update':
            $("#formUpdatePacours").trigger("reset");
            $("#presentParcoursUpdate").empty();
            $("#cancelUpdateParcours").click();
    }
}












