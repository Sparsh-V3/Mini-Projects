function toggleNoTasksMessage(taskCache) {
    const noTasksMessage = document.querySelector('#noTasksMessage');
    if(taskCache.length === 0) {
        noTasksMessage.style.display = 'block';
    } else {
        noTasksMessage.style.display = 'none';
    }
}

// Function to add new tasks to the list, taskCache, and localStorage
function addTasks(taskInput, taskHolder, taskCache) {
    // Creating new elements for the tasks
    const list = document.createElement('li');
    const func = document.createElement('div');
    const taskName = document.createElement('p');
    let taskChecker = document.createElement('input');
    let deleteTask = document.createElement('i');

    // Setting task name from input and create checkbox and delete icon
    taskName.textContent = taskInput.value;
    taskChecker.setAttribute('type', 'checkbox');
    deleteTask.classList.add('fas', 'fa-trash', 'delete-icon');
    
    // Appending elements to the func, list and taskHolder
    func.append(taskChecker, deleteTask)
    list.append(taskName, func);
    taskHolder.append(list);
    taskInput.value = ''; // Clearing input field

    // Adding tasks to the taskCache and saving it to localStorage
    taskCache.push(taskName.textContent);
    savingTasksInLocalStorage(taskCache); // Save taskCache to localStorage
    console.log(taskCache); // Logging the taskCache for debugging
    return list; // Returning the created list element
}

// Function to recover tasks from localStorage and append to the task list
function recoverTasks(item) {
    const list = document.createElement('li');
    const taskName = document.createElement('p');
    const func = document.createElement('div');
    let taskChecker = document.createElement('input');
    let deleteTask = document.createElement('i');

    // Setting task content and add checkbox and delete icon
    taskName.textContent = item;
    taskChecker.setAttribute('type', 'checkbox');
    deleteTask.classList.add('fas', 'fa-trash', 'delete-icon');
    
    // Appending elements to the func and list and returning it
    func.append(taskChecker, deleteTask)
    list.append(taskName, func);
    return list;
}

// Function to handle task events like marking as completed or deleting
function taskEventDelegation(task, taskCache) {

    task.addEventListener('click', (event) => {
        const target = event.target;
        
        // Marking task as completed when checkbox is clicked
        if (target.type === 'checkbox') {
            const currentTask = target.closest('li').querySelector('p');
            currentTask.classList.toggle('completed', target.checked);
        }

        // Deleting task when delete icon is clicked
        if (target.classList.contains('delete-icon')) {
            target.closest('li').remove(); // Removing task from UI
            const queryTask = target.closest('li').querySelector('p').textContent.toLowerCase();
            // Finding task in taskCache and removing it
            for (let item = 0; item < taskCache.length; item++) {
                if (taskCache[item].toLowerCase() === queryTask) {
                    taskCache.splice(item, 1);
                    break;
                }
            };
            savingTasksInLocalStorage(taskCache); // Saving updated taskCache to localStorage
            toggleNoTasksMessage(taskCache);
            console.log(taskCache); // Logging taskCache for debugging
        }
    });
}

// Function to save tasks in localStorage
function savingTasksInLocalStorage(taskCache) {
    localStorage.setItem('tasks', JSON.stringify(taskCache)); // Saving taskCache as JSON string
}

// Function to load tasks from localStorage and display them
function loadingTasksFromLocalStorage(taskCache, taskHolder) {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')); // Getting tasks from localStorage

    // Checking if storedTasks is an array and exists
    if (Array.isArray(storedTasks) && storedTasks) {
        setTimeout(() => {
            taskCache.length = 0; // Clearing taskCache to avoid duplication
            taskCache.push(...storedTasks); // Updating taskCache with stored tasks
            console.log(taskHolder);
            taskHolder.querySelectorAll('li').forEach(item => item.remove());
            // Looping through stored tasks and recovering them
            storedTasks.forEach((item) => {
                const recoveredTask = recoverTasks(item);
                taskHolder.append(recoveredTask); // Appending recovered task to the taskHolder
                taskEventDelegation(recoveredTask, taskCache); // Applying addEventListener to the Recovered task
            });
            
            toggleNoTasksMessage(taskCache);
            console.log("Tasks restored successfully!");

        }, 1500) // Delay of 1 second
    }
    else {
        toggleNoTasksMessage(taskCache);
        console.log("No tasks found in local storage.");
    }
}

// Function to clear tasks from localStorage
function clearLocalStorage() {
    localStorage.clear(); // Clear all data from localStorage   
}

// Main function to initialize the todo app
function todo() {
    let taskCache = []; // Array to store task data

    const taskInput = document.querySelector('.taskName'); // Input field for task name
    const addTaskBtn = document.querySelector('.add-task-btn'); // Add task button
    const taskHolder = document.querySelector('ul'); // Task list holder
    const resetEverything = document.querySelector('#resetEverything'); // Reset button
    const restoreTasks = document.querySelector('#restoreEverything'); // Restore Button

    // This adds new task when button is clicked
    addTaskBtn.addEventListener('click', () => { 
        const newTask = taskInput.value.trim(); // Getting and format input task
        if (!newTask) {
            alert('Kindly enter something......'); // Showing alert if input is empty
        }
        else if (taskCache.includes(newTask)) {
            alert('Task already exists!!!'); // Showing alert if task is duplicate
        }
        else {
            const task = addTasks(taskInput, taskHolder, taskCache); // Adding task to list
            taskEventDelegation(task, taskCache); // Attaching event listeners to task
            toggleNoTasksMessage(taskCache);
        }
    });

    // Resetting all tasks when reset button is clicked
    resetEverything.addEventListener('click', (event) => {
        if (confirm('Really?')) {
            clearLocalStorage(); // Clearing localStorage
            taskCache.length = 0; // Clearing local taskCache as well
            taskHolder.querySelectorAll('li').forEach(item => item.remove());
            toggleNoTasksMessage(taskCache); // Diplaying a default message
            console.log('Todo List is now Reset.'); // Logging reset status
        } else {
        // Reapply event listeners to tasks in case of rejection
        const allTasks = taskHolder.querySelectorAll('li'); // Storing all list elements inside `allTasks` variable
        allTasks.forEach((task) => {
            taskEventDelegation(task, taskCache); // Applying addEventListener again to pre-existing tasks as the App is not Re-renderered
        });
        toggleNoTasksMessage(taskCache);
        console.log('Reset Confirmation Rejected.'); // Logging if reset is canceled
        }
    });

    restoreTasks.addEventListener('click', () => {
        loadingTasksFromLocalStorage(taskCache, taskHolder); // Load tasks from localStorage when Restore Button is clicked
    });
}

// Invoking the todo app
todo();
