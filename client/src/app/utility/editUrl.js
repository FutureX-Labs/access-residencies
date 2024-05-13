import BASE_URL from "../config";

export function EditUrl(property, propertyType, id) {
  let url = `${BASE_URL}/api/`;

  switch (propertyType) {
    case "ForSale":
      switch (property) {
        case "House":
          url += `houseforsale/edit/${id}`;
          break;
        case "Commercial":
          url += `commercialforsale/edit/${id}`;
          break;
        case "Appartment":
          url += `appartmentforsale/edit/${id}`;
          break;
        case "Land":
          url += `landforsale/edit/${id}`;
          break;
        default:
          // Handle invalid property type
          break;
      }
      break;
    case "ForRent":
      switch (property) {
        case "House":
          url += `houseforrent/edit/${id}`;
          break;
        case "Commercial":
          url += `commercialforrent/edit/${id}`;
          break;
        case "Appartment":
          url += `appartmentforrent/edit/${id}`;
          break;
        case "Land":
          url += `landforrent/edit/${id}`;
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
