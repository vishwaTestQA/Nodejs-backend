const data = {
  employees: require('../../public/json/employees.json'),
  setEmployees: function(data){
    this.employees = data
  }
};


const getAllEmployees = (req, res)=>{
  res.status(200).json(data.employees);
} 

const createNewEmployee = (req, res)=> {
   //post req comming with body to create resource
   const newEmpl = {
    id: data.employees[data.employees.length-1].id + 1 || 1,
    firstname: req.body.firstname, 
    lastname: req.body.lastname      //urlencoding middleware is using for this
   }
   if(!newEmpl.firstname || !newEmpl.lastname){
    return res.status(400).json({"message": "First and Last name is required"})
   }

   data.setEmployees([...data.employees, newEmpl]);
   res.status(201).json(newEmpl);
}

// const updateEmployee = (req, res)=>{
//   const empid = parseInt(req.body.id);
//   const employee = data.employees.find(emp => emp.id === empid)
//    if(!employee) 
//     res.status(400).json({"message": `Employee id ${res.req.body} not found`})

//    if(req.body.firstname) employee.firstname = req.body.firstname;
//    if(req.body.lastname) employee.lastname = req.body.lastname;

//    const filteredEmpl = data.employees.filter(emp => emp.id !== empid);
//    const unsortedArray = [...filteredEmpl, employee];
//    const sortedEmpl = unsortedArray.sort((e1,e2)=> e1.id > e2.id ? 1 : e1.id < e2.id ? -1 : 0);
//    data.setEmployees(sortedEmpl)
//    res.status(200).json(employee);
// }

// const updateEmployee = (req, res)=>{
//   const empid = parseInt(req.body.id);
//   const employee = data.employees.find(emp => emp.id === empid)
//    if(!employee) 
//     res.status(400).json({"message": `Employee id ${res.req.body} not found`})

//     const updatedEmp = {...employee, ...req.body}
//     const filteredEmpl = data.employees.filter(emp => emp.id !== empid);
//     const newSet = [...filteredEmpl, updatedEmp];
//    const sortedEmpl = newSet.sort((e1,e2)=> e1.id > e2.id ? 1 : e1.id < e2.id ? -1 : 0);
//    data.setEmployees(sortedEmpl)
//    res.status(200).json(updatedEmp);
// }

const updateEmployee = async (req, res)=>{
  const empid = parseInt(req.body.id);
  const employee = data.employees.find(emp => emp.id === empid)
   if(!employee) 
    res.status(400).json({"message": `Employee id ${req.body.id} not found`})

    // const updatedEmp = {...employee, ...req.body}
    const newSet = data.employees.map(emp => {
      emp.id !== empid ? {...emp, ...req.body} : emp
    });

    const updatedEmp = data.employees.find(emp => emp.id === empid)
  //   const newSet = [...filteredEmpl, updatedEmp];
  //  const sortedEmpl = newSet.sort((e1,e2)=> e1.id > e2.id ? 1 : e1.id < e2.id ? -1 : 0);
   data.setEmployees(newSet)
   res.status(200).json(updatedEmp);
}

const deleteEmployee = (req,res)=>{
  const empid = parseInt(req.body.id);
  const employee = data.employees.find(emp => emp.id === empid)
   if(!employee) 
    res.status(400).json({"message": `Employee id ${req.body.id} not found`})

   const filteredEmpl = data.employees.filter(emp => emp.id !== empid);
   data.setEmployees(filteredEmpl)
   res.status(200).json({"message": "successfully deleted"});
}

const getEmployee = (req, res)=>{
  const empid = parseInt(res.body.id);
  const employee = data.employees.find(emp => emp.id === empid)
   if(!employee) {
    return res.status(400).json({"message": `Employee id ${req.body.id} not found`})
   }
   
    res.status(200).json(data.employees);
}


module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
}