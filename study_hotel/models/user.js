const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(),
        allowNull: true,
      },
      birthday: {
        type: Sequelize.DATEONLY(),
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('m', 'w'),
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(),
        allowNull: true,
      },
      phonenumber: {
        type: Sequelize.STRING(),
        allowNull: true,
      },
      provider: {
        type: Sequelize.ENUM('local', 'kakao', 'naver', 'google'),
        allowNull: false,
        defaultValue: 'local',
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {}
};

module.exports = User;