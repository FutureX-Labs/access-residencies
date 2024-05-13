import BASE_URL from "../config";

export function GetAll(property, propertyType) {
  let url = `${BASE_URL}/api/`;
  console.log(property, propertyType);

  switch (propertyType) {
    case "ForSale":
      switch (property) {
        case "House":
          url += `houseforsale/`;
          break;
        case "Commercial":
          url += `commercialforsale/`;
          break;
        case "Apartment":
          url += `apartmentforsale/`;
          break;
        case "Land":
          url += `landforsale/`;
          break;
        default:
          // Handle invalid property type
          break;
      }
      break;
    case "ForRent":
      switch (property) {
        case "House":
          url += `houseforrent/`;
          break;
        case "Commercial":
          url += `commercialforrent/`;
          break;
        case "Apartment":
          url += `apartmentforrent/`;
          break;
        case "Land":
          url += `landforrent/`;
          break;
        default:
          // Handle invalid property type
          break;
      }
      break;
    default:
      // Handle invalid property type
      break;
  }

  return url;
}
