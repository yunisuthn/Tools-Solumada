
$(document).on("click", "#myBtn", function () {
  var instructionName = $(this).parent().find(".instruction-hidden").text().trim()
  $.ajax({
    url: '/getOneInstruction',
    data: { instructionName: instructionName },
    method: "post",
    success: function (resp) {
      $(document).ready(function () {
        $("#nomInstru").html(`${resp.name}`);
        $("#titreInstr").html(`${resp.title}`)
        $("#instruct").html(`${resp.instruction}`)
      })
      // document.getElementById()
    }
  })

})

$("#saveInstruction").on("click", function () {
  Instruction = {
    name: $("#nameInst").val(),
    titre: $("#TitleInst").val(),
    instruct: $("#instruction").val()
  }

  //console.log("Instruction ", Instruction);

  $.ajax({
    url: '/addInstruction',
    method: 'post',
    data: Instruction,
    success: function (response) {
      if (response == "error") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "L'instruction est exist ou le champ nom ou titre est incomplet"
        })
        clearForm()
        window.location = "/instruction"
      } else {
        Swal.fire({
          icon: 'success',
          title: "Nouveau Instruction sauvegardé",
          text: `Instruction ${Instruction.name} bien enregistré`,
        })
        clearForm()
        window.location = "/instruction"
      }
    }
  })
})


//Empty form Instruction
function clearForm() {
  $('#nameInst').val('');
  $('#TitleInst').val('');
  $('#instruction').val('');
  $('#cancelInstruct').click();
}

//Update Instruction
var updateInst = ""
var titreInstA = ""
var instructInstA = ""

$(document).on('click', '.updateInstruct', function () {
  // console.log("updateInstruct");
  var updateInstruct = {
    name: $(this).parent().find(".instruction-hidden").text().trim()
  }

  updateInst = updateInstruct.name


  $.ajax({
    url: '/getInstruction',
    method: "post",
    data: updateInstruct,
    dataType: 'json',
    success: function (res) {
      var respData = JSON.parse(JSON.stringify(res))
      //console.log("respData", respData);
      titreInstA = respData.title
      instructInstA = respData.instruction

      $('#nameUpdatInst').val(respData.name)
      $('#TitleUpdatInst').val(respData.title)
      $('#updateInstruction').val(respData.instruction)
    }
  })


})


//Save Instruction Update
$(document).on('click', '#saveUpdatInstruction', function () {
  var nameInstUpdat = $("#nameUpdatInst").val()
  var titleInstUpdat = $("#TitleUpdatInst").val()
  var instUpdat = $('#updateInstruction').val()

  var donneUpdat = {
    nameOld: updateInst,
    name: nameInstUpdat,
    title: titleInstUpdat,
    titleOld: titreInstA,
    instruct: instUpdat,
    instructOld: instructInstA
  }

  $.ajax({
    url: "/UpdateInstruct",
    method: "post",
    data: donneUpdat,
    success: function (res) {
      console.log("res", res);
      Swal.fire(
        "Update",
        "Mis à jour Instruction sauvegardée !",
        'success',
        {
          confirmButtonText: 'OK'
        }
      )
      $("#nameUpdatInst").val("");
      $("#TitleUpdatInst").val("");
      $("#updateInstruction").val("");
      $("#cancelUdpatInstruct").click();
      window.location = "/instruction"
    }
  })
})

//Delete instruction

$(document).on('click', '.deleteInstruct', function () {
  Swal.fire({
    title: 'Delete Instruction',
    text: 'Etes vous sur de supprimer cette instruction?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'red',
    cancelButtonColor: 'green',
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      var name = $(this).parent().find('.instruction-hidden').text().trim()//.val();
      deleteInstruct = {
        name: name
      }

      //console.log("deleteInstruct", name);
      $.ajax({
        url: '/deleteInstruction',
        method: 'post',
        data: deleteInstruct,
        success: function (res) {
          responseTxt = "Instruction supprimée !";
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: responseTxt,
            showConfirmButton: true
          })
          window.location = "/instruction"
        },
        error: function (resp) {
          Swal.fire({
            positon: "top-center",
            icon: 'error',
            title: resp,
            showConfirmButton: false,
            timer: 2000
          })
        }
      })
    }
  })
})

var type = $('#typeUtil').val()// document.getElementById("typeUtil")//$('#typeUtil').val();

if (type.trim() == "IT") {
  $("#utilisateur").css("display", "none")
  $("#historique").css("display", "none")
  // console.log("page IT");
} else if (type.trim() == "TL") {
  $("#utilisateur").css("display", "none")
  $("#historique").css("display", "none")
  // console.log("page TL");
} 