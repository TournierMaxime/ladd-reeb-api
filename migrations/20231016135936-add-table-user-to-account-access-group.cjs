const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserToAccountAccessGroup', {
      userToAccountAccessGroupId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    return queryInterface.dropTable('UserToAccountAccessGroup')
  }
}
