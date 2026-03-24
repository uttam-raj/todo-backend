const Todo = require('../models/todo-model');


//Create new todo
 const createTodo =async(req,res)=>{
    try {
        const {content,dueDate, category,checked=false} = req.body;
        const userId = req.user.userId; // assuming you have auth middleware

        const newTodo = await Todo.create({content,dueDate,category,userId,checked});
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error });
    }
};


// Get All (with optional filters)
 const getTodos= async (req,res)=>{
    try {
    const { search = "", filter = "all" } = req.query;
    const userId = req.user.userId;                     //get the authenticated user Id from JWT

    const query = {                                     //create a query object allows to Always filters by userId (so users only see their own todos).
      userId,
      ...(search && { content: { $regex: search, $options: "i" } }),    //req.query.search = "search value"
    };

    if (filter === "completed") query.checked = true;
    else if (filter === "pending") query.checked = false;
    else if (["work", "personal", "urgent", "other"].includes(filter)) query.category = filter;  

    const todos = await Todo.find(query).sort({ order: 1 });       //fetch the match todos  and createdAt: -1 sorted in descending order(latest first)
    res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching todos", error });
    };
 };


 const toggleChecked = async(req,res)=>{
    try {
    const userId = req.user?.userId;
    const todoId = req.params.id;

        if (!userId) {
      console.error("Missing userId in request");
      return res.status(401).json({ message: "Unauthorized" });
    }
        const todo = await Todo.findOne({
            _id: todoId,
            userId,});        //get the particular data based on id 

            // console.log("Toggled todo:", todo);

         if (!todo) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
                }

        todo.checked = !Boolean(todo.checked);                  //changed checked true to false and vice versa
        console.log(todo.checked);
        await todo.save();                                      //save in the db
       return res.status(200).json(todo);                                         //send updated data to the frontend part.
    } catch (error) {
        console.error("Toggle Error:", error);
        res.status(500).json({message:"Error updating todo",error});
    }
 };


 const deleteTodo = async (req,res)=>{
    
    try {
        const userId = req.user.userId;

        const todo = await Todo.findOneAndDelete({
                    _id: req.params.id,
                     userId: userId,
            });


    if(!todo){
        return res.status(404).json({message:"Todo not found or unauthorized"});
    }
    res.status(200).json({message:"Todo delete"});
    } catch (error) {
        res.status(500).json({message:"Error deleting todo",error});
    }
 };

 // Update task order
const updateOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderedIds } = req.body; // array of todo IDs in new order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "Invalid orderedIds format" });
    }

    // Update order value for each todo
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, userId },
        update: { order: index },
      },
    }));

    await Todo.bulkWrite(bulkOps);

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({ message: "Error updating order", error });
  }
};



 module.exports= {createTodo,getTodos,toggleChecked,deleteTodo,updateOrder};