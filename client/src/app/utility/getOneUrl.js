import BASE_URL from "./config";

export function GetOneUrl(property, propertyType, id) {
  let url = `${BASE_URL}/api/`;
  console.log(property, propertyType, id);

  switch (propertyType) {
    case "ForSale":
      switch (property) {
        case "House":
          url += `houseforsale/${id}`;
          break;
        case "Commercial":
          url += `commercialforsale/${id}`;
          break;
        case "Apartment":
          url += `apartmentforsale/${id}`;
          break;
        case "Land":
          url += `landforsale/${id}`;
          break;
        default:
          // Handle invalid property type
          break;
      }
      break;
    case "ForRent":
      switch (property) {
        case "House":
          url += `houseforrent/${id}`;
          break;
        case "Commercial":
          url += `commercialforrent/${id}`;
          break;
        case "Apartment":
          url += `apartmentforrent/${id}`;
          break;
        case "Land":
          url += `landforrent/${id}`;
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
