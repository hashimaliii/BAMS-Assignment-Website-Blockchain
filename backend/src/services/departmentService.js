const Hierarchy = require('../core/HierarchyManager.js');

const departmentService = {
    getAllDepartments: () => {
        return Hierarchy.getDepartments();
    },

    getDepartmentById: (id) => {
        return Hierarchy.getDepartmentChain(id);
    },

    createDepartment: (id, name) => {
        const departmentChain = Hierarchy.addDepartmentChain(id, name); 
        return { 
            message: `Department ${name} added with ID ${id}.`, 
            currentHash: departmentChain.currentHash 
        };
    },

    updateDepartment: (id, name) => {
        const departmentChain = Hierarchy.getDepartmentChain(id);
        if (!departmentChain) throw new Error('Department not found.');

        const updateBlock = departmentChain.addBlock({ 
            type: 'UPDATE_DEPARTMENT', 
            name: name 
        }, 'updated');
        
        return { 
            message: `Department ${id} updated to ${name}.`,
            blockHash: updateBlock.hash
        };
    },

    deleteDepartment: (id) => {
        const departmentChain = Hierarchy.getDepartmentChain(id);
        if (!departmentChain) {
            throw new Error('Department not found.');
        }

        const deleteBlock = departmentChain.addBlock({ 
            type: 'DELETE_DEPARTMENT', 
            message: `Department ${id} logically deleted.` 
        }, 'deleted'); 

        return { 
            message: `Department ${id} marked as deleted in block ${deleteBlock.index}.`,
            blockHash: deleteBlock.hash
        };
    },
};

module.exports = departmentService;