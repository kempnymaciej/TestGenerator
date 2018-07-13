var questions = []; //pytania
var currentIndex = 0; //index aktualnie modyfikowanego pytania

//
//kontener do przechowywania pytan
function Question(questionContent){
    this.questionContent = questionContent;
    this.correct = [];
    this.incorrect = [];
}

//
//funkcja ta wywola przy przeladowaniu
$(document).ready(function(){
    questions = JSON.parse(window.localStorage.getItem("pttQuestions"));
    if(questions === null){
        questions = [];
    }
    else{
        $('#questionShortcuts').html('');
        for(var i=1; i<=questions.length; i++){
            $('#questionShortcuts').append('<li id="questionShortcut' + i + '" onclick="loadQuestion(' + i + ')" class="leftFixedBarRef">Pytanie ' + i + '</li>');
        }
    }
}); 

//
//funkcja po potwierdzeniu kasuje dane aktualnego
//testu(rozpoczyna nowy)
function newFile(){
    var decision = confirm("Operacja spowoduje usunięcie danych aktualnego testu. Kontynuować?");
    if(decision){
        window.localStorage.clear();
        location.reload();
    }
}

//
//generuje pola pozwalajace na rozpoczecie procesu
//tworzenia nowego pytania
function generateQuestion(){
    
    var text = '<h2>Dodawanie pytania</h2>';
    text += '<p class="workshop">Ilość odpowiedzi:';
    text += '<select id="answerCaunt" class="workshop">';
    text += '<option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option>';
    text += '</select>';
    text += '</p>';
    
    smoothPageContentChanging(text, '<button class="workshop" onclick="generateAnswerFields()">Utwórz pytanie</button>');
}

//
//generowanie pol na treść nowego pytania i odpowiedzi
function generateAnswerFields(){
    if(questions.length !== null){
        currentIndex = questions.length + 1;
    }
    else{
        currentIndex = 1;
    }
    
    var text = '';
    text += '<h2>Pytanie ' + currentIndex + ':</h2>';
    text += '<textarea id="questionContent" class="workshopText" rows="4" cols="50" placeholder="Wprowadź treść pytania."></textarea>';
    text += '<p class="workshopWhisper">*Nie przejmuj się kolejnością odpowiedzi, zostanie ona ustawiona losowo w czasie exportowania.</p>';
    
    var count = document.getElementById('answerCaunt').value;
    for(var i=1; i<=count; i++){
        
        text += '<h3>Odpowiedź ' + i + ':</h3>';
        text += '<p class="workshop">Odpowiedź poprawna: <input id="answerCorrectness'+ i +'" type="checkbox"></p>';
        text += '<textarea id="answerContent'+ i +'" class="workshopText" rows="4" cols="50" placeholder="Wprować treść odpowiedzi."></textarea>';
    }

    smoothPageContentChanging(text, '<button class="workshop" onclick="saveNewQuestion()" >Zapisz</button>');
}

//
//dodaje nowe pytanie 
//do pamieci oraz lolalStorage
function saveNewQuestion(){
    if(validateFields()){
        if(questions.length !== null){
            currentIndex = questions.length + 1;
        }
        else{
            currentIndex = 1;
        }

        questions.push(new Question(document.getElementById('questionContent').value));

        saveAnswers();

        if(document.getElementById('questionShortcut' + currentIndex) === null){
            $('#questionShortcuts').append('<li id="questionShortcut' + currentIndex + '" onclick="loadQuestion(' + currentIndex + ')" class="leftFixedBarRef">Pytanie ' + currentIndex + '</li>');
        }

        //Zapis danych do pamieci przegladarki
        window.localStorage.setItem("pttQuestions",JSON.stringify(questions));

        smoothPageContentChanging('', '<button class="workshop" onclick="generateQuestion()" >Dodaj pytanie</button>');
    }
}

//
//nadpisuje pytanie
//w pamieci i w localStorage
function saveQuestion(){
    if(validateFields()){
        questions[currentIndex-1].questionContent = document.getElementById('questionContent').value;
        questions[currentIndex-1].correct = [];
        questions[currentIndex-1].incorrect = [];
        saveAnswers();
        //Zapis danych do pamieci przegladarki
        window.localStorage.setItem("pttQuestions",JSON.stringify(questions));
        
        location.reload();
    }
}

//
//funkcja pobiera i zapisuje zawartosc pol
//odpowiedzi
//wywolywana jest tylko za pomoca innych funkcji save
function saveAnswers(){
    var iterator = 1;
    var answer = document.getElementById('answerContent1');
    while(answer !== null){
        if(document.getElementById('answerCorrectness'+ iterator).checked === true){
            questions[currentIndex-1].correct.push(answer.value);
        }
        else{
            questions[currentIndex-1].incorrect.push(answer.value);
        }

        iterator++;
        answer = document.getElementById('answerContent' + iterator);
    }
}

//
//Wczytywanie danych pytania z pamieci
//I generowanie pol do ich powtornej edycji
function loadQuestion(index){
    currentIndex = index;
    var text = '';
    text += '<h2>Pytanie ' + currentIndex + ':</h2>';
    text += '<p class="workshop">Treść pytania:</p>';
    text += '<textarea id="questionContent" class="workshopText" rows="4" cols="50">'+ questions[currentIndex-1].questionContent +'</textarea>';

    var count = questions[currentIndex-1].correct.length + questions[currentIndex-1].incorrect.length;
    var possitiveI = 0;
    var negativeI = 0;
    for(var i=1; i<=count; i++){
        text += '<h3>Odpowiedź ' + i + ':</h3>';
        if(i <= questions[currentIndex-1].correct.length){
            text += '<p class="workshop">Odpowiedź poprawna: <input id="answerCorrectness'+ i +'" type="checkbox" checked></p>';
            text += '<p class="workshop">Treść odpowiedzi:</p>';
            text += '<textarea id="answerContent'+ i +'" class="workshopText" rows="4" cols="50">'+ questions[currentIndex-1].correct[possitiveI] +'</textarea>';
            possitiveI++;
        }
        else{
            text += '<p class="workshop">Odpowiedź poprawna: <input id="answerCorrectness'+ i +'" type="checkbox"></p>';
            text += '<p class="workshop">Treść odpowiedzi:</p>';
            text += '<textarea id="answerContent'+ i +'" class="workshopText" rows="4" cols="50">'+ questions[currentIndex-1].incorrect[negativeI] +'</textarea>';
            negativeI++;
        }
    }

    smoothPageContentChanging(text, '<button class="workshop" onclick="saveQuestion()" >Zapisz</button>');
}

//
//generowanie podstrony odpowiedzialnej za exportowanie
function generateExportWorkshop(){
    var text = '<h2>Ustawienia</h2>';
    text += '<p class="workshop"> Nagłówek testu:</p>';
    text += '<textarea id="header" class="workshopText" rows="4" cols="50" placeholder="Opcjonalne."></textarea>';
    text += '<p class="workshopWhisper">*Kolejność odpowiedzi zostanie ustalona losowo.</p>';
    smoothPageContentChanging(text, '<button class="workshop" onclick="exportTest()">Exportuj</button> ');
}

//
//jeżeli utworzono już jakieś pytania otwiera exporter.html
//w innym przypadku pojawia się komunikat o braku
//wystarczajacej liczby pytan w tescie
function exportTest(){
    if(questions.length > 0){
        window.sessionStorage.setItem("pttHeader", document.getElementById('header').value);
        window.open("exporter.html");
    }
    else{
        window.alert("Zanim będzie można wyexportować test, trzeba utworzyć przynajmniej jedno pytanie.");
    }
}

//
//generuje podglad w zakladce odpowiedzialnej za eksportowanie
function generatePreview(){
    if(questions !== null){
        text='<div id="HTMLtoPDF">';
        text+='<h2>Test</h2>';
        for(var j=0; j<questions.length; j++){
            text +='<p>'+ (j+1 )+ '. ' + questions[j].questionContent + '</p>';
            var count = questions[j].correct.length + questions[j].incorrect.length;
            var possitiveI = 0;
            var negativeI = 0;
            text +='<ol type="a">';
            for(var i=1; i<=count; i++){
                if(i <= questions[j].correct.length){
                    text += '<li>'+ questions[j].correct[negativeI] +'</li>';
                    possitiveI++;
                }
                else{
                    text += '<li>'+ questions[j].incorrect[negativeI] +'</li>';
                    negativeI++;
                }
            }
            text +='</ol>';
        }
        text +='</div>';
        $('#questionForm').hide();
        $('#questionForm').html(text);
        $("#questionForm:hidden:first").fadeIn("slow");
    } 
}

//
//funkcja sprawdzajaca poprawnosc wypelnienia pol
//(wyświetla komunikaty o błędach)
function validateFields(){
    var decision = true;
    var checkAlert = true;
    var contentAlert = false;
    var alertText = '';

    var iterator = 1;
    var qC = '#answerContent1';
    var answer = document.getElementById('answerContent1');
    while(answer !== null){
        if(document.getElementById('answerCorrectness'+ iterator).checked === true){
            checkAlert = false;
        }

        if($(qC).val().trim().length < 1){
            contentAlert = true; 
        }
        
        
        iterator++;
        qC = '#answerContent' + iterator ;
        answer = document.getElementById('answerContent' + iterator);
    }
    
    if($('#questionContent').val().trim().length < 1){
        alertText += 'Pytanie nie zostało wprowadzone.\n';
        decision = false;
    }
    if(contentAlert){
        alertText += 'Wszystkie pola odpowiedzi powinny być wypełnione.\n';
        decision = false;
    }
    if(checkAlert){
        alertText += 'Co najmniej jedna odpowiedz powinna byc prawdziwa.\n';
        decision = false;
    }

    
    if(!decision){
        alertText += 'Uzupełnij co trzeba i spróbuj ponownie.\n';
        alert(alertText);
    }
    return decision;
}

//
//funkcja odpowiedzialna za zsowanie i rozsuwania paska
//z opcjami
function switchLeftBar(){
    $('div.leftFixedBar').toggle('fast');
}


//
//funkcja powodujaca plynna zmiane zawartosci strony
function smoothPageContentChanging(questionFormText, workshopButtonsText){
    $("div.workshop:visible:first").hide();
    $('#questionForm').html(questionFormText);
    $('#workshopButtons').html(workshopButtonsText);
    $("div.workshop:hidden:first").fadeIn("slow");
}


//kolory przycisków w workshop
$(document).on('mouseover', 'button.workshop', function (){
   $(this).css({"color":"#2490E5", "transition":"color 0.2s ease"});
});
$(document).on('mouseout', 'button.workshop', function (){
   $(this).css({"color":"#383533", "transition":"color 0.2s ease"});
});

//kolory przycisków opcji w leftFixedBar
$(document).on('mouseover', '.leftFixedBarRef', function (){
   $(this).css({"color":"#2490E5", "transition":"color 0.2s ease"});
});
$(document).on('mouseout', '.leftFixedBarRef', function (){
   $(this).css({"color":"#383533", "transition":"color 0.2s ease"});
});

//kolory przycisków w leftFixedBar
//przejscia do edycji pytania
$(document).on('mouseover', '.leftFixedBarRef', function (){
   $(this).css({"color":"#2490E5", "transition":"color 0.2s ease"});
});
$(document).on('mouseout', '.leftFixedBarRef', function (){
   $(this).css({"color":"#383533", "transition":"color 0.2s ease"});
});

//kolory przycisku rozwijajacego opcje w topFixedBar
$(document).on('mouseover', 'img.topFixedBar', function (){
   $(this).css({"background":"#2490E5", "transition":"color 0.2s ease"});
});
$(document).on('mouseout', 'img.topFixedBar', function (){
   $(this).css({"background":"#252423", "transition":"color 0.2s ease"});
});
