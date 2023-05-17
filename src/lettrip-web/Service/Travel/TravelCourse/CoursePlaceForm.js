/*global kakao*/

import React, { useEffect, useRef, useState } from "react";

function CoursePlaceForm({ onSave }) {
  const container = useRef();
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault(); // 페이지 새로고침 방지
    keywordSearch();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=d542bb0ad0bdf774a95a7025324f93fb&libraries=services&autoload=false";
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const options = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        };
        const map = new kakao.maps.Map(container.current, options);
        setMap(map);
      });
    };
  }, []);

  const keywordSearch = () => {
    const keyword = document.getElementById("keyword").value;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    setIsLoading(true);
    ps.keywordSearch(keyword, placesSearchCB);
  };

  useEffect(() => {
    if (map) {
      const ps = new kakao.maps.services.Places();

      const placesSearchCB = (data, status, pagination) => {
        setIsLoading(false);
        if (status === kakao.maps.services.Status.OK) {
          setSearchResults(data);
          displayPlaces(data);
          displayPagination(pagination);
          if (data.length > 0) {
            const placePosition = new kakao.maps.LatLng(data[0].y, data[0].x);
            map.setCenter(placePosition);
            addMarkers(data);
          }
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          alert("검색 결과가 존재하지 않습니다.");
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert("검색 결과 중 오류가 발생했습니다.");
        }
      };

      const displayPlaces = (places) => {
        const listEl = document.getElementById("placesList");
        removeAllChildNodes(listEl);

        for (let i = 0; i < places.length; i++) {
          const place = places[i];
          const itemEl = getListItem(place);
          listEl.appendChild(itemEl);
        }
      };

      const removeAllChildNodes = (el) => {
        while (el.hasChildNodes()) {
          el.removeChild(el.lastChild);
        }
      };

      const addMarkers = (places) => {
        removeMarkers();
        const newMarkers = places.map((place) => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(place.y, place.x),
          });
          kakao.maps.event.addListener(marker, "click", function () {
            setSelectedPlace(place);
          });
          marker.setMap(map);
          return marker;
        });

        setMarkers(newMarkers);
      };

      const removeMarkers = () => {
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        setMarkers([]);
      };

      const getListItem = (place) => {
        const el = document.createElement("li");
        const title = document.createElement("span");
        title.className = "place_title";
        title.innerHTML = place.place_name;
        const address = document.createElement("span");
        address.className = "place_address";
        address.innerHTML = place.address_name;
        el.appendChild(title);
        el.appendChild(address);
        el.addEventListener("click", () => handlePlaceSave(place));
        return el;
      };

      const displayPagination = (pagination) => {
        const paginationEl = document.getElementById("pagination");

        while (paginationEl.hasChildNodes()) {
          paginationEl.removeChild(paginationEl.lastChild);
        }
        const fragment = document.createDocumentFragment();
        const previous = document.createElement("a");
        previous.href = "#";
        previous.innerHTML = "Previous";
        previous.addEventListener("click", () => pagination.previous());
        const next = document.createElement("a");
        next.href = "#";
        next.innerHTML = "Next";
        next.addEventListener("click", () => pagination.next());

        if (pagination.hasPrev) {
          fragment.appendChild(previous);
        }
        if (pagination.hasNext) {
          fragment.appendChild(next);
        }
        paginationEl.appendChild(fragment);
      };

      document
        .getElementById("searchBtn")
        .addEventListener("click", keywordSearch);
    }
  }, [map, markers]);

  useEffect(() => {
    if (selectedPlace) {
      const selectedPlacePosition = new kakao.maps.LatLng(
        selectedPlace.y,
        selectedPlace.x
      );
      map.setCenter(selectedPlacePosition);
      // Create an info window and set its content
      const infoContent = <div>${selectedPlace.place_name}</div>;
      const infoWindow = new kakao.maps.InfoWindow({
        content: infoContent,
        position: selectedPlacePosition,
      });
      // Open the info window on the map
      infoWindow.open(map);
      // Set the info window as a state
      setInfoWindow(infoWindow);
    }
  }, [selectedPlace, map]);

  useEffect(() => {
    // Close the info window when the component unmounts
    return () => {
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [infoWindow]);

  const handlePlaceSave = (savedPlace) => {
    onSave(savedPlace);
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSearch}>
          <input type='text' id='keyword' />
          <button type='submit' id='searchBtn'>
            검색
          </button>
        </form>
      </div>
      <div
        id='map'
        ref={container}
        style={{
          width: "500px",
          height: "300px",
        }}
      ></div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul id='placesList'>
            {searchResults.map((place) => (
              <li key={place.id} onClick={() => handlePlaceSave(place)}>
                <span className='place_title'>{place.place_name}</span>
                <span className='place_address'>{place.address_name}</span>
              </li>
            ))}
          </ul>
        )}
        <div id='pagination'></div>
      </div>
    </div>
  );
}

export default CoursePlaceForm;
