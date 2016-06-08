module.exports = {
  connection: "runic",
  schema: true,
  tableName: "mqtt_user",
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: "integer",
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: "string",
      unique: true
    },
    password: "string",
    created: "datetime"
  }
}