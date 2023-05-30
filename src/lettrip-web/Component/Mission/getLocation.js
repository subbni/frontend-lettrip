export function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.info(
            `re:${position.coords.latitude} ${position.coords.longitude}`
          );
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        function (error) {
          console.error(error);
          resolve({
            latitude: 37.3595704,
            longitude: 127.105399,
          });
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: Infinity,
        }
      );
    }).then((coords) => {
      console.log(`coords:${JSON.stringify(coords)}`);
      return coords;
    });
  }
  alert("GPS를 허용해주세요.");
  return {
    latitude: 37.3595704,
    longtitude: 127.105399,
  };
}
