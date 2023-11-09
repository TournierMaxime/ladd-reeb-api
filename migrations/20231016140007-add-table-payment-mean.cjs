const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PaymentMean', {
      paymentMeanId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'User',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      walletId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Wallet',
          key: 'walletId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      paymentTypeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'PaymentType',
          key: 'paymentTypeId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted: {
        type: DataTypes.BOOLEAN
      },
      isDefault: {
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('PaymentMean')
  }
}
