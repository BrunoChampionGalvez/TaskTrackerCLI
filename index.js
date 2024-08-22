#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Create file to store tasks
const tasksFile = path.join(__dirname, 'tasks.json')

// Check if file exists, if not, initialize it
if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([]))
}

// Function to read tasks from the tasks file
function readTasks() {
    const data = fs.readFileSync(tasksFile)
    return JSON.parse(data)
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
        tasks.push(task)
        saveTasks(tasks)
        console.log(`Task added: ${task}`);
    } else {
        console.log("No task was provided.");
    }
}

// Handle the "list" command
else if (command === "list") {
    const tasks = readTasks()
    if (tasks.length > 0) {
        tasks.forEach((task, index) => console.log(`${index + 1}. `, task)
        )
    } else {
        console.log("There are no tasks saved.");

    }
}

// Handle the "delete" command
else if (command === "delete") {
    const taskNumber = parseInt(args[0])
    if (!isNaN(taskNumber)) {
        let tasks = readTasks()
        if (taskNumber > 0 && taskNumber <= tasks.length) {
            const deletedTask = tasks.splice(taskNumber - 1, 1)
            saveTasks(tasks)
            console.log(`Task deleted: ${deletedTask}`);
        } else {
            console.log("Task number not valid.");
        }
    } else {
        console.log("Please provide a valid task number to to delete.");
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

