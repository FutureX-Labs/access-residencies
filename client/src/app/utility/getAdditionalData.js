export const GetAdditionalData = (property, propertyType) => {
  let additionalData = {};

  switch (property) {
    case "House":
    case "Appartment":
      additionalData = {
        size,
        bedroom,
        bathroom,
      };
      break;
    case "Commercial":
      additionalData = {
        size,
        propertyTypes,
      };
      break;
    case "Land":
      additionalData = {
        perches,
        acres,
      };
      break;
    default:
      break;
  }

  // Include propertyType-specific data
  if (propertyType === "ForSale") {
    additionalData.price = price;
  } else if (propertyType === "ForRent") {
    additionalData.rent = rent;
  }

  return additionalData;
};
