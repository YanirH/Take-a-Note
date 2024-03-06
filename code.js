const addButton = document.getElementById("addButton")
const resetButton = document.getElementById("resetButton")
const taskInput = document.getElementById("taskInput")
const taskDate = document.getElementById("taskDate")
const taskTime = document.getElementById("taskTime")
const parentTasks = document.getElementById("tasksArea")

let tasksList = JSON.parse(localStorage.getItem("tasksList")) || []
const backgroundArray = ['#ffb3ba' , '#ffdfba', '#ffffba', '#baffc9', '#bae1ff']

addButton.addEventListener("click", function () {
  if (taskInput.value.trim() && taskDate.value && taskTime.value !== "") {
    const newTask = {
      id: new Date().getTime(),
      taskText: taskInput.value,
      taskDate: taskDate.value,
      taskTime: taskTime.value,
      strikeLine: false,
    }  
    tasksList.push(newTask)
    createTask(newTask)
    clearForm()
    taskInput.focus()
    localStorage.setItem("tasksList", JSON.stringify(tasksList))
  } else {
    alert("Please fill out all of the fields!")
  }
})

resetButton.addEventListener("click", function () {
  clearForm()
})


function createTask(task) {
  const taskDiv = document.createElement("div")
  taskDiv.classList.add("task")
  taskDiv.style.backgroundColor = randomBackground(backgroundArray)
  parentTasks.appendChild(taskDiv)

  createButtonWithIcon('btn btn-link btn-sm hidden-button', 'bi bi-trash3', taskDiv, () => deleteEventListener(task, taskDiv))
  createButtonWithIcon('btn btn-link btn-sm editButton', 'bi bi-pen', taskDiv, () => editEvenListener(taskText, saveChangesButton))
  createButtonWithIcon('btn btn-link btn-sm strike-line-button', 'bi bi-type-strikethrough', taskDiv, () => toggleStrikeLineEventListener(task, taskText))
  const saveChangesButton = createButtonWithText('btn btn-link btn-sm save-changes-button', 'Save Changes', taskDiv, () => saveChangesEventListener(task, taskText, saveChangesButton))
  
  // Task text
  const taskText = document.createElement("textarea")
  taskText.textContent = task.taskText
  taskText.disabled = true
  taskText.classList.add("textAreaDesign")
  if (!!task.strikeLine) {
    taskText.style.textDecoration = "line-through"

  } else {
    taskText.style.textDecoration = "none"

  }
  taskDiv.appendChild(taskText)

  //task date and time
  const taskDateTime = document.createElement("span")
  taskDateTime.textContent = `${task.taskDate} | ${task.taskTime}`
  taskDateTime.classList.add("taskDateTime")
  taskDiv.appendChild(taskDateTime)
}


function createButtonWithIcon(buttonClassName, iconClassName, parentElement, eventListener) {
  //create button element
 const button = document.createElement('button')
  button.className = `${buttonClassName}`
 //create the Icon desired for the button
  const Icon = document.createElement("i")
  Icon.className = `${iconClassName}`
  button.appendChild(Icon)
  parentElement.appendChild(button)
  button.addEventListener('click', eventListener)
  return button
}

function createButtonWithText(buttonClassName, buttonText, parentElement, eventListener) {
 //create button element
const button = document.createElement('button')
 button.className = `${buttonClassName}`
 button.textContent = `${buttonText}`
 parentElement.appendChild(button)
 button.addEventListener('click', eventListener)

 return button
}

function randomBackground (backgroundArray) {
  const randomIndex = Math.floor(Math.random() * backgroundArray.length)
  return backgroundArray[randomIndex]
}

function editEvenListener (taskText, saveChangesButton) {
    taskText.disabled = false
    saveChangesButton.style.visibility = "visible"
}

function deleteEventListener (task, taskDiv) {
  tasksList = tasksList.filter((t) => t !== task)
    localStorage.setItem("tasksList", JSON.stringify(tasksList))
    taskDiv.remove()
}

function toggleStrikeLineEventListener (task, taskText) {
  let taskIndex = tasksList.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      if (!tasksList[taskIndex].strikeLine) {
        taskText.style.textDecoration = "line-through"
        tasksList[taskIndex].strikeLine = true

      } else {
        taskText.style.textDecoration = "none"
        tasksList[taskIndex].strikeLine = false
      }

    }
    localStorage.setItem("tasksList", JSON.stringify(tasksList))
}

function saveChangesEventListener (task, taskText, saveChangesButton) {
  taskText.disabled = true
    let taskIndex = tasksList.findIndex((t) => t.id === task.id)
    if (taskIndex !== -1) {
      tasksList[taskIndex].taskText = taskText.value
    }
    saveChangesButton.style.visibility = "hidden"
    localStorage.setItem("tasksList", JSON.stringify(tasksList))
}





function clearForm() {
  taskInput.value = ""
  taskDate.value = ""
  taskTime.value = ""
}

window.onload = function () {
  tasksList.forEach(createTask)
}