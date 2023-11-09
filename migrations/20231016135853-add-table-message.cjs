const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Message', {
      messageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Account',
          key: 'accountId'
        },
        onUpdate: 'CASCADE'
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('new', 'sent', 'error'),
        defaultValue: 'new'
      },
      type: {
        type: DataTypes.ENUM('sms', 'email', 'push')
      },
      recipient: {
        type: DataTypes.STRING
      },
      sentAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Message')
  }
}
