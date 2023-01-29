const Sequelize = require('sequelize')
const sequelize = require('../service/database')

const UserStatus = sequelize.define('userstatus', {
  id       : { field: 'id'        , type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id : { field: 'user_id' , type: Sequelize.BIGINT, allowNull: false                      },
  name : { field: 'name'   , type: Sequelize.STRING                                         },
  guild_id : { field: 'guild_id' , type: Sequelize.BIGINT, allowNull: false                      },
  io : { field: 'io' , type: Sequelize.INTEGER, allowNull: false                      },
  createdAt: { field: 'created_at', type: Sequelize.DATE,                                                },
  updatedAt: { field: 'updated_at', type: Sequelize.DATE,                                               }
});

module.exports = UserStatus