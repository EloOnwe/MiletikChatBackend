import { supabase } from "../config/config.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);


  const { data: user, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }])
    .select("id , name, email");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({message: "User created successfully", data: user});
};

export const getUsers = async (req:Request, res:Response) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email");

  if (error) throw error;

 res.json(data);
 
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email") 
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.json(data);
};


export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password} = req.body;

  let hashedPassword;

   if(password){
         const hashedPassword = await bcrypt.hash(password, 10);
   }




  const { data, error } = await supabase
    .from("users")
    .update({ name, password: hashedPassword })
    .eq("id", id)
    .select("id, name, email");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({message: "User updated successfully", data});
};


export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "User deleted successfully" });
};


// login a user

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    /* find user by email */
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    /* compare password */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    /* create jwt token */
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "5h" }
    );

    /* return safe user data */
    const { password: _, ...safeUser } = user;

    res.json({
      message: "Login successful",
      user: safeUser,
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};