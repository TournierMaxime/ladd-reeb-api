const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AccessGroupRule', {
      accessGroupRuleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      accessGroupId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'AccessGroup',
          key: 'accessGroupId'
        },
        onUpdate: 'CASCADE'
      },
      rule: {
        type: DataTypes.STRING,
        allowNull: false
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
    return queryInterface.addIndex('AccessGroupRule', ['rule'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('AccessGroupRule')
  }
}
