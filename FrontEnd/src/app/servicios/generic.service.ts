import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as Excel from "exceljs/dist/exceljs.min.js"
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})

export class GenericService{

    constructor() {}

    public async generatePdf(encabezado: any, data: any): Promise<any> {
    
        // Caracteristicas del formato PDF
        var doc = new jsPDF({
            orientation: 'l',
            format: 'letter',
          }
        );
        doc.setFontSize(11);
    
        // Se agrega imagen
        /* let imagenBase64 = this.imagenSAT;
        await doc.addImage(imagenBase64,'PNG', 7, 7,55,20); */
    
        // Lectura de datos para el reporte
        let datosRep = [];
    
        data.forEach((element) => {
          datosRep.push(
            [
              element.numqueja,
              element.tipoqueja,
              element.puntoatencion,
              element.estado,
              element.etapa,
              element.resultado,
              element.medioingreso,
              `${moment(element.fechacreacion).format('DD/MM/YYYY')}`,
              element.tiempoatencion,
            ]
            );
        });
    
        // Datos del usuario que genera reporte 
        /* doc.text(`${encabezado.usuario}`,272,10,'right');
        doc.text(moment(encabezado.factual).format('DD/MM/YYYY HH:mm'),272,15,'right');
        doc.text(`REGIÓN ${encabezado.region}`,272,20,'right'); */
    
        //Encabezado
        doc.text(`${encabezado.tipoInforme}`,140,25,'center');
        /* doc.text('Nit',10,40);
        doc.text(`${encabezado.nitc}`,40,40);
        doc.text(`${encabezado.nomCon}`,100,40);
        doc.text('Impuesto',10,45);
        doc.text(`${encabezado.codImp}`,40, 45);
        doc.text('Fecha desde',10,50);
        doc.text(`${moment(encabezado.fTempD).format('DD/MM/YYYY')}`,40, 50);
        doc.text('Fecha hasta',70,50);
        doc.text(`${moment(encabezado.fTempH).format('DD/MM/YYYY')}`,100,50);
        doc.text('DETALLE BITÁCORA DE AFILIACIONES',140,60,'center');
        doc.text(`DESDE: ${moment(encabezado.fTempD).format('DD/MM/YYYY')} HASTA: ${moment(encabezado.fTempH).format('DD/MM/YYYY')}`,140,65,'center'); */
        
        // Construccion de la tabla
        doc.autoTable({
          theme: 'plain',
          headStyles: {
            cellWidth: 'auto',
            halign: 'center',
            valign: 'middle',
            lineColor: 1,
            lineWidth: 0.25,
            fontSize: 8
          },
          columnStyles: {
            0: {cellWidth: 18, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            1: {cellWidth: 61, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            2: {cellWidth: 20, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            3: {cellWidth: 30, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            4: {cellWidth: 28, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            5: {cellWidth: 17, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            6: {cellWidth: 23, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            7: {cellWidth: 23, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6},
            8: {cellWidth: 15, halign: 'center', valign: 'middle', lineColor: 1, lineWidth: 0.25, fontSize: 6}},
          margin: 7,
          startY: 70,
          startX: 10,
          lineWidth: 3,
          pageBreak: 'auto',
          rowPageBreak: 'avoid',
          showHead: 'firstPage',
          tableLineColor: 200,
          head: [['NUMERO DE QUEJA','TIPO DE QUEJA','PUNTO DE ATENCION','ESTADO','ETAPA','RESULTADO','MEDIO DE INGRESO','FECHA DE CREACION','TIEMPO DE ATENCION']],
          body: datosRep
        })
        
        // Se genera el documento en pdf
        doc.save("reporte.pdf");
      }
    
    
      // Servicio para generar archivo xlsx
      public async generateExcel(encabezado: any, data: any[]): Promise<any> {/* 
    
        // let fechaInicial='10/01/2018';
        // let fechaFinal='25/11/2018';
        
        
        // Creacion del libro de excel 
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet('Reporte');
    
        // Ajuste de tamaño de las columnas
        worksheet.getColumn(1).width = 13;
        worksheet.getColumn(2).width = 15;
        worksheet.getColumn(3).width = 45;
        worksheet.getColumn(4).width = 45;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 15;
        worksheet.getColumn(7).width = 25;
        worksheet.getColumn(8).width = 15;
        worksheet.getColumn(9).width = 20;
        // worksheet.getColumn(10).width = 20;
        
        // Informacion del usuario
        worksheet.addRow([]);
        let user = worksheet.getCell(`I2`);
        let dateUser = worksheet.getCell(`I3`);
        let regionUser = worksheet.getCell(`I4`);
        let officeUser = worksheet.getCell(`I5`);
        worksheet.addRow([]);
        
        user.value = encabezado.usuario.toUpperCase();
        dateUser.value = moment(fechaActual).format('DD/MM/YYYY');
        regionUser.value = `REGIÓN ${encabezado.region}`;
        officeUser.value = encabezado.oficina;
    
        user.alignment = { horizontal: "right", vertical: "middle" };
        dateUser.alignment = { horizontal: "right", vertical: "middle" };
        regionUser.alignment = { horizontal: "right", vertical: "middle" };
        officeUser.alignment = { horizontal: "right", vertical: "middle" };
    
        // Encabezado del reporte
        let titleRow = worksheet.addRow([title]);
        let dateRow = worksheet.addRow([fecha]);
        worksheet.mergeCells(`A${titleRow.number}:I${titleRow.number}`);
        worksheet.mergeCells(`A${dateRow.number}:I${dateRow.number}`);
        titleRow.height = 35;
        titleRow.alignment = { horizontal: "center", vertical: "middle" };
        dateRow.alignment = { horizontal: "center", vertical: "middle" };
        titleRow.font = { name: 'Calibri (Cuerpo)', family: 4, size: 16, bold: true };
        dateRow.font = { name: 'Calibri (Cuerpo)', family: 4, size: 12, bold: true };
        worksheet.addRow([]);
        
        // Titulo de las columnas
        let headerRow = worksheet.addRow(header);
        headerRow.font = { bold: true };
        headerRow.eachCell((cell) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
          cell.alignment = { horizontal: "center", vertical: "middle" }
        });
    
        // Lectura de los datos
        data.forEach((element, index) => {
          let row = worksheet.addRow(
            [
              (index + 1),
              element.region,
              element.enteinscriptor,
              element.tipogestion,
              element.codigogestion,
              element.identificacion,
              element.estado,
              `${moment(element.fechaestado).format('DD/MM/YYYY')}`,
              element.usuario
            ]
          )
          row.alignment = { horizontal: "center", vertical: "middle" };
          row.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(3).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(4).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(5).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(6).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(7).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(8).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          row.getCell(9).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
    
        // Resumen
        worksheet.addRow([]);
        worksheet.addRow([]);
        let footerRow = worksheet.addRow(['Resumen']);
        let footerIns = worksheet.addRow(['Informes de inscripción']);
        let footerAct = worksheet.addRow(['Informes de actualización']);
        let footerCese = worksheet.addRow(['Informes de cese']);
        let footerTotal = worksheet.addRow(['Total']);
        footerRow.font = { bold: true };
        footerTotal.font = { bold: true };
        footerRow.alignment = { horizontal: "center", vertical: "middle" };
        footerTotal.alignment = { horizontal: "center", vertical: "middle" };
    
        // Bordes de las celdas de resumen
        footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        footerIns.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        footerAct.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        footerCese.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        footerTotal.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };    
    
        // Combinacion de las celdas de informes
        worksheet.mergeCells(`A${footerRow.number}:C${footerRow.number}`);
        worksheet.mergeCells(`A${footerIns.number}:B${footerIns.number}`);
        worksheet.mergeCells(`A${footerAct.number}:B${footerAct.number}`);
        worksheet.mergeCells(`A${footerCese.number}:B${footerCese.number}`);
        worksheet.mergeCells(`A${footerTotal.number}:B${footerTotal.number}`);
    
        // Se definen los valores del resumen
        worksheet.getCell(`C${footerIns.number}`).value = resumen.informeInscripcion;
        worksheet.getCell(`C${footerAct.number}`).value = resumen.informeActualizacion;
        worksheet.getCell(`C${footerCese.number}`).value = resumen.informeCese;
        worksheet.getCell(`C${footerTotal.number}`).value = resumen.total;
    
        // Bordes de los subtotales
        worksheet.getCell(`C${footerIns.number}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell(`C${footerAct.number}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell(`C${footerCese.number}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell(`C${footerTotal.number}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    
        // Personalizacion de los subtotales
        worksheet.getCell(`C${footerIns.number}`).alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell(`C${footerAct.number}`).alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell(`C${footerCese.number}`).alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getCell(`C${footerTotal.number}`).alignment = { horizontal: "center", vertical: "middle" };
    
        // Se construye el documento xlsx
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs.saveAs(blob, 'repRevInfo.xlsx');
        }); */
      }
}