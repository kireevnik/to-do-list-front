let arrElements = [];
let tempStr = '';
let input = null;
let elementEdit = null;
let valElementEdit = null;

window.onload = async () => {
  input = document.getElementsByClassName('input_text')[0];
  input.addEventListener('change', updateVal);
  const resp = await fetch("http://localhost:8080/allTasks", {
    method: 'GET'
  });
  let result = await resp.json();
  console.log(result);
  arrElements = result.data;
  render();
};

const updateVal = (event) => {
  tempStr = event.target.value;
};


const onButtonClick = async () => {
  arrElements.push({
    text: tempStr,
    isCheck: false
  });
  await fetch('http://localhost:8080/newTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: tempStr,
      isCheck: false
    })
  });

  tempStr = '';
  input.value = "";
  render();
};

const onclickDeleteTabl = async () => {
  await fetch('http://localhost:8080/deleteAllTasks', {
    method: 'DELETE'
  });

  arrElements = [];
  render();
};

const render = () => {
  const lists_with_checkBox = document.getElementsByClassName('lists_with_checkBox')[0];
  while (lists_with_checkBox.firstChild) {
    lists_with_checkBox.removeChild(lists_with_checkBox.firstChild);
  };

  arrElements.sort((a, b) => (a.isCheck < b.isCheck) ? -1 : 1);
  arrElements.map((element, index) => {
    const fullContainer = document.createElement('div');
    const containerWithImg = document.createElement('div');
    const container = document.createElement('div');
    const checkBox = document.createElement('input');
    const imgDelete = document.createElement('img');
    const imgEdit = document.createElement('img');
    const p = document.createElement('p');

    p.innerText = element.text;
    checkBox.type = 'checkBox';
    checkBox.checked = element.isCheck;
    container.className = `container_${index}`;
    imgDelete.src = './images/delete.svg';
    imgEdit.src = './images/edit.svg';
    fullContainer.className = 'lists_with_checkBox_container'

    imgDelete.onclick = () => deleteElement(element);
    imgEdit.onclick = () => onclickEdit(element, index);
    checkBox.onclick = () => onclickCheckBox(element, index);

    if (element.isCheck) {
      container.className = 'checkBox__active';
    };

    if (index === elementEdit) {
      const containerWithModuleEdit = document.createElement('div');
      const inputText = document.createElement('input');
      const imgEditCansel = document.createElement('img');
      const imgEditApp = document.createElement('img');

      inputText.className = 'lists_with_checkBox__input_text';
      inputText.value = element.text;
      imgEditCansel.src = './images/cancel.png';
      imgEditApp.src = './images/apply.png';

      inputText.addEventListener('change', updateInputText);
      imgEditApp.onclick = () => onclickEditApp(element);
      imgEditCansel.onclick = () => onclickEditCansel();

      containerWithModuleEdit.append(imgEditCansel);
      containerWithModuleEdit.append(imgEditApp);
      containerWithImg.append(containerWithModuleEdit);
      container.append(checkBox);
      container.append(inputText);
    } else {
      let p = document.createElement('p');
      p.innerText = element.text;

      container.append(checkBox);
      container.append(p);

      if (!element.isCheck) {
        containerWithImg.append(imgEdit);
      };
    };

    containerWithImg.append(imgDelete);
    fullContainer.append(container);
    fullContainer.append(containerWithImg);
    lists_with_checkBox.append(fullContainer);
  });
};

const deleteElement = async (element) => {
  await fetch('http://localhost:8080/deleteTask', {
    method: 'DELETE',
    params: {
      _id: element._id
    }
  });

  arrElements.splice(arrElements.indexOf(element), 1);
  render();
};


const updateInputText = (event) => {
  arrElements[elementEdit].text = event.target.value;
  render();
};

const onclickCheckBox = (element, index) => {
  console.log(element);
  pathTask(element);
  arrElements[index].isCheck = !arrElements[index].isCheck;
  render();
};

const onclickEditCansel = () => {
  arrElements[elementEdit].text = valElementEdit;
  elementEdit = null;
};

const onclickEditApp = async (element) => {
  elementEdit = null;
  pathTask(element);
  render();
};

const onclickEdit = (element, index) => {
  elementEdit = index;
  valElementEdit = element.text;
  render();
};

const pathTask = async (element) => {
  await fetch('http://localhost:8080/updateTask', {
    method: 'PATCH',
    params: {
      _id: element._id,
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      isCheck: !element.isCheck,
      text: element.text
    })
  });
};