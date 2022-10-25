var type =  $('#typeUtil').val()// document.getElementById("typeUtil")//$('#typeUtil').val();

if (type.trim() == "IT") {
    $("#operation").css("display", "none")
    $("#production").css("display", "none")
    $("#utilisateur").css("display", "none")
    $("#historique").css("display", "none")
    // console.log("page IT");
} else if (type.trim() == "TL") {
    $("#operation").css("display", "none")
    $("#it").css("display", "none")
    $("#utilisateur").css("display", "none")
    $("#historique").css("display", "none")
    // console.log("page TL");
} 
// else {
//     console.log("page operation");
// }
// console.log("type", type);