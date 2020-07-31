let mainContainer = null;
let globalNames = [];
let currentIndex = null;
let isEditing = false;
let form = null;
let reportContainer = null;
let report = null;
let input = null;

const start = () =>{
    initialize();
    activateInput();
    render();
}

const initialize = () =>{
    mainContainer = document.getElementById("main");
    createForm();
    preventFormSubmit();
    reportRender();
       
    globalNames = ["Um", "dois", "três", "quatro", "cinco"];
}

function reportRender(){
    reportContainer = document.createElement("div");
    let reportTitle = document.createElement("h2");
    report = document.createElement("div");
    let id = document.createAttribute("id");
    id.value = "names";
    report.setAttributeNode(id);

    reportTitle.innerHTML = "Nomes cadastrados até o momento";
    reportTitle.classList.add("formTitle");
    reportContainer.classList.add("reportContainer");

    reportContainer.appendChild(reportTitle);
    reportContainer.appendChild(report);

    mainContainer.appendChild(reportContainer);
}

function createForm(){
    form = document.createElement('form');
    const formClasslist = ["col"];

    formClasslist.forEach((item,index)=>{
        form.classList.add(item);
    })
        
    let formTitle = document.createElement('h1');
    formTitle.classList.add("formTitle");
    formTitle.innerHTML = "Cadastro de Nomes"
    form.appendChild(formTitle);
    
    createInput(form);
    mainContainer.appendChild(form);
}

function createInput(form){
    const inputClasslist = ["input-field","col","s6"];
    let inputDiv = document.createElement('div')

    inputClasslist.forEach((item)=>{
        inputDiv.classList.add(item);
    })

    input = document.createElement('input');
    let type = document.createAttribute("type");
    type.value = "text";
    let placeholder = document.createAttribute("placeholder");
    placeholder.value = "Informe o seu nome";
    let id = document.createAttribute("id");
    id.value = "nameInput";

    let attArray = [type,placeholder,id];

    attArray.forEach((item)=>{
        input.setAttributeNode(item);
    })

    const inputDivArray = [input];

    inputDivArray.map((child)=>inputDiv.appendChild(child));
    
    form.appendChild(inputDiv);
}

const activateInput = () =>{
    const insertName = (newName) =>{
        globalNames = [...globalNames, newName]
    }
    const updateName = (name) =>{
        globalNames[currentIndex] = name;
    }

    const handleTyping = (event)=>{
        let hasText = !!event.target.value && event.target.value.trim()!=="";
        
        if(event.key ==="Enter" && hasText){
            if(isEditing){
                updateName(event.target.value);
                isEditing = false;
            }else{
                insertName(event.target.value);
            }

            input.value = '';
            render();
        }
    }
    input.addEventListener("keyup",handleTyping);
    input.focus();
}

const preventFormSubmit = () =>{
    const handleFormSubmit = (event)=>{
        event.preventDefault();
    }
    form.addEventListener("submit", handleFormSubmit);
    
}

const render = () =>{
    const createSpan = (name,index) =>{
        const editItem = () => {
            input.value = name;
            currentIndex = index;
            input.focus();
            isEditing = true;
        }

        let span = document.createElement("span");
        span.textContent = name;
        span.classList.add('clickable');
        span.addEventListener('click',editItem);

        return span;
    }

    const createDeleteButton = (index) => {
        const deleteName= () =>{
           globalNames = globalNames.filter((_, i) => i !== index );
           render();
        }

        let button = document.createElement('button');
        let classListArray = ['btn-floating','btn-small','waves-effect','waves-light','deleteButton'];
        classListArray.map((item)=>{
            button.classList.add(item);
        })
        
        button.textContent = "x";
        button.addEventListener("click",deleteName);

        return button;
    }

    const mappingValues = (ulist) =>{
        globalNames.map((item,index)=>{
            let li = document.createElement('li');
            
            let deleteButton = createDeleteButton(index);
            
            let span = createSpan(item,index);

            li.appendChild(deleteButton);
            li.appendChild(span);
            ulist.appendChild(li);
        })
    }

    let ul = document.createElement("ul");

    mappingValues(ul);

    if(!report.children[0]){
        report.appendChild(ul);
    }else{
        report.replaceChild(ul,report.children[0]);
    }
}

start();
