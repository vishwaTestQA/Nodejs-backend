const Employees = require('../../model/Employees');

const getAllEmployees = async (req, res)=>{
  const employees = await Employees.find();
  if(!employees) return res.status(204).json({"message":"No data found"})
  console.log(employees);
  res.json(employees);
} 

const createNewEmployee = async (req, res)=> {
   if(!req?.body?.firstname || !req?.body?.lastname){
    return res.status(400).json({"message": "First and Last name is required"})
   }

   try{
    // const result = await Employees.create(req.body);  // we shouldnt give this becz any data may come apart from required
    const result = await Employees.create({
       firstname: req.body.firstname,
       lastname: req.body.lastname,
       address: req.body.address
    });
    console.log("newEmpl", result)
     //if fails automaticaaly 500 error as we handled in server.js
    res.status(201).json(newEmpl);
   }catch(error){
      console.log(error);
   }
 
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
  if(req.body.id) res.status(400).json({"message": `Id parameter is required`})

  const employee = await Employees.findOne({_id: req.body.id}).exec();
   if(!employee) 
    res.status(204).json({"message": `No Employees matches with the ID ${req.body.id}`})

   //now employee is available
    // if(req.body?.firstname) employee.firstname = req.body.firstname;
    // if(req.body?.lastname) employee.firstname = req.body.lastname;
    // const result = await employee.save();

    employee = {...employee, ...req.body};
    const result = employee.save();
    // const updatedEmp = {...employee, ...req.body}
    // const newSet = data.employees.map(emp => {
    //   emp.id !== empid ? {...emp, ...req.body} : emp
    // });
   
   res.status(200).json(result);
}

const deleteEmployee = async (req,res)=>{
  if(req.body.id) res.status(400).json({"message": `Employee id is required`})

    const employee = await Employees.findOne({_id: req.params.id}).exec();
     if(!employee) 
      res.status(204).json({"message": `No Employees matches with the ID ${req.body.id}`})
  
    const result = await employee.deleteOne({_id: req.body.id});  //no need exec() 
   res.status(200).json({"message": "successfully deleted"});
}

const getEmployee = async (req, res)=>{
  if(req?.params?.id) res.status(400).json({"message": `Employee id is required`})

    const employee = await Employees.findOne({_id: req.body.id}).exec();
    if(!employee) 
     res.status(204).json({"message": `No Employees matches with the ID ${req.body.id}`})
  
    res.status(200).json(employee);
}


module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee
}