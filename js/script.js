const colorArray = [
	{
		id:'r-rangeValues',
		title:'(R) Vermelho',
		value: 0, 
		input:null, 
		valueBoxId: 'r-rangeValues-valueBox', 
		valueBox:null 
	},
	{
		id:'g-rangeValues',
		title:'(G) Verde',
		value: 0,
		input:null, 
		valueBoxId: 'g-rangeValues-valueBox', 
		valueBox:null
	},
	{
		id:'b-rangeValues',
		title:'(B) Azul',
		value: 0,
		input:null, 
		valueBoxId: 'b-rangeValues-valueBox', 
		valueBox:null
	}
];

const colorMenu = document.querySelector('.colorMenu');
const colorOutputBox = document.querySelector('#colorOutput');

colorOutputBox.classList.add('colorOutput');

const start = () =>{
	initColorInputs();
	renderColorOutput(colorArray);
}

const initColorInputs = ()=>{
	colorArray.map((item)=>{
			createDivElement(item);
			initEventListener(item);
	});
}

function createDivElement(item){
			let colorInputSection = document.createElement('div');
			colorInputSection.classList.add('colorInputSection');		
		
			let colorName = document.createElement('p');
			let colorInput = document.createElement('input');
			let colorValue = document.createElement('input');
			
			colorName.textContent = item.title;
			colorName.classList.add('type');
			
			colorInput.type = 'range';
			colorInput.value = '0';
			colorInput.min='0';
			colorInput.max='255';
			colorInput.step='1';
			colorInput.id=item.id;
			colorInput.classList.add('rangeValues');
			
			colorValue.type='text';
			colorValue.disabled = true;
			colorValue.readonly = true;
			colorValue.value=item.value;
			colorValue.id=item.valueBoxId;
			colorValue.classList.add('inputCurrentValue');
					
			colorInputSection.appendChild(colorName);
			colorInputSection.appendChild(colorInput);
			colorInputSection.appendChild(colorValue);
			
			colorMenu.appendChild(colorInputSection);
}

function initEventListener(item){
	item.input = document.getElementById(item.id);
	item.valueBox = document.getElementById(item.valueBoxId)
	item.input.addEventListener('input',handleColorChangeValue);
}

function handleColorChangeValue(event){
		let id = event.target.id;
		let value = event.target.value;
		
		colorArray.forEach(item=>{
			if(item.id===id){
				item.value = value;
				item.valueBox.value = value;
			}
		})
										
		renderColorOutput(colorArray);
}

function renderColorOutput(colors){
	red = colors.find((item)=>item.id === 'r-rangeValues').value;
	green = colors.find((item)=>item.id === 'g-rangeValues').value;
	blue = colors.find((item)=>item.id === 'b-rangeValues').value;	
	
	colorOutputBox.style.backgroundColor = `rgb(${red},${green},${blue})`;
}

start();