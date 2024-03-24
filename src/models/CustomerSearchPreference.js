import { Model, DataTypes, Sequelize } from 'sequelize';

/**
 *  CustomerSearchPreferences model function  - Represents the search preferences of a customer in the system.
 * @param {Sequelize} sequelize  - The Sequelize instance for connecting to the database.
 * @returns  {Model} CustomerSearchPreferences model definition.
 */
const CustomerSearchPreferencesModel  = (sequelize) => {


  /**
   * Represents the search preferences of a customer in the system.
   * @class CustomerSearchPreferences
   * @extends Model
   */
  class CustomerSearchPreferences extends Model {}

  /**
   * Initializes the CustomerSearchPreferences model with predefined fields and options.
   * @returns {Model} CustomerSearchPreferences model.
   * @constructor CustomerSearchPreferences
   * @param {Object} fields - The fields to define the CustomerSearchPreferences model.
   */
  CustomerSearchPreferences.init({
    preferenceID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customerProfileID: { type: DataTypes.UUID, allowNull: false, references: { model: 'customer_profile', key: 'customerprofileid' } },
    searchRadius: { type: DataTypes.INTEGER },
    preferredCategories: { type: DataTypes.TEXT },
    preferredPriceRange: { type: DataTypes.NUMERIC },
    preferredRating: { type: DataTypes.DECIMAL(2, 1) },
    lastSearch: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'CustomerSearchPreferences',
    tableName: 'customer_search_preferences',
    timestamps: true
  });

  return CustomerSearchPreferences;
};

/**
 * Exports the CustomerSearchPreferences model function.
 * @export CustomerSearchPreferencesModel
 */
export default CustomerSearchPreferencesModel;
