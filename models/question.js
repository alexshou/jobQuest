module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define("Question", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1]
    }
  });

  Question.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Question.belongsTo(models.Category, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Question;
};
