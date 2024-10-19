function mapPrice(raw, obj) {


    try {
        if (raw === undefined) {
            return 0
        }
        const price = raw.replace('İtibaren', '')
        switch (true) {
            case price === undefined:
            case price === '':
            case price === '0,00':
            case price === '€0,00':

                return 0
            case price.replace('TL', '').replaceAll(' ', '') === '0':

                return 0;
            case price.includes('TL'):
            case price.includes('₺'):
                return parsePrice(price.replace('TL', '').replace('₺', ''))
            case price.includes('$'):
            case price.includes('USD'):
                return parseFloat((parsePrice(price.replace('$', '').replace('USD', '')) * 33.50).toFixed(2))
            case price.includes('EUR'):
            case price.includes('€'):
                return parseFloat((parsePrice(price.replace('EUR', '').replace('€', '')) * 37.01).toFixed(2))



            default:

                const result = parsePrice(price)

                return result
        }
    } catch (error) {
        throw 'unhandled price parse error'
    }



}

export default mapPrice


function parsePrice(price) {
    const trimPrice = price.replaceAll(' ', '')
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
        case /^\d\d\d[.]\d\d\d$/.test(trimPrice)://106.950
            return parseFloat(trimPrice.replace('.', ''))
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
        case /^\d\d\d\d\d$/.test(trimPrice)://11499

            return parseFloat(trimPrice)
        case /^\d\d[.]\d\d\d$/.test(trimPrice)://14.918

            return parseFloat(trimPrice.replace('.', ''))
        case /^\d\d[,]\d\d\d$/.test(trimPrice)://14,918

            return parseFloat(trimPrice.replace(',', ''))
        default:
            debugger
            throw 'unhandled error'

    }

}