'use strict'
const nodemailer = require('nodemailer');
const data = require('../Configs/conf');

this.enviar_email = (pPara,pQueja,pNombre,pTipoQueja)=>{
    console.log('para',pPara,'queja',pQueja,'nombre',pNombre);
       let transporter = nodemailer.createTransport({
           service:'gmail',
           auth:{
               user:data.MAILUSER,
               pass:data.MAILPSSWD
           }
       });
       console.log(pTipoQueja);
       
        let today = new Date();
        let year = today.getFullYear();
       let mensaje ="";
        if(pTipoQueja=="CuentaHabiente"){
             mensaje = ` Señor cuentahabiente,  agradecemos su comunicación,  le informamos que su queja ha sido recibida exitosamente. Para el seguimiento o cualquier consulta relacionada, no olvide que el número de su queja es QMS-${pQueja}-${year}`;
           }
           else{
             mensaje = ` Señ@r ${pNombre},  agradecemos su comunicación,  le informamos que su queja ha sido recibida exitosamente. Para el seguimiento o cualquier consulta relacionada, no olvide que el número de su queja es QMS-${pQueja}-${year}`; 
           }

       let mail_option={
        from:'prueba',
        to:pPara,
        subject:'Registro de quejas',
        html:`<table border="0" cellpadding="0" cellspacing="0" width="600px" >
        <tr height="200px">  
            <td bgcolor="" width="600px">
                <h1 style="text-align:center">Asociación Bancaria Pistio</h1>
                <p  style="text-align:center">
                        ${mensaje}
                </p>
            </td>
        </tr>
        <tr bgcolor="#fff">
            <td style="text-align:center">
                <p style="color: #000">¡Un mundo de servicios a su disposición!</p>
            </td>
        </tr>
        </table>`
       };
       transporter.sendMail(mail_option,(err,info)=>{
                if(err){
                    console.err(err);
                }else{
                    console.log('El correo se envio correctamente',info);
                }
       })
};

module.exports= this;