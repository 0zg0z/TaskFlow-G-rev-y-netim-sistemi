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
    res.json(employees);
});

router.get('/:id',(req,res) => {
    const thatEmployee = employees.find(k => k.id == req.params.id);
    res.json(thatEmployee);
});

router.post('/',(req,res) => {
    const name = req.body;

    const newEmployee = {
        id: employees.length + 1,
        name,
        tasks:[],
        projects:[],
    };
    employees.push(newEmployee);

    const targetPath = path.join(__dirname, '../data/employees.js');

    const fileContent = `const employees = ${JSON.stringify(employees, null, 2)};\n\nmodule.exports = employees;`;


    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        
        res.status(201).json({
            success: true,
            mesaj: 'yeni görev eklendi',
            data: newEmployee
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
    

    const employeeIndex = employees.findIndex(k => k.id == req.params.id);

    if (employeeIndex === -1) {
        return res.status(404).json({
            success: false,
            mesaj: 'Silinmek istenen görev bulunamadı'
        });
    }

    employees.splice(employeeIndex, 1);

    const targetPath = path.join(__dirname, '../data/employees.js');
    const fileContent = `const employees = ${JSON.stringify(employees, null, 2)};\n\nmodule.exports = employees;`;

    let employeesTasks = tasks.filter(k => k.employee === Number(req.params.id));

    employeesTasks.forEach((task) => {
        task.employee = 1;
    });

    console.log(tasks);

    const targetPath2 = path.join(__dirname, '../data/tasks.js');
    const fileContent2 = `const tasks = ${JSON.stringify(tasks, null, 2)};\n\nmodule.exports = tasks;`;

    projects.forEach((project) => {
        project.employees = project.employees.filter(id => id!= Number(req.params.id));
    });

    console.log(projects);

    const targetPath3 = path.join(__dirname, '../data/projects.js');
    const fileContent3 = `const projects = ${JSON.stringify(projects, null, 2)};\n\nmodule.exports = projects;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        fs.writeFileSync(targetPath2, fileContent2, 'utf8');
        fs.writeFileSync(targetPath3, fileContent3, 'utf8');
        
        res.status(200).json({
            success: true,
            mesaj: 'Görev başarıyla silindi',
            remainingTasksCount: employees.length
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
    const employeeId = req.params.id;
    const { name, projects, tasks} = req.body;

    const employee = employees.find(k => k.id == employeeId);

    if (!employee) {
        return res.status(404).json({
            success: false,
            mesaj: 'Güncellenmek istenen project bulunamadı'
        });
    }

    if (name !== undefined) employee.name = name;
    if (projects !== undefined) employee.projects = projects;
    if (tasks !== undefined) employee.tasks = tasks;

    const targetPath = path.join(__dirname, '../data/employees.js');
    const fileContent = `const employees = ${JSON.stringify(employees, null, 2)};\n\nmodule.exports = employees;`;

    try {
        fs.writeFileSync(targetPath, fileContent, 'utf8');
        
        res.status(200).json({
            success: true,
            mesaj: 'project başarıyla güncellendi',
            data: employee
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