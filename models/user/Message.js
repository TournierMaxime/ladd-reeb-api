import { DataTypes } from "sequelize";
import { sequelize } from "../../lib/sequelize.js";
import Account from "./Account.js";

const Message = sequelize.define(
  "Message",
  {
    messageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "sent", "error"),
      defaultValue: "new",
    },
    type: {
      type: DataTypes.ENUM("sms", "email", "push"),
    },
    recipient: {
      type: DataTypes.STRING,
    },
    sentAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Message",
    freezeTableName: true,
  }
);
export default Message;

// CASCADE update
Account.hasMany(Message, {
  foreignKey: "accountId",
  onUpdate: "CASCADE",
});
Message.belongsTo(Account, {
  foreignKey: "accountId",
  onUpdate: "CASCADE",
});
