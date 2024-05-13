import BASE_URL from "../config";

export function FilterUrl(propertyType, property) {
  let url = `${BASE_URL}/api/`;

  switch (propertyType) {
    case "ForSale":
      switch (property) {
        case "House":
          url += "houseforsale/filter";
          break;
        case "Commercial":
          url += "commercialforsale/filter";
          break;
        case "Appartment":
          url += "appartmentforsale/filter";
          break;
        case "Land":
          url += "landforsale/filter";
          break;
        default:
          // Handle invalid property type
          break;
      }
      break;
    case "ForRent":
      switch (property) {
        case "House":
          url += "houseforrent/filter";
          break;
        case "Commercial":
          url += "commercialforrent/filter";
          break;
        case "Appartment":
          url += "appartmentforrent/filter";
          break;
        case "Land":
          url += "landforrent/filter";
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
