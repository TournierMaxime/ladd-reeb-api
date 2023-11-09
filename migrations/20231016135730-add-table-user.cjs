const { DataTypes } = require('sequelize')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pseudo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      braceletId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isAssociatedBracelet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      forgetPassword: {
        type: DataTypes.STRING
      },
      created: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })
    return queryInterface.addIndex('User', ['pseudo', 'braceletId', 'email'])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('User')
  }
}
