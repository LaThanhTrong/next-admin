import { mongooseConnect } from "@/lib/mongoose";
import { OrderDetail } from "@/models/OrderDetail";
import { Order } from "@/models/Order";

export default async function handler(req, res){
    await mongooseConnect()
    res.json(await OrderDetail.find().populate('order'))
}