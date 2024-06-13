import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API_SERVER_HOST } from "../api/memberAPI";

const { kakao } = window;
const host = API_SERVER_HOST;

const useCustomMap = () => {
  const [myLocation, setMyLocation] = useState({
    lat: 37.57163048751097,
    lng: 126.97591715920376,
    get: false,
    isLoaded: false,
  });

  // 셀렉터로 카테고리 가져오기
  const categoryFilter = useSelector((state) => state.categorySlice.category);
  const studyLocationList = useSelector(
    (state) => state.categorySlice.studyLocationList,
  );

  // 내 위치 가져오기
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            get: true,
            isLoaded: true,
          });
        });
        // console.log("Geolocation is supported by this browser.");
      } else {
        console.log("Geolocation is not supported by this browser.");
        setMyLocation({
          lat: 37.57163048751097,
          lng: 126.97591715920376,
          get: false,
          isLoaded: true,
        });
      }
      //TODO : 1초마다 위치 업데이트
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 내 위치 마커 생성
  const myLocationMarker = () => {
    const markerPosition = new kakao.maps.LatLng(
      myLocation.lat,
      myLocation.lng,
    );
    const markerImage = new kakao.maps.MarkerImage(
      "assets/imgs/icon/oval.svg",
      new kakao.maps.Size(50, 50),
      { offset: new kakao.maps.Point(25, 25) },
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    return marker;
  };

  // 지도 클릭시 마커 생성
  const createMapClickMarker = (latlng) => {
    console.log("mapClickMarker latlng: ", latlng);
    const markerPosition = latlng;
    const markerImage = new kakao.maps.MarkerImage(
      "assets/imgs/icon/ic_map_active.svg",
      new kakao.maps.Size(50, 50),
      { offset: new kakao.maps.Point(25, 25) },
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
    });

    return marker;
  };

  // 클러스터 마커 생성
  const clustererMarkers = (changePopup) => {
    const markers = studyLocationList.map((location) => {
      // console.log("location : ", location);
      let popupImg = location.thImg;
      if (!location.thImg.startsWith("http")) {
        popupImg = `${host}/api/image/view/${location.thImg}`;
      }
      const popupData = {
        id: location.id,
        thImg: popupImg,
        title: location.title,
        location: location.location,
        content: location.content,
        memberNickname: location.memberNickname,
        memberEmail: location.memberEmail,
        memberPhone: location.memberPhone,
        studyDate: location.studyDate,
        maxPeople: location.maxPeople,
        isConfirmed: location.isConfirmed,
        studyMemberList: location.studyMemberList,
        clickable: true,
      };

      var imageSrc = "/assets/imgs/icon/ic_map.svg", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(25, 50) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      let marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(location.locationY, location.locationX),
        image: markerImage,
      });
      // 마우스 오버 이벤트 리스너 추가
      kakao.maps.event.addListener(marker, "mouseover", function () {
        // 마우스 오버 시 수행할 동작, 예를 들어 마커 이미지 변경
        marker.setImage(
          new kakao.maps.MarkerImage(
            "/assets/imgs/icon/ic_map_active.svg",
            imageSize,
            imageOption,
          ),
        );
      });

      // 마우스 아웃 이벤트 리스너 추가
      kakao.maps.event.addListener(marker, "mouseout", function () {
        // 마우스 아웃 시 원래 이미지로 변경
        marker.setImage(
          new kakao.maps.MarkerImage(
            "/assets/imgs/icon/ic_map.svg",
            imageSize,
            imageOption,
          ),
        );
      });
      kakao.maps.event.addListener(marker, "click", function () {
        changePopup(popupData);
      });

      return marker;
    });
    return markers;
  };

  return {
    myLocation,
    myLocationMarker,
    clustererMarkers,
    createMapClickMarker,
  };
};
export default useCustomMap;
