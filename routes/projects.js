const express = require('express');
const router = express.Router();
const tasks = require('../data/tasks');
const projects = require('../data/projects');
const fs = require('fs');
const path = require('path');
const logger = require('../middleware/logger');
const employees = require('../data/employees')

router.use(logger);

router.get('/',(req,res) => {
    res.json(projects);
});

router.get('/:id',(req,res) => {
    const thatProject = projects.find(k => k.id == req.params.id);
    res.json(thatProject);
});

router.post('/',(req,res) => {
    const {title, description, employees} = req.body;

    const newProject = {
        id: projects.length + 1,
        title,
        description,
        employees,
        tasks:[],
        date: new Date().toISOString(),
    };
    projects.push(newProject);

    const targetPath = path.join(__dirname, '../data/projects.js');

    const fileContent = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;


    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        
        res.status(201).json({
            success: true,
            mesaj: 'yeni görev eklendi',
            data: newProject
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
    
    console.log(req.params.id);
    console.log(1);

    const projectIndex = projects.findIndex(k => k.id == req.params.id);

    if (projectIndex === -1) {
        return res.status(404).json({
            success: false,
            mesaj: 'Silinmek istenen görev bulunamadı'
        });
    }

    projects.splice(projectIndex, 1);

    const targetPath = path.join(__dirname, '../data/projects.js');
    const fileContent = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;

    tasks = tasks.filter(k => k.project !== Number(req.params.id));

    const targetPath2 = path.join(__dirname, '../data/tasks.js');
    const fileContent2 = `const tasks = ${JSON.stringify(tasks, null, 2)};\n\nmodule.exports = tasks;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        fs.writeFileSync(targetPath2, fileContent2, 'utf8');
        
        res.status(200).json({
            success: true,
            mesaj: 'Görev başarıyla silindi',
            remainingTasksCount: projects.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mesaj: 'Dosya güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});

router.put('/:id/addEmployee',(req, res) => {
    const projectId = req.params.id;
    const {id, name } = req.body;

    const project = projects.find(k => k.id == projectId);

    if (!project) {
        return res.status(404).json({
            success: false,
            mesaj: 'Güncellenmek istenen görev bulunamadı'
        });
    }

    let employeeId;

    if (id !== undefined) {
        employeeId = employees.find(k => k.id == id).id;

    }
    else if (name !== undefined) {
        employeeId = employees.find(k => k.name == name).id;
    } 
    else{
         return res.status(404).json({
            success: false,
            mesaj: 'Calisan bulunamadı'
        });
    }
  
    project.employees.push(employeeId);

    const targetPath = path.join(__dirname, '../data/projects.js');
    const fileContent = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        
        res.status(200).json({
            success: true,
            mesaj: 'Görev başarıyla güncellendi',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mesaj: 'Dosya güncellenirken bir hata oluştu',
            error: error.message
        });
    }
});


router.put('/:id',(req, res) => {
    const projectId = req.params.id;
    const { title, description, employees, tasks} = req.body;

    const project = projects.find(k => k.id == projectId);

    if (!project) {
        return res.status(404).json({
            success: false,
            mesaj: 'Güncellenmek istenen project bulunamadı'
        });
    }
n
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (employees !== undefined) project.employees = employees;
    if (tasks !== undefined) project.tasks = tasks;

    const targetPath = path.join(__dirname, '../data/projects.js');
    const fileContent = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        
        res.status(200).json({
            success: true,
            mesaj: 'project başarıyla güncellendi',
            data: project
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