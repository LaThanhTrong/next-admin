import {model, models, Schema} from "mongoose";

const UadminSchema = new Schema({
    name: String,
    email: {type: String, required: true, unique: true},
    password: String,
}, {timestamps: true})

export const Uadmin = models?.Uadmin || model('Uadmin', UadminSchema);