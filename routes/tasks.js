const express = require('express');
const router = express.Router({
    mergeParams: true
});
const tasks = require('../data/tasks');
const projects = require('../data/projects');
const fs = require('fs');
const path = require('path');
const logger = require('../middleware/logger');
const employees = require('../data/employees');
const url = require('url');

router.use(logger);

router.get('/',(req,res) => {

    const parsedURL = url.parse(req.url, true);
    const queryParams = parsedURL.query;
    console.log(queryParams);

    let projectId = req.params.projectId;
    let employeeId = req.params.projectId;
    if (projectId !== undefined){
        const PTasks = tasks.filter(k => k.project == projectId);
        res.json(PTasks);
    }else if(employeeId !== undefined){
        const PTasks = employees.filter(k => k.employee == employeeId);
        res.json(PTasks);

    } else {
          res.json(tasks);
    }

   
});

router.get('/filtre',(req,res,next) => {
    const filters = req.query;
    const filteredTasks = tasks.filter(user => {
        let isValid = true;
        for (key in filters) {
            console.log(key, user[key], filters[key]);
            isValid = isValid && user[key] == filters[key];
        }
        return isValid;
    });
    res.send(filteredTasks);
});

router.get('/:id',(req,res) => {
    const thatTask = tasks.find(k => k.id == req.params.id);
    res.json(thatTask);
});

router.post('/',(req,res) => {
    let employeeId = req.params.employeeId;
    let projectId = req.params.projectId;
    let { title, description, employee } = req.body;

    if (projectId === undefined) {
    projectId = req.body.project;
    }
    if (employeeId === undefined) {
    employeeId = req.body.employee;
    }

    console.log(projectId);

    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        employee: parseInt(employeeId),
        status:0,
        isPriority:1,
        project: parseInt(projectId),
        date:new Date().toISOString(),
    };
    tasks.push(newTask);

    const targetPath = path.join(__dirname, '../data/tasks.js');

    const fileContent = `const tasks = ${JSON.stringify(tasks, null, 2)};\n\nmodule.exports = tasks;`;

    const project = projects.find(p => p.id == projectId);

    project.tasks.push(newTask.id);

    const targetPath2 = path.join(__dirname, '../data/projects.js');

    const fileContent2 = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;


    try {

        fs.writeFileSync(targetPath, fileContent, 'utf8');
        fs.writeFileSync(targetPath2, fileContent2, 'utf8');
        
        res.status(201).json({
            success: true,
            mesaj: 'yeni görev eklendi',
            data: newTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mesaj: 'Dosyaya yazılırken bir hata oluştu',
            error: error.message
        });
    }


});

router.delete('/:id',(req,res) => {

    const taskIndex = tasks.findIndex(k => k.id == req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            mesaj: 'Silinmek istenen görev bulunamadı'
        });
    }

    const thatTask = tasks[taskIndex];

    const project = projects.find(p => p.id == thatTask.project);


    if (!project) {
        return res.status(404).json({
            success: false,
            mesaj: 'Görevin bağlı olduğu proje bulunamadı'
        });
    }


    project.tasks = project.tasks.filter(id => id != thatTask.id);


    tasks.splice(taskIndex, 1);


    const targetPath = path.join(__dirname, '../data/tasks.js');
    const fileContent = `const tasks = ${JSON.stringify(tasks, null, 2)};\n\nmodule.exports = tasks;`;

    const targetPath2 = path.join(__dirname, '../data/projects.js');


    const fileContent2 = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        fs.writeFileSync(targetPath2, fileContent2, 'utf8');

        return res.status(200).json({
            success: true,
            mesaj: 'Görev başarıyla silindi',
            remainingTasksCount: tasks.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            mesaj: 'Dosya güncellenirken bir hata oluştu',
            error: error.message
        });
    }
    });

router.put('/:id',(req, res) => {
    const taskId = req.params.id;
    const { title, description, employee, project, status, isPriority, date } = req.body;

    const task = tasks.find(k => k.id == taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            mesaj: 'Güncellenmek istenen görev bulunamadı'
        });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (employee !== undefined) task.employee = employee;
    if (project !== undefined) task.project = project;
    if (status !== undefined) task.status = status;
    if (isPriority !== undefined) task.isPriority = isPriority;
    if (date !== undefined) task.date = date;


    const targetPath = path.join(__dirname, '../data/tasks.js');
    const fileContent = `const tasks = ${JSON.stringify(tasks, null, 2)};\n\nmodule.exports = tasks;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        
        res.status(200).json({
            success: true,
            mesaj: 'Görev başarıyla güncellendi',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mesaj: 'Dosya güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

module.exports = router;