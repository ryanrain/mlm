export interface LecturaPreguntaModel {
    pregunta:string;
    respuesta1:string;
    respuesta2:string;
    respuesta3:string;
    respuestaCorrecta:string;
}

export interface LecturaModel {
    title:string;
    text:string;
    fileName:string;
    preguntas: LecturaPreguntaModel[];
}