//importamos las dependencia mongoose
const { Schema, model } = require("mongoose");

// Se genera el esquema base
const agenda_schema = new Schema({
    name: { type: String, require: true },
    lastName: String,
    age: Number,
    random: Number,
});

const mosaic = new Schema({
    ip: { type: String, require: true },
    x: Number,
    y: Number,
    color: String,
    age: Number,
});

// exportamos el schema generado
exports.agenda = model("agenda", agenda_schema);
exports.mosaic = model("mosaic", mosaic);