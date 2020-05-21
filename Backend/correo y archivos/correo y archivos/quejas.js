const quejas = require('../Models/quejasRepository');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mailer = require('../templates/quejas-creada-template')


let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../docs')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const carga = multer({storage});

router.post('/quejas/archivo',carga.single('file'),(req,res)=>{
    return res.status(200).send([req.file]);
});


router.post('/quejas',(req,res)=>{
    if(req.body){
        quejas.insert(req.body)
        .then(quejas=>{
            console.log(quejas.insertId);
           mailer.enviar_email(req.body.correo,quejas.insertId,req.body.nombre,req.body.ingreso);
            res.status(200).send([{
                codigo:quejas.insertId
            }]);
        })
        .catch(err=>{
            console.error(err);
            res.status(500).send({
                mesage:'Error al insertar datos'
            });
        }); 
    }else{
        res.status(500).send({
         mesage:'Error al insertar datos'
        });
    }   
});

router.get('/quejas/:codigo_queja',(req,res)=>{
    
    if(req.params.codigo_queja!=null){
        quejas.getByCodigoQueja(req.params.codigo_queja)
                    .then(quejas=>{
                        res.status(200).send(quejas);
                    })
                    .catch(err=>{
                        console.error(err);
                        return res.status(500).send({
                            mesage:'Error al obtener datos'
                        });
                    });

    }
    else{
        return res.status(500).send({
            mesage:'Error al obtener datos'
        });  
    }
    
});


module.exports= router;