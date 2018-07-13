var questions = [];


//funkcja ta wywola przy przeladowaniu
$(document).ready(function(){
    questions = JSON.parse(window.localStorage.getItem("pttQuestions"));
    if(questions === null){
        questions = [];
    }
    else{
        generateExport();
    }
    $('#key').hide();
}); 

function generateExport(){
    var header = window.sessionStorage.getItem("pttHeader");
    if(questions !== null){
        var text = '<textarea readonly id="exportArea" class="workshopText" rows="15">';
        var keyValue = "";
        if(header !== null && header.trim().length > 0){
            text += header + '\n\n';
        }
            
        for(var j=0; j<questions.length; j++){
            text += (j+1 ) + '. ' + questions[j].questionContent + ' (zaznacz ' +questions[j].correct.length+')\n';
            keyValue += (j+1) + '.';
            
            var answers = questions[j].correct.concat(questions[j].incorrect);
            var order = generatePermutation(answers.length);
            for(var i=0; i<answers.length; i++){
                text += '    '+ String.fromCharCode('a'.charCodeAt() + i) + ') ' + answers[order[i]] + '\n';
                if(order[i]< questions[j].correct.length)
                    keyValue += String.fromCharCode('a'.charCodeAt() + i);
            }
            text += '\n';
            keyValue += " ";
        }
        text+='</textarea>';
        
        $("div.workshop").hide();
        $('#result').html(text);
        $("div.workshop:hidden:first").fadeIn("slow");
        
        $('#keyArea').val(keyValue);
    } 
}

function generatePermutation(length){
    var elements = [];
    var permutation =[];
    for(var i=0; i<length; i++){
        elements.push(i);
    }
    var target =0;
    for(var i=0; i<length; i++){
        target = Math.floor(Math.random() * (length-i));
        permutation.push(elements[target]);
        elements[target] = length+5;
        elements.sort(function(a, b){return a - b;});
    }
    
    return permutation;
}

function selectContent(){
    document.getElementById("exportArea").select();
}

function switchKey(){
    $('#key').toggle('slow');
}

function reloadPage(){
    location.reload();
}

//kolory przycisków w workshop
$(document).on('mouseover', 'button.workshop', function (){
   $(this).css({"color":"#2490E5", "transition":"color 0.2s ease"});
});
$(document).on('mouseout', 'button.workshop', function (){
   $(this).css({"color":"#383533", "transition":"color 0.2s ease"});
});
