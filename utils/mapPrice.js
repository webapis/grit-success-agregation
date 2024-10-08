function mapPrice(price, obj) {

    // if (price === undefined) {
    //     debugger
    //     throw `${price} price not parsable: ${JSON.stringify(obj)}`
    // }
    if (price === undefined || price.length === 0 || price==='$0.00') {
        return 0
    }
    //
    let trimPrice = price ? price.toString().replace('TL', '').replace('tl', '')
        .replace('₺', '')
        .replace('$', '')
        .replace('€', '')
        .replace('\n', '')
        .replace('USD', '')
        .trim() : 0
    if (price && price?.includes('$') || price?.includes('USD')) {
        const result = parseFloat((parsePrice(trimPrice) * 33.50).toFixed(2))
        if (result === 0) {
            debugger
            return 0
           // throw `${price} price not parsable: ${JSON.stringify(obj)}`
        } else {
            return result
        }

    } else
        if (price&& price?.includes('€')) {
            const result = parseFloat((parsePrice(trimPrice) * 37.01).toFixed(2))
            if (result === 0) {
                debugger
                return 0
             //   throw `${price} price not parsable: ${JSON.stringify(obj)}`
            } else {
                return result
            }

        }
        else {
            const result = parsePrice(trimPrice)
            if (result === 0) {
                debugger
                //  throw `${price} price not parsable: ${JSON.stringify(obj)}`
                return 0
            } else {
                return result
            }
        }



}

export default mapPrice


function parsePrice(trimPrice) {
    switch (true) {
        //1799.95
        case /^\d\d\d[,]\d\d$/.test(trimPrice)://299,99

            return parseFloat(trimPrice.replace(',', '.'))
        case /^\d\d\d[,]\d$/.test(trimPrice)://299,9

            return parseFloat(trimPrice.replace(',', '.'))
        case /^\d\d\d[.]\d$/.test(trimPrice)://299.9
            return parseFloat(trimPrice)
        case /^\d\d\d[.]\d\d$/.test(trimPrice)://299.99

            return parseFloat(trimPrice)
        case /^\d\d\d\d[.]\d\d$/.test(trimPrice)://1499.99

            return parseFloat(trimPrice)
        case /^\d\d\d\d\d[.]\d\d$/.test(trimPrice)://12999.95
            return parseFloat(trimPrice)
        // case /^\d\d\d[.]\d\d\d$/.test(trimPrice)://106.950
        //    return parseFloat(trimPrice.replace('.', ''))
        // case /^\d\d[.]\d\d\d$/.test(trimPrice)://10.950
        //   return parseFloat(trimPrice.replace('.', ''))
        // case /^\d[.]\d\d\d$/.test(trimPrice)://1.950
        //    return parseFloat(trimPrice.replace('.', ''))
        case /^\d[.]\d\d$/.test(trimPrice)://5.96
            return parseFloat(trimPrice)
        case /^\d\d\d\d[.]\d$/.test(trimPrice)://1499.9
            return parseFloat(trimPrice)
        case /^\d\d\d\d[,]\d$/.test(trimPrice)://1499,9
            return parseFloat(trimPrice.replace(',', '.'))
        case /^\d\d\d\d[,]\d\d$/.test(trimPrice)://1499,99

            return parseFloat(trimPrice.replace(',', '.'))
        case /^\d[.]\d\d\d[,]\d\d$/.test(trimPrice)://1.449,90
            return parseFloat(trimPrice.replace('.', '').replace(',', '.'))

        case /^\d[.]\d\d\d$/.test(trimPrice)://1.449
            return parseFloat(trimPrice.replace('.', ''))
        //   case /^\d[,]\d\d\d$/.test(trimPrice)://9,500
        //  return parseFloat(trimPrice.replace(',', ''))

        case /^\d\d\d\d$/.test(trimPrice)://4299

            return parseFloat(trimPrice)
        case /^\d[,]\d\d\d[.]\d\d$/.test(trimPrice)://3,950.00

            return parseFloat(trimPrice.replace(',', ''))
        case /^\d\d[,]\d\d\d[.]\d\d$/.test(trimPrice)://34,950.00
            return parseFloat(trimPrice.replace(',', ''))
        case /^\d\d\d$/.test(trimPrice)://999

            return parseFloat(trimPrice)
        case /^\d\d[,]\d\d$/.test(trimPrice)://81,00

            return parseFloat(trimPrice.replace(',', '.'))
        case /^\d\d[.]\d\d$/.test(trimPrice)://81.00

            return parseFloat(trimPrice)
        case /^\d\d[.]\d$/.test(trimPrice)://99.9

            return parseFloat(trimPrice)


        case /^\d\d[,]\d$/.test(trimPrice)://99,9

            return parseFloat(trimPrice.replace(',', '.'))

        case /^\d\d$/.test(trimPrice)://99

            return parseFloat(trimPrice)
        case /^\d\d[.]\d\d\d[,]\d\d$/.test(trimPrice)://14.918,00

            return parseFloat(trimPrice.replace('.', '').replace(',', '.'))
        case /^\d\d\d[.]\d\d\d[,]\d\d$/.test(trimPrice): //111.345,48 

            return parseFloat(trimPrice.replace('.', '').replace(',', '.'))

        case /^\d\d\d[,]\d\d\d[.]\d\d$/.test(trimPrice): //239,217.00 

            return parseFloat(trimPrice.replace('.', ''))
        case /^\d\d\d\d\d$/.test(trimPrice)://11499

            return parseFloat(trimPrice)
        case /^\d\d[.]\d\d\d$/.test(trimPrice)://14.918

            return parseFloat(trimPrice.replace('.', ''))
        case /^\d\d[,]\d\d\d$/.test(trimPrice)://14,918

            return parseFloat(trimPrice.replace(',', ''))
        default:
            return 0

    }

}