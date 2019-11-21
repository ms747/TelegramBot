const Sequelize = require('sequelize');

const path = 'sqlite://database.sqlite';
const sequelize = new Sequelize(path, {
    operatorsAliases: false
});

let Command = sequelize.define('command', {
    command: Sequelize.STRING,
    description: Sequelize.STRING,
    info: Sequelize.STRING
});

Command.sync().then(() => {
  console.log('New table created');
})

module.exports = Command;