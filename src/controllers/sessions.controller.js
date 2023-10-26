import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {

    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
}

const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}

const unprotectedLogin  = async(req,res) =>{
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    console.log(user);
    let userMock = {
        role: 'user',
        _id: "64e00640a2f30858268b33f4",
        name: 'Andres',
        lastname: 'Manzano',
        email: 'ar.manzano.94@gmail.com',
        password: '$2b$10$2inq1nZll.c/c7xzGVieZuqIC2sGeFbPjWJAcpS30aucrj/5BkC1a',
        phone: '313721833',
        birthday: "1992-01-25T00:00:00.000Z",
        photo: 'https://randomuser.me/api/portraits/men/10.jpg',
        address: 'Call 45 # 98 - 56',
        city: 'Rosario',
        state: 'Santa Fe',
        zipcode: 'S2002',
        country: 'Argentina',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZTAwNjQwYTJmMzA4NTgyNjhiMzNmNCIsImlhdCI6MTY5Mzc5ODg5OSwiZXhwIjoxNjk3Mzk4ODk5fQ.lLzfuaSfmK2rxFZJIhi6QciqJWWXc1WE_ZhAs8MrXKk',
        isActive: true,
        rol_id: "64dff8128d3cf6d1d15b1fcf",
        __v: 0,
        pets: []
      }
    const token = jwt.sign(userMock,'tokenSecretJWT',{expiresIn:"1h"});
    console.log("MI TOKEN --> ", token);
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}