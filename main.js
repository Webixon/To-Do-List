//Pobranie elementów globalnych//
const inputBtn = document.querySelector('button.inputBtn');//przycisk do zatwierdzania zadania//
const colorArray = ["#BFB051",'#EFF0B6','#E8E9A1','#E6B566','#F9F7CF','#F4EBC1','#EEBB4D','#EFEE9D','#F5B971','#F5FCC1'];//paleta kolorów "kartek"
const newDivs = document.querySelector('div.content');//nowe zadania
let inputField = document.querySelector('input.inputField');//okno wprowadzenia zadania
const err = document.querySelector('span.error');//span do wyświetlania komunikatów

let inputMod = document.querySelector('input.inputMod'); //okno modyfikowania zadania
let inputBtnMod = document.querySelector(`button.inputBtnMod`); //przycisk zatwierdzenia modyfikacji
let inputBtnCancel = document.querySelector('button.inputBtnCancel'); // przycisk anulowania modyfikacji


let idNumber = 0; //identyfikator poszczególnego zadania
let grabSignTimer = 3000; //timer na pojawianie się znaku grab 
let maxInputLength = 75; // maksymalna długość wprowadzanego zadania

//zmienne do ruchu okienek//
let drawActive = false; //"flaga" do ruchu okienek
let divX ;
let divY ;

//inne zmienne globalne//
let newDiv; //nowe zadanie
let titleTask; //tekst wprowadzany jako zadanie

let taskId; // identyfikator modyfikowanego tekstu zadania
let newDivId; // identyfikator unikalny zadania
let targetTask; // target grabowanej karteczki

//Funkcja dodająca nowe zadanie, nowe okno, przechwytuje "główny input", tworzy buttony, nadaje id tasku, losuje kolor, sprawdza poprawność wpisanych danych, tworzy eventlistenery na klik i enter// 
function addTask(){
    titleTask = inputField.value; 
    newDiv = document.createElement('div');
        
    if(titleTask !=="" && titleTask.length<maxInputLength){
    idNumber++;
    newDiv.classList.add('newTask');
    newDiv.innerHTML=`<button  class = "divBtnCompleted" id = "newTask${idNumber}"><i class="demo-icon icon-ok"></i></button><button class = "divBtnMod" id = "${idNumber}"><i class="demo-icon icon-edit"></i></button><button class = "divBtnDel" id = "delTask${idNumber}"><i class="demo-icon icon-cancel-circled-outline"></i></button> <br><span id= "span${idNumber}"> ${titleTask}</span>`;
    newDiv.setAttribute('id',`task${idNumber}`);
    newDivs.appendChild(newDiv);
    let backColor = Math.floor(Math.random() * colorArray.length);
    newDiv.style.backgroundColor = colorArray[backColor];
    inputField.value="";    
    err.textContent = "";  

    divButtons();
   
    }else{err.textContent="Nie wprowadziłeś zadania do wykonania lub jest ono za długie"};

    newDivId = document.getElementById(`task${idNumber}`);
    newDivId.addEventListener('mousedown', (e)=>{
        drawActive=true;
        targetTask = e.target;
    });

    if(idNumber==1||idNumber==2){
    setTimeout(()=>{
        const grabMeDiv = document.querySelector('div.grab');
        grabMeDiv.style.display ="block";
        setTimeout(()=>{grabMeDiv.style.display = "none"},grabSignTimer)
    },2000)};

    newDivId.addEventListener('mousemove', divPlacement);
    newDivId.addEventListener('mouseup',()=>drawActive=false);
};

//edycja danego zdania - zmienia jego wartość//
function modTask(){    
    let spanText = document.getElementById(`span${taskId}`);
    let inputValue = inputMod.value;
    titleTask = inputValue;
    inputMod.value = "";
    const modifyTask = document.querySelector('div.modifyTask');
    modifyTask.classList.toggle("modifyTaskDisplay"); 

    return spanText.textContent=titleTask;
};
//przechwycenie i eventlistenery na buttony wewnątrz "kartki"//
function divButtons(){
    let divBtnCompleted = document.getElementById(`newTask${idNumber}`);    
    const divBtnMod = document.getElementById(`${idNumber}`);
    const divBtnDel = document.getElementById(`delTask${idNumber}`);
    divBtnCompleted.addEventListener('click',taskCompleted);
    divBtnMod.addEventListener('click',taskModify);
    divBtnDel.addEventListener('click',taskDeleted);
};
//funkcja odpowiedzialna za ruch "kartki"//
function divPlacement(e){
    const newDiv = targetTask;

    if(drawActive){       
   divX = e.clientX ; 
   divY = e.clientY ;
   newDiv.style.left = `${divX}px`;
   newDiv.style.top = `${divY-75}px`;
  }
};

//funkcja sprawdza czy użytkownik po włączeniu modyfikacji nie chce dane zadanie oznaczyć jako skończone//
function taskCompleted(e){
    const modCheck = document.getElementById('modCheck');

    if (modCheck.classList.contains('modifyTaskDisplay')){
        return err.textContent="Wpisz modyfikacje zadania";
    }else{
        const completedTask = e.target.closest('div');    
        completedTask.classList.toggle("newTaskCompleted")};
};

//funkcja sprawdzająca czy użytkownik chce modyfikować juz zakończone zadanie, również sprawdzenie identyfikatora by po kliknięciu modyfikacji zadania - input modyfikacyjny dokonał zmiany zadania w odpowiedniej "kartce"//
function taskModify(e){
    const modifyTask = document.querySelector('div.modifyTask');
    const completedTask = e.target.closest('div');      

    if(completedTask.classList.contains('newTaskCompleted')){
        err.textContent="Nie możesz modyfikować wykonanego już zadania !";
    }else{
        modifyTask.classList.toggle("modifyTaskDisplay"); 
        let btnId = e.target.parentElement;
        taskId = btnId.getAttribute('id');
        err.textContent="";
    }
};
//usuwanie danego zadania//
function taskDeleted(e){
    const deleteTask = e.target.closest('div');
    deleteTask.remove();
};
//anulacja modyfikacji zadania//
function cancelTask(){
    const modifyTask = document.querySelector('div.modifyTask');
    modifyTask.classList.toggle("modifyTaskDisplay"); 
};
  
inputBtnCancel.addEventListener('click',cancelTask);
inputBtnMod.addEventListener('click',modTask);
inputBtn.addEventListener('click',addTask);
inputField.addEventListener('keypress', (e)=>{if(e.key==="Enter"){addTask()}});
