let allTasks = [];

window.onload = async () => {
  try {
    const response = await fetch("http://localhost:8080/tasks", {
      method: 'GET'
    });

    const result = await response.json();
    allTasks = result.data;
    render();
  } catch (error) {
    showError('Ошибка получения задач');
  }
};


const addTask = async () => {
  const input = document.getElementById('add-block_input');
  if (input === null || input.value.trim() === '') {
    input.value = '';
    return;
  }

  try {
    const result = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: input.value
      })
    });
    const data = await result.json();
    allTasks.push(data);
    input.value = '';
    render();

  } catch (error) {
    showError('Ошибка добавления задачи');
  }
};

const deleteTasks = async () => {
  try {
    await fetch('http://localhost:8080/tasks', {
      method: 'DELETE'
    });
    allTasks = [];
    render();

  } catch (error) {
    showError('Ошибка удаления задач');
  }
};

const deleteTask = async (element) => {
  try {
    await fetch(`http://localhost:8080/tasks/${element._id}`, {
      method: 'DELETE',
    });
    index = allTasks.indexOf(element);
    allTasks.slice(index, 1);
    render();
  } catch (error) {
    showError('Ошибка удаления задачи');
  }
};

const changeCheckBoxTask = async (element) => {
  try {
    const result = await fetch(`http://localhost:8080/tasks/isCheck/${element._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        isCheck: !element.isCheck
      })
    });
    const data = await result.json();

    allTasks.forEach(item => {
      if (item._id === element._id) {
        item.isCheck = data.isCheck;
      }
    });
    render();
  } catch (error) {
    showError('Ошибка изменения задачи');
  }
};

const changeTextTask = async (element) => {
  try {
    const input = document.querySelector('.lists_with_checkBox__input_text');
    const result = await fetch(`http://localhost:8080/tasks/text/${element._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        text: input.value
      })
    });
    const data = await result.json();

    allTasks.forEach(item => {
      if (item._id === element._id) {
        console.log(data.text);
        item.text = data.text;
      }
    });
    render();
  } catch (error) {
    showError('Ошибка удаления задачи');
  }
};

const editTask = (element) => {
  indexEditableTask = element._id;
  render(indexEditableTask);
};

const showError = (error) => {
  const window = document.createElement('p');
  const bodyContainer = document.getElementById('forError');
  const body = document.getElementsByTagName('body')[0];

  window.innerText = error;
  bodyContainer.className = 'container_error container';
  window.className = 'error';
  body.append(window);
  render();
};

const render = (indexEditableElement = null) => {
  const allTasks = document.getElementById('list_with_Tasks');
  while (allTasks.firstChild) {
    allTasks.removeChild(allTasks.firstChild);
  };

  const copyAllTasks = [...allTasks];
  copyAllTasks.sort((task, nextTask) => (task.isCheck < nextTask.isCheck) ? -1 : 1);
  copyAllTasks.forEach(element => {
    const task = document.createElement('div');
    const elementsInTask = document.createElement('div');
    const editingElements = document.createElement('div');
    const checkBox = document.createElement('input');
    const p = document.createElement('p');
    const imageDeletingTask = document.createElement('img');
    const imageEditingTask = document.createElement('img');

    p.innerText = element.text;
    checkBox.type = 'checkBox';
    checkBox.checked = element.isCheck;
    imageDeletingTask.src = './images/delete.svg';
    imageEditingTask.src = './images/edit.svg';
    task.className = 'lists_with_checkBox_container'

    imageDeletingTask.onclick = () => deleteTask(element);
    imageEditingTask.onclick = () => editTask(element);
    checkBox.onclick = () => changeCheckBoxTask(element);

    if (element.isCheck) {
      editingElements.className = 'checkBox__active';
    };

    if (element._id === indexEditableElement) {
      const actionCancelAndAdding = document.createElement('div');
      const newText = document.createElement('input');
      const imageCancel = document.createElement('img');
      const imageAdding = document.createElement('img');

      newText.className = 'lists_with_checkBox__input_text';
      newText.value = element.text;
      imageCancel.src = './images/cancel.png';
      imageAdding.src = './images/apply.png';

      imageAdding.onclick = () => changeTextTask(element);
      imageCancel.onclick = () => render();

      actionCancelAndAdding.append(imageCancel);
      actionCancelAndAdding.append(imageAdding);
      elementsInTask.append(actionCancelAndAdding);
      element.append(checkBox);
      editingElements.append(newText);
    } else {
      let p = document.createElement('p');
      p.innerText = element.text;

      editingElements.append(checkBox);
      editingElements.append(p);

      if (!element.isCheck) {
        elementsInTask.append(imageEditingTask);
      };
    };

    elementsInTask.append(imageDeletingTask);
    task.append(editingElements);
    task.append(elementsInTask);
    allTasks.append(task);
  });
};
