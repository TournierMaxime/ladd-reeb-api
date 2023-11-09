const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Order',
          key: 'orderId'
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
      paymentMeanId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'PaymentMean',
          key: 'paymentMeanId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deviceId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Devices',
          key: 'deviceId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      walletId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Wallet',
          key: 'walletId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
      },
      acceptedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Transactions')
  }
}
