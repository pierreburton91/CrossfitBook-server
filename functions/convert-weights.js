exports.convertKgtoLbs = (weightString) => {
    return (parseFloat(weightString.replace(',','.')) * 2.2).toFixed(2).toString().replace('.',',');
}

exports.convertLbsToKg = (weightString) => {
    return (parseFloat(weightString.replace(',','.')) / 2.2).toFixed(2).toString().replace('.',',');
}