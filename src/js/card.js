import { addWrapper, capitalizePrint } from './functions'
import Print from './print'

export default {
    print: (params, printFrame) => {
        // Check if we received proper data
        if (typeof params.printable !== 'object') {
            throw new Error('Invalid javascript data object (card).')
        }

        // Variable to hold html string
        let htmlData = ''

        // Check print has header
        if (params.header) {
            htmlData += '<h1 style="' + params.headerStyle + '">' + params.header + '</h1>'
        }

        // Build html data
        htmlData += cardToHTML(params)

        // Store html data
        params.htmlData = addWrapper(htmlData, params)

        // Print json data
        Print.send(params, printFrame)
    }
}

function cardToHTML (params) {
    let data = params.printable

    let pTop = params.cardLayout[0]
    let pRight = params.cardLayout[1]
    let pBottom = params.cardLayout[2]
    let pLeft = params.cardLayout[3]

    let cHeight = params.cardLayout[4]
    let cWidth = params.cardLayout[5]

    let pageBreak = params.cardLayout[6]
    let specialMessage = typeof params.cardLayout[7] !== 'undefined' ? params.cardLayout[7] : false
    console.log(params)

    let htmlData = ''
    // Create html data
    for (let i = 0; i < data.length; i++) {
        if ( (i % pageBreak) === 0){
            htmlData += '<div style="display:flex; flex-direction: row; flex-wrap: wrap; margin:'+ pTop +' '+ pRight +' '+ pBottom +' '+ pLeft +'; page-break-after: always;">'
        }
        htmlData += '<div style="height:' + cHeight + '; width:' + cWidth + '; display: flex; justify-content: center; align-items: left; flex-direction: column;">'
        htmlData += '<div style="padding:0 8mm 0 8mm; font-size: 13px; font-weight: 300;">' + data[i]["title"] + '</div>'
        htmlData += '<div style="padding:0 8mm 0 8mm; font-size: 11px; font-weight: 300;">' + data[i]["content"] + '</div>'
        htmlData += '<div style="padding:0 8mm 0 8mm; font-size: 11px; font-weight: 300;">' + data[i]["subcontent"] + '</div>'
        if (specialMessage){
            htmlData += '<div style="margin: 1mm 8mm; padding:0.5mm; font-size: 10px; border: 2px solid #000; top: 0px; font-weight:bold;">' + specialMessage + '</div>'
        }
        htmlData += '</div>'
        if ( (i % pageBreak) === (pageBreak - 1) ){
            htmlData += '</div>'
        }
    }
    return htmlData
}
