module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", { //categories?
    // Giving the Author model a name of type STRING
    name: DataTypes.STRING
  });

  Category.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Category.hasMany(models.Question, {
      onDelete: "cascade"
    });
  };

  return Category;
};
