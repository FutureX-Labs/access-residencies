import BASE_URL from "../config";
const url = `${BASE_URL}/api/apartmentForRent/add`;

export function AddUrl(propertyType, property) {
  
  let url = `${BASE_URL}/api/`;

  switch (propertyType) {
    case "ForSale":
      switch (property) {
        case "House":
          url += "houseforsale/add";
          break;
        case "Commercial":
          url += "commercialforsale/add";
          break;
        case "Apartment":
          url += "apartmentforsale/add";
          break;
        case "Land":
          url += "landforsale/add";
          break;
        default:
          // Handle invalid property type
          break;
      }
      break;
    case "ForRent":
      switch (property) {
        case "House":
          url += "houseforrent/add";
          break;
        case "Commercial":
          url += "commercialforrent/add";
          break;
        case "Apartment":
          url += "apartmentforrent/add";
          break;
        case "Land":
          url += "landforrent/add";
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
