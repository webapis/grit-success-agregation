const priceConversionStage = [ {
    $match: {
      price: {
        $regex: /^\d{4}\.\d{2}$|^\d{3}\.\d{2}$/, // Adjust the regex to match your specific format
        $options: 's'
      }
    }
  },
  {
    $addFields: {
      convertedPrice: {
        $convert: {
          input: "$price",
          to: "double",
          onError: 0, // Set to 0 if conversion fails
          onNull: 0 // Set to 0 if the field is null
        }
      }
    }
  }]

export default priceConversionStage