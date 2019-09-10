const Sequelize = require('sequelize')
const jsonfile = require('jsonfile')
const getModel = async(sequelize, jsonPath) => {
  const jsonData = await readJSON(jsonPath)
  const model = getModelFromJson(jsonData)
  return getModelFromJson(sequelize, jsonData)
}
const getModelFromJson = (sequelize, data) => {
  try {
    let havePK = false
    for (const prop in data[0]) {
      // 判斷是否有pk
      if (data[0][prop].primaryKey) havePK = true
      if (data[0][prop].type) {
        data[0][prop].type = getTypeFromStr(data[0][prop].type)
      }
      if (data[0][prop].defaultValue) {
        const checkValue = data[0][prop].defaultValue.toLowerCase()
        const seed = ['current_timestamp', 'current_date', 'current_time', 'localtime', 'localtimestamp']
        if (seed.indexOf(checkValue) !== -1) {
          data[0][prop].defaultValue = sequelize.literal(`'${data[0][prop].defaultValue}'`)
        }
      }
    }
    if (data[1].tableName === 'zipcode') {
      console.log(`..........option== havePK=${havePK}`)
      console.log(data[1])
    }
    let model = sequelize.define(data[1].tableName, data[0], data[1])
    // table pk not exist remove id
    if (!havePK) model.removeAttribute('id')
    return model
  } catch (e) {
    return e
  }
}
const getTypeFromStr = (typeStr) => {
  typeStr = typeStr.replace('DataTypes.', '')
  if (typeStr.indexOf('(') !== -1) {
    const type = typeStr.substr(0, typeStr.indexOf('('))
    let param = typeStr.substr(typeStr.indexOf('(') + 1, typeStr.length - 1)
    if (!isNaN(parseInt(param))) param = parseInt(param)
    return Sequelize.DataTypes[type](param)
  } else {
    return Sequelize.DataTypes[typeStr]
  }
}
const readJSON = async(sourceFile) => {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(sourceFile, (err, obj) => {
      if (err) {
        reject(err)
      } else {
        resolve(obj)
      }
    })
  })
}
module.exports = { getModel }