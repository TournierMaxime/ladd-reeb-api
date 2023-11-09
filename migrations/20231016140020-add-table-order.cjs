const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Order', {
      orderId: {
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
      orderReference: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cancelledAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deliveredAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      orderStatus: {
        type: DataTypes.ENUM('pending', 'failed', 'completed', 'delivered'),
        defaultValue: 'pending'
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
    return queryInterface.dropTable('Order')
  }
}
