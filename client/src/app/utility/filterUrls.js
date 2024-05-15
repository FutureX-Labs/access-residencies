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
        case "Apartment":
          url += "apartmentforsale/filter";
          break;
        case "Land":
          url += "landforsale/filter";
          break;
        default:
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
        case "Apartment":
          url += "apartmentforrent/filter";
          break;
        case "Land":
          url += "landforrent/filter";
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }

  return url;
}
