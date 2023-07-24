import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Uadmin } from "@/models/Uadmin";

export default async function handle(req,res){
    await mongooseConnect()
    await isAdminRequest(req, res)
    var hash = require('hash.js')
    
    if(req.method === "POST"){
        const {uemail, userName, userPassword} = req.body;
        const ecrypted = hash.sha512().update(userPassword).digest('hex')
        if(await Uadmin.findOne({uemail})){
            res.status(400).json({message:'User Admin already exists!'})
        }
        else{
            res.json(await Uadmin.create({
                name: userName,
                email: uemail,
                password: ecrypted,
            }));
        }
    }

    if(req.method === "DELETE"){
        const {_id} = req.query;
        await Uadmin.findByIdAndDelete(_id);
        res.json(true)
    }

    if(req.method === "GET"){
        res.json(await Uadmin.find())
    }
}