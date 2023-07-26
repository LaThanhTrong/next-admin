import {model, models, Schema} from "mongoose";

const UadminSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {timestamps: true})

export const Uadmin = models?.Uadmin || model('Uadmin', UadminSchema);