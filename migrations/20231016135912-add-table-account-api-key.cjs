const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AccountApiKey', {
      accountApiKeyId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Account',
          key: 'accountId'
        },
        onUpdate: 'CASCADE'
      },
      accessGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'AccessGroup',
          key: 'accessGroupId'
        },
        onUpdate: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING
      },
      keyHash: {
        type: DataTypes.STRING
      },
      expiresAt: {
        allowNull: true,
        type: DataTypes.DATE
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
    return queryInterface.dropTable('AccountApiKey')
  }
}
