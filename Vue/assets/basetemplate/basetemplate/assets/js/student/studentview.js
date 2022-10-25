$(document).on('click', ".btnSendAddRequest", function()
{
    var btn = $(this);

    var askJoinData = {
        "user": $("#userId").val(),
        "cours": $(this).parent().find(".card_price").text().trim(),
        "demand": false
    }   

    $.ajax({
        url: "/createDemand",
        method: "post",
        data: askJoinData,
        success: function(res){
            if (res == "success") {
                btn.addClass('buy_p btnSendCancelRequest').removeClass('by_plan btnSendAddRequest');
                btn.find(".icon").addClass("fa-power-off").removeClass("fa-plus");
                Swal.fire(
                    'Success',
                    `You request to join ${askJoinData.cours} cours has been sent successfully!`,
                    'success',
                    {
                        confirmButtonText: 'Ok'
                    }
                )
            } else {
                Swal.fire(
                    'Error',
                    'You are already send this demande',
                    'info',
                    {
                        confirmButtonText: 'Ok'
                    }
                )
                
            }
        },
        error: function(error){
            Swal.fire(
                'Error',
                "Failed to send request, please try again later!",
                'error',
                {
                    confirmButtonText: 'Ok',
            });
        }
    });
});

$(document).on('click', ".btnSendCancelRequest", function () {
    var btn = $(this);
    var dataDeleteDemande = {
        "cours": $(this).parent().find(".card_price").text().trim(),
        "demand": false
    }
    $.ajax({
        url: "/deleteDemand",
        method: "post",
        data: dataDeleteDemande,
        success: function (res) {
            if (res == "success") {
                btn.addClass('buy_plan btnSendAddRequest').removeClass('buy_p btnSendCancelRequest');
                btn.find(".icon").addClass("fa-plus").removeClass("fa-power-off");
                Swal.fire(
                    'Success',
                    `Cancelling to join ${dataDeleteDemande.cours} cours has been done successfully!`,
                    'success',
                    {
                        confirmButtonText: 'Ok'
                    }
                )
            } else {
                Swal.fire(
                    "Error",
                    "Failed to send request, please try again later !",
                    "error",
                    {
                        confirmButtonText: 'OK'
                    }
                )
            }
            
        },
        error: function (error) {
            console.log("eeeror");
            Swal.fire(
                "Error",
                "Failed to send request, please try again later !",
                "error",
                {
                    confirmButtonText: 'OK'
                }
            )
        }
    })
})