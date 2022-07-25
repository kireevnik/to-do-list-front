let allTasks = [];
const link = 'http://localhost:8080';
const fetchHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

window.onload = async () => {
  try {
    const response = await fetch(link + '/tasks', {
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
    const result = await fetch(link + '/tasks', {
      method: 'POST',
      headers: fetchHeaders,
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
    await fetch(link + '/tasks', {
      method: 'DELETE'
    });
    allTasks = [];
    render();
  } catch (error) {
    showError('Ошибка удаления задач');
  }
};

const deleteTask = async (_id) => {
  try {
    await fetch(link + `/tasks/${_id}`, {
      method: 'DELETE'
    });
    allTasks = allTasks.filter(element => (element._id !== _id));
    render();
  } catch (error) {
    showError('Ошибка удаления задачи');
  }
};

const changeCheckBoxTask = async (_id, _isCheck) => {
  try {
    const result = await fetch(link + `/tasks/${_id}/isCheck`, {
      method: 'PATCH',
      headers: fetchHeaders,
      body: JSON.stringify({
        isCheck: !_isCheck
      })
    });
    const data = await result.json();

    allTasks.forEach(item => {
      if (item._id === data._id) {
        item.isCheck = data.isCheck;
      }
    });
    render();
  } catch (error) {
    showError('Ошибка изменения задачи');
  }
};

const cancelTextTask = (_id) => {
  render();
}

const changeTextTask = async (_id) => {
  try {
    const input = document.querySelector('.lists_with_checkBox__input_text');
    const result = await fetch(link + `/tasks/${_id}/text`, {
      method: 'PATCH',
      headers: fetchHeaders,
      body: JSON.stringify({
        text: input.value
      })
    });
    const data = await result.json();

    allTasks.forEach(item => {
      if (item._id === data._id) {
        item.text = data.text;
      }
    });
    render();
  } catch (error) {
    showError('Ошибка удаления задачи');
  }
};

const editTask = (_id, _text) => {
  render();
  const editingElements = document.getElementById('task-' + _id);
  const actionModule = document.getElementById('element-' + _id)
  const editingTask = document.getElementById('editing_task-' + _id);
  const deletingTask = document.getElementById('deleting_task-' + _id);
  const textTask = document.getElementById(_id);
  const imageAdding = document.createElement('img');
  const imageCancel = document.createElement('img');
  const adding = document.createElement('div');
  const cancel = document.createElement('div');
  const newText = document.createElement('input');

  imageAdding.id = `adding-${_id}`;
  imageCancel.id = `cancel-${_id}`;
  newText.id = `input-${_id}`
  newText.className = 'task__input_text';
  imageAdding.alt = 'Изменить';
  imageCancel.alt = 'Отменить';
  imageCancel.src = './images/cancel.png';
  imageAdding.src = './images/apply.png';
  newText.value = _text;

  imageAdding.onclick = () => changeTextTask(_id);
  imageCancel.onclick = () => cancelTextTask(_id);

  cancel.append(imageCancel);
  adding.append(imageAdding);
  actionModule.replaceChild(cancel, deletingTask);
  actionModule.replaceChild(adding, editingTask);
  editingElements.replaceChild(newText, textTask);
};

const showError = (error) => {
  const textError = document.createElement('p');
  const windowError = document.getElementById('header__error');
  const body = document.getElementsByTagName('body')[0];

  textError.innerText = error;
  textError.className = 'error';
  windowError.className = 'container_error container';
  body.append(textError);
  render();
};

const render = (indexEditableElement = null) => {
  const Tasks = document.getElementById('header__tasks');
  while (Tasks.firstChild) {
    Tasks.removeChild(Tasks.firstChild);
  };

  const copyAllTasks = [...allTasks];
  copyAllTasks.sort((task, nextTask) => (task.isCheck < nextTask.isCheck) ? -1 : 1);
  copyAllTasks.forEach(element => {
    const task = document.createElement('div');
    const actionModule = document.createElement('div');
    const editingElements = document.createElement('div');
    const checkBox = document.createElement('input');
    const textTask = document.createElement('p');
    const imageDeletingTask = document.createElement('img');
    const imageEditingTask = document.createElement('img');
    const editingTask = document.createElement('div');
    const deletingTask = document.createElement('div');

    checkBox.type = 'checkBox';
    textTask.innerText = element.text;
    checkBox.checked = element.isCheck;
    imageDeletingTask.src = './images/delete.svg';
    imageEditingTask.src = './images/edit.svg';
    imageDeletingTask.alt = 'Удалить';
    imageEditingTask.alt = 'Добавить';
    editingElements.id = `task-${element._id}`;
    actionModule.id = `element-${element._id}`;
    deletingTask.id = `deleting_task-${element._id}`;
    editingTask.id = `editing_task-${element._id}`;
    textTask.id = element._id;
    task.className = 'header__task';

    deletingTask.onclick = () => deleteTask(element._id);
    editingTask.onclick = () => editTask(element._id, element.text);
    checkBox.onclick = () => changeCheckBoxTask(element._id, element.isCheck);

    if (element.isCheck) {
      editingElements.className = 'checkBox__active';
    }

    editingTask.append(imageEditingTask);
    deletingTask.append(imageDeletingTask);
    editingElements.append(checkBox);
    editingElements.append(textTask);

    if (!element.isCheck) {
      actionModule.append(editingTask);
    };

    actionModule.append(deletingTask);
    task.append(editingElements);
    task.append(actionModule);
    Tasks.append(task);
  });
};
