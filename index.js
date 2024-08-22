#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Create file to store tasks
const tasksFile = path.join(__dirname, 'tasks.json')

// Function to read tasks from the tasks file
function readTasks() {
    const data = fs.readFileSync(tasksFile)
    return JSON.parse(data)
}

// Check if file exists, if not, initialize it
const tasks = readTasks()

if (tasks.length === 0) {
    fs.writeFileSync(tasksFile, JSON.stringify({
        done: [],
        inProgress: [],
        todo: []
    }))
}

// Function to save tasks into the tasks file
function saveTasks(tasks) {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2))
}

// Get command and argumens from process.argv
const [, , command, ...args] = process.argv

// Handle de "add" command
if (command === "add") {
    const task = args.join(" ")
    if (task) {
        const tasks = readTasks()
        tasks["todo"].push(task)
        saveTasks(tasks)
        console.log(`Task added: ${task}`);
    } else {
        console.log("No task was provided.");
    }
}

// Handle the "list" command
else if (command === "list") {
    const tasks = readTasks()
    console.log(tasks);
    
    if (Object.keys(tasks).length > 0) {
        for (const taskType in tasks) {
            if (tasks[taskType].length > 0) {
                console.log(`${taskType}:`);
                tasks[taskType].forEach((task, index) => {
                    console.log(`${index + 1}. `, task);
                })
            } else {
                console.log(`No ${taskType} tasks available.`);
            }
        }
        console.log(" ");
    } else {
        console.log("There are no tasks saved.");
    }
}

// Handle the "delete" command
else if (command === "delete") {
    if (Object.length(tasks) > 0) {
        const numberToDelete = parseInt(args[1])
        if (!isNaN(numberToDelete)) {
            if (args[0] === "todo" || args[0] === "inProgress" || args[0] === "done") {
                const tasks = readTasks()
                for (const taskType in tasks) {
                    if (taskType === args[0]) {
                        if (numberToDelete > 0 && numberToDelete <= tasks[taskType].length) {
                            tasks[taskType].splice(numberToDelete - 1, 1)
                            saveTasks(tasks)
                            console.log(`Task with number ${numberToDelete} of type ${taskType} deleted.`);
                        } else {
                            console.log("Task number out of range for that task type.");
                        }
                    }
                }
            } else {
                console.log("Please provide a valid task type after the 'update' command.");
                console.log("Task types available:");
                console.log("1. todo");
                console.log("2. in-progress");
                console.log("3. done");
            }
        } else {
            console.log("Please provide a valid task number after the task type..");
        }
    } else {
        console.log("There are no available tasks.");
    }
}

// Handle the "update" command
else if (command === "update") {
    if (Object.length(tasks) > 0) {
        const numberToUpdate = parseInt(args[1])
        if (!isNaN(numberToUpdate)) {
            if (args[0] === "todo" || args[0] === "inProgress" || args[0] === "done") {
                const tasks = readTasks()
                for (const taskType in tasks) {
                    if (taskType === args[0]) {
                        if (numberToUpdate > 0 && numberToUpdate <= tasks[taskType].length) {
                            const taskToUpdate = args.slice[2].join(" ")
                            tasks[taskType][numberToUpdate - 1] = taskToUpdate
                            saveTasks(tasks)
                            console.log(`Task number ${numberToUpdate} of type ${taskType} updated.`);
                        } else {
                            console.log("Task number out of range for that task type.");
                        }
                    }
                }
            } else {
                console.log("Please provide a valid task type after the 'update' command.");
                console.log("Task types available:");
                console.log("1. todo");
                console.log("2. in-progress");
                console.log("3. done");
            }
        } else {
            console.log("Please provide a valid task number after the task type.");
        }
    } else {
        console.log("There are no available tasks.");
    }
}

// Handle unknown commands
else {
    console.log(`Unknown command: ${command}`);
    console.log("Available commands:");
    console.log("  add <task>");
    console.log("  list");
    console.log("  delete <task-number>");
}

