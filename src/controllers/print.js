import luckysheetConfigsetting from './luckysheetConfigsetting';
import {zoomChange} from './zoom';
import sheetmanage from './sheetmanage';
import server from './server';
import {rowLocationByIndex, colLocationByIndex,mouseposition,rowLocation,colLocation} from '../global/location';
import Store from '../store';
import { getRangeAxis, getRangeHtml } from '../global/api'
import { getSheetIndex } from '../methods/get'

let ExcelPlaceholder = {
    "[tabName]":"&A",
    "[CurrentDate]":"&D",
    "[fileName]":"&F",
    "[background]":"&G",
    "[Shadow]":"&H",
    "[TotalPages]":"&N",
    "[pageNumber]":"&P",
    "[CurrentTime]":"&T",
    "[filePath]":"&Z",
}

// Get the pixel value per millimeter
function getOneMmsPx (){
    let div = document.createElement("div");
    div.style.width = "1mm";
    document.querySelector("body").appendChild(div);
    let mm1 = div.getBoundingClientRect();
    let w = mm1.width;
    $(div).remove();
    return mm1.width;
}

export function viewChange(curType, preType){
    let currentSheet = sheetmanage.getSheetByIndex();

    if(currentSheet.config==null){
        currentSheet.config = {};
    }

    if(currentSheet.config.sheetViewZoom==null){
        currentSheet.config.sheetViewZoom = {};
    }

    let defaultZoom = 1, type="zoomScaleNormal";
    printLineAndNumberDelete(currentSheet);
    if(curType=="viewNormal"){
        type = "viewNormalZoomScale";
    }
    else if(curType=="viewLayout"){
        type = "viewLayoutZoomScale";
    }
    else if(curType=="viewPage"){
        type = "viewPageZoomScale";
        defaultZoom = 0.6;
        printLineAndNumberCreate(currentSheet);
    }



    let curZoom = currentSheet.config.sheetViewZoom[type];
    if(curZoom==null){
        curZoom = defaultZoom;
    }

    currentSheet.config.curentsheetView = curType;

    if (Store.clearjfundo) {
        Store.jfredo.push({
            "type": "viewChange",
            "curType": curType,
            "preType": preType,
            "sheetIndex": Store.currentSheetIndex,
        });
    }

    // Store.zoomRatio = curZoom;
    // server.saveParam("all", Store.currentSheetIndex, curZoom, { "k": "zoomRatio" });
    server.saveParam("cg", Store.currentSheetIndex, curType, { "k": "curentsheetView" });

    Store.currentSheetView = curType;

    zoomChange(curZoom);
}


function printLineAndNumberDelete(sheet){

}

function printLineAndNumberCreate(sheet){

}

function switchViewBtn($t){
    let $viewList = $t.parent(), preType=$viewList.find("luckysheet-print-viewBtn-active").attr("type");
    if($t.attr("type") == preType){
        return;
    }

    let curType = $t.attr("type");
    if(curType!=null){
        viewChange(curType, preType);
    }
    else{
        return;
    }

    $t.parent().find(".luckysheet-print-viewBtn").removeClass("luckysheet-print-viewBtn-active");
    $t.addClass("luckysheet-print-viewBtn-active");
}

export function printInitial(){
    let container = luckysheetConfigsetting.container;
    let _this = this;
    $("#"+container).find(".luckysheet-print-viewBtn").click(function(){
        switchViewBtn($(this));
    });

}

export function printSettingArea () {
    debugger
    const printAreas = Store.luckysheetfile[0].printAreas || []
    const tableData = printAreas.map(range => getRangeHtml({range}))
    const htmlStr = tableData.join('')
    const newTab = window.open()
    newTab.onload = () => {
        const printHtml = `<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;background:url('../assets/images/watermark.png') top left repeat transparent;">${htmlStr}</div>`
        newTab.document.write(`${printHtml}`);
        newTab.print();
        // newTab.close();
        // newTab.location.reload();
    }
}

export function savePrintSettingArea () {
    let ranges = getRangeAxis()
    Store.luckysheetfile[Store.orderbyindex].printAreas = ranges
}

/**
 *
 * @param number 切割多少个
 * @param path 访问路径
 */
function genCrossPageSeal(number, path) {
    let crossPageSeal = []
    let image = new Image()
    image.style = path
    const imgWidth = image.width
    const imgHeight = image.height
    const integralLength = imgWidth / number
    for (let i = 0; i < number; i++) {gst
        const x = i * integralLength
        const y = imgHeight
        const width = integralLength
        const height = imgHeight
        const canvas=$('<canvas width="'+width+'" height="'+height+'"></canvas>')[0], ctx=canvas.getContext('2d');
        ctx.drawImage(image,x,y,width,height,0,0,width,height);
        const base64Img = canvas.toDataURL()
        crossPageSeal.push(base64Img)
    }
    return crossPageSeal
}
