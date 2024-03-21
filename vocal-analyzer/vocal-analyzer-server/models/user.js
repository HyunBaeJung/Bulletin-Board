const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      accountName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
        comment: '아이디',
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        comment: '비밀번호',
      },
      realName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: '사용자 실명',
      },
      birthday: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: '생년월일',
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
        comment: '성별',
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true,
        comment: '본인인증을 위한 이메일',
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associtate(db) {}
};

module.exports = User;
