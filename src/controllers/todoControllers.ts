import type { Request, Response } from "express"; 
import { supabase } from "../config/config.js";

interface AuthRequest extends Request {
  user?: {
    id: string
  }
}
 
export const createTodo = async(req: AuthRequest, res: Response) => {
    const {title } = req.body
    const user_id = req.user?.id

     if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  
  // 3. Insert into database
  const result = await supabase
    .from("todos")
    .insert([{ title: title , user_id: user_id }])
    .select();

  // 4. Check for error
  if (result.error) {
    return res.status(400).json({
      message: result.error.message,
    });
  }

  // 5. Send response
  return res.status(201).json(result.data[0]);
 
 }
   
 export const getAllTodos = async(req: AuthRequest, res: Response) =>{
    const { data, error } = await supabase
    .from("todos")
    .select("*")
 
    if(error){
        return res.status(400).json(error.message)
    }
    res.status(200).json(data)
 }

  export const getAllTodosById = async(req: AuthRequest, res: Response) =>{
      
    const userId = Number(req.params.id)
     if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" })
    }
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
 
    if (error) {
      return res.status(400).json({ message: error.message })
    }

     return res.status(200).json({
      success: true,
      todos: data
    })

 }

 

 // controllers/todoController.ts

export const updateTodoTitle = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // 🔒 Check authentication
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 🔍 Validate title
    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ message: "Valid title is required" });
      return;
    }

    // 🔎 Check if todo exists and belongs to user
    const { data: existing } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (!existing) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    // 🚀 Update ONLY the title
    const { data, error } = await supabase
      .from("todos")
      .update({ title: title.trim() })
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    // ✅ Success
    res.status(200).json({
      message: "Todo updated successfully",
      todo: data?.[0],
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateTodoCompleted = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // 🔒 Check authentication
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 🔍 Validate completed
    if (typeof completed !== "boolean") {
      res.status(400).json({
        message: "Completed must be true or false",
      });
      return;
    }

    // 🔎 Check if todo exists and belongs to user
    const { data: existing } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (!existing) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    // 🚀 Update ONLY completed field
    const { data, error } = await supabase
      .from("todos")
      .update({ completed }) // ✅ only this field
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    // ✅ Success
    res.status(200).json({
      message: "Todo completion updated successfully",
      todo: data?.[0],
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// To delete a todo

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 🔒 Check authentication
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 🔎 Check if todo exists and belongs to user
    const { data: existing } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (!existing) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    // 🗑️ Delete todo
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    // ✅ Success
    res.status(200).json({
      message: "Todo deleted successfully",
    });

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getSingleTodoById = async (req:AuthRequest, res:Response)=>{
   const id = Number(req.params.id);
   const userId = Number(req.user?.id)
  
   const { data: existing } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

       if (!existing) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

     const { data, error } = await supabase
      .from("todos")
      .select()
       .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.send(data)
 }

 