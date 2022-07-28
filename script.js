let allTasks = [];
const link = 'http://localhost:8080';
const fetchHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

window.onload = async () => {
  try {
    const response = await fetch(`${link}/tasks`, {
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
  if (input === null) {
    return;
  }
  if (input.value.trim() === '') {
    showError('Поле пустое');
    return;
  }

  try {
    const result = await fetch(`${link}/tasks`, {
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
    await fetch(`${link}/tasks`, {
      method: 'DELETE'
    });
    allTasks = [];
    render();
  } catch (error) {
    showError('Ошибка удаления задач');
  }
};

const deleteTask = async (id) => {
  try {
    const responce = await fetch(`${link}/tasks/${id}`, {
      method: 'DELETE'
    });
    const result = await responce.json();
    if (result.deletedCount > 0) {
      allTasks = allTasks.filter(element => (element._id !== id));
    }
    render();
  } catch (error) {
    showError('Ошибка удаления задачи');
  }
};

const changeCheckBoxTask = async (id, isCheck) => {
  try {
    const result = await fetch(`${link}/tasks/${id}/checkbox`, {
      method: 'PATCH',
      headers: fetchHeaders,
      body: JSON.stringify({
        isCheck: !isCheck
      })
    });
    const data = await result.json();

    allTasks.forEach(item => {
      if (data._id === item._id) {
        item.isCheck = data.isCheck;
      }
    });
    render();
  } catch (error) {
    showError('Ошибка изменения задачи');
  }
};

const cancelTextTask = (element) => {
  const { _id, text, isCheck } = element;
  const task = document.getElementById(`task-${_id}`);

  const newTask = document.createElement('div');
  const buttonsNewTask = document.createElement('div');
  const imageDelete = document.createElement('img');
  const imageEdit = document.createElement('img');
  const buttonDelete = document.createElement('button');
  const buttonEdit = document.createElement('button');
  const oldText = document.createElement('p');
  const checkBox = document.createElement('input');

  checkBox.type = 'checkbox';
  buttonEdit.id = `task__button_editing-${_id}`;
  buttonDelete.id = `task__button_deleting-${_id}`;
  oldText.id = `task__text-${_id}`;
  imageDelete.alt = 'Удалить';
  imageEdit.alt = 'Добавить';
  imageDelete.src = './images/delete.svg';
  imageEdit.src = './images/edit.svg';
  oldText.innerText = text;
  newTask.className = 'header__task';
  newTask.id = `task-${_id}`;

  buttonDelete.onclick = () => deleteTask(id);
  buttonEdit.onclick = () => editTask(element);
  checkBox.onclick = () => changeCheckBoxTask(id, isCheck);

  buttonDelete.append(imageDelete);
  buttonEdit.append(imageEdit);
  buttonsNewTask.append(buttonEdit, buttonDelete);
  newTask.append(checkBox, oldText, buttonsNewTask);
  task.replaceWith(newTask);
}

const changeTextTask = async (id) => {
  try {
    const input = document.getElementById(`task__input-${id}`);
    if (input.value === null) {
      return;
    }
    if (input.value.trim() === '') {
      showError('Поле пустое');
    }
    const result = await fetch(`${link}/tasks/${id}/text`, {
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
    showError('Ошибка изменения задачи');
  }
};

const editTask = (element) => {
  const { _id, text } = element;
  const task = document.getElementById(`task-${_id}`);

  const newTask = document.createElement('div');
  const buttonsNewTask = document.createElement('div');
  const buttonChange = document.createElement('button');
  const buttonCancel = document.createElement('button');
  const imageChange = document.createElement('img');
  const imageCancel = document.createElement('img');
  const newText = document.createElement('input');

  buttonChange.id = `task__button_change-${_id}`;
  buttonCancel.id = `task__button_cancel-${_id}`;
  newText.id = `task__input-${_id}`;
  newText.className = 'task__input_text';
  newText.value = text;
  newTask.className = 'header__task';
  newTask.id = `task-${_id}`;
  imageCancel.alt = 'Отменить';
  imageCancel.src = './images/cancel.svg';
  imageChange.alt = 'Изменить';
  imageChange.src = './images/apply.svg';

  buttonChange.onclick = () => changeTextTask(_id);
  buttonCancel.onclick = () => cancelTextTask(element);

  buttonCancel.append(imageCancel);
  buttonChange.append(imageChange);
  buttonsNewTask.append(buttonCancel);
  buttonsNewTask.append(buttonChange);

  newTask.append(newText, buttonsNewTask);
  task.replaceWith(newTask);
};

const showError = (error) => {
  const textError = document.getElementById('header__error');
  if (textError === null) {
    return;
  }
  textError.innerText = error;
};

const render = () => {
  const tasks = document.getElementById('header__tasks');
  if (tasks === null) {
    showError('Ошибка');
    return;
  }
  while (tasks.firstChild) {
    tasks.removeChild(tasks.firstChild);
  };

  const copyAllTasks = [...allTasks];
  copyAllTasks.sort((task, nextTask) => {
    if (task.isCheck < nextTask.isCheck) {
      return -1;
    }
    if (task.isCheck > nextTask.isCheck) {
      return 1;
    }
    return 0;
  });
  copyAllTasks.forEach(element => {
    const { isCheck, _id, text } = element;
    const newText = document.createElement('p');
    const checkBox = document.createElement('input');
    const imageDelete = document.createElement('img');
    const imageEdit = document.createElement('img');
    const buttonEdit = document.createElement('button');
    const buttonDelete = document.createElement('button');
    const buttonsTask = document.createElement('div');
    const task = document.createElement('div');

    newText.innerText = text;
    newText._id = `task__text-${_id}`;
    checkBox.type = 'checkbox';
    checkBox.checked = isCheck;
    imageDelete.src = './images/delete.svg';
    imageDelete.alt = 'Удалить';
    imageEdit.src = './images/edit.svg';
    imageEdit.alt = 'Добавить';
    task.id = `task-${_id}`;
    task.className = isCheck ? 'checkBox__active' : 'header__task';

    buttonEdit.onclick = () => editTask(element);
    buttonDelete.onclick = () => deleteTask(_id);
    checkBox.onclick = () => changeCheckBoxTask(_id, isCheck);

    if (!isCheck) {
      buttonsTask.append(buttonEdit);
    }

    buttonEdit.append(imageEdit);
    buttonDelete.append(imageDelete);
    task.append(checkBox);
    task.append(newText);
    buttonsTask.append(buttonDelete);
    task.append(buttonsTask);
    tasks.append(task);
  });
};
